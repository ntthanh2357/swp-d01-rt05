package com.swp391_g6.demo.socket;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.swp391_g6.demo.dto.ChatDTO;
import com.swp391_g6.demo.entity.Chat;
import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.entity.Staff;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.repository.StaffRepository;
import com.swp391_g6.demo.service.SeekerStaffMappingService;
import com.swp391_g6.demo.service.ChatService;
import com.swp391_g6.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ChatSocketHandler {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private SeekerStaffMappingService seekerStaffMappingService;

    @Autowired
    private SocketIOServer socketIOServer;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    private final Map<String, UUID> userClients = new HashMap<>();
    private final Map<String, String> userRoleMap = new HashMap<>();
    private final Map<String, String> userPeerMap = new HashMap<>();

    @PostConstruct
    private void init() {
        System.out.println("---------------------------------------------");
        System.out.println("INITIALIZING CHAT SOCKET HANDLER");
        System.out.println("---------------------------------------------");
        try {
            socketIOServer.addConnectListener(onConnected());
            socketIOServer.addDisconnectListener(onDisconnected());
            socketIOServer.addEventListener("join", String.class, onUserJoined());
            socketIOServer.addEventListener("chat", ChatDTO.class, onChatReceived());
            socketIOServer.addEventListener("file_message", ChatDTO.class, onFileMessageReceived());
            socketIOServer.addEventListener("read", Map.class, (DataListener<Map>) onMessagesRead());
            socketIOServer.addEventListener("call_request", Map.class, onCallRequest());
            socketIOServer.addEventListener("call_accepted", Map.class, onCallAccepted());
            socketIOServer.addEventListener("call_rejected", Map.class, onCallRejected());
            socketIOServer.addEventListener("call_ended", Map.class, onCallEnded());
            socketIOServer.addEventListener("register_peer", Map.class, onRegisterPeer());
            socketIOServer.addEventListener("get_peer_id", Map.class, onGetPeerId());

            System.out.println("All event listeners registered successfully");
            System.out.println("Socket server configuration:");
            System.out.println("  - Host: " + socketIOServer.getConfiguration().getHostname());
            System.out.println("  - Port: " + socketIOServer.getConfiguration().getPort());
            System.out.println("  - Origin: " + socketIOServer.getConfiguration().getOrigin());
            System.out.println("  - Transport: " + socketIOServer.getConfiguration().getTransports());
            System.out.println("---------------------------------------------");
        } catch (Exception e) {
            System.err.println("ERROR INITIALIZING SOCKET HANDLER: " + e.getMessage());
            e.printStackTrace();
            System.out.println("---------------------------------------------");
        }
    }

    private ConnectListener onConnected() {
        return client -> {
            System.out.println("✅ CLIENT CONNECTED: " + client.getSessionId());
            System.out.println("  - Remote address: " + client.getRemoteAddress());
            System.out.println("  - Transport: " + client.getTransport().name());
            System.out.println("  - Handshake data: " + client.getHandshakeData().getUrl());
            System.out.println("  - Headers: " + client.getHandshakeData().getHttpHeaders());
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            System.out.println("❌ CLIENT DISCONNECTED: " + client.getSessionId());

            Optional<String> userId = userClients.entrySet().stream()
                    .filter(entry -> entry.getValue().equals(client.getSessionId()))
                    .map(Map.Entry::getKey)
                    .findFirst();

            userId.ifPresent(id -> {
                userClients.remove(id);
                String role = userRoleMap.remove(id);
                System.out.println("  - Removed user mapping for: " + id);

                if ("seeker".equals(role)) {
                    SeekerStaffMapping mapping = seekerStaffMappingService.getMappingBySeeker(id);
                    if (mapping != null) {
                        Staff staff = staffRepository.findByStaffId(mapping.getStaffId());
                        if (staff != null && staff.getCurrentSeekerCount() != null
                                && staff.getCurrentSeekerCount() > 0) {
                            staff.setCurrentSeekerCount(staff.getCurrentSeekerCount() - 1);
                            staffRepository.save(staff);
                        }
                        seekerStaffMappingService.removeMapping(id);
                    }
                }
            });
        };
    }

    private DataListener<String> onUserJoined() {
        return (client, userId, ackRequest) -> {
            System.out.println("👤 USER JOINED: " + userId);
            System.out.println("  - Client ID: " + client.getSessionId());

            userClients.put(userId, client.getSessionId());

            User user = userService.getUserById(userId);
            if (user != null) {
                userRoleMap.put(userId, user.getRole());
                System.out.println("  - User role: " + user.getRole());
            }

            System.out.println("  - Added to userClients, count: " + userClients.size());

            if (ackRequest.isAckRequested()) {
                ackRequest.sendAckData("User joined successfully");
                System.out.println("  - Acknowledgment sent");
            }
        };
    }

    private DataListener<ChatDTO> onChatReceived() {
        return (client, data, ackRequest) -> {
            System.out.println("📝 CHAT MESSAGE RECEIVED:");
            System.out.println("  - From: " + data.getSenderId() + " (" + data.getSenderName() + ")");
            System.out.println("  - To: " + data.getReceiverId());
            System.out.println(
                    "  - Message: " + (data.getMessage().length() > 50 ? data.getMessage().substring(0, 50) + "..."
                            : data.getMessage()));

            try {
                if ("system".equals(data.getReceiverId())) {
                    handleSystemMessage(client, data, ackRequest);
                } else {
                    handleDirectMessage(client, data, ackRequest);
                }
            } catch (Exception e) {
                System.out.println("? ERROR PROCESSING MESSAGE: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    public DataListener<ChatDTO> onFileMessageReceived() {
        return (client, fileMessage, ackSender) -> {
            try {
                System.out.println("? FILE MESSAGE RECEIVED:");
                System.out.println("  - From: " + fileMessage.getSenderId() + " (" + fileMessage.getSenderName() + ")");
                System.out.println("  - To: " + fileMessage.getReceiverId());
                System.out.println("  - File: " + fileMessage.getFileName() + " (" + fileMessage.getFileType() + ")");
                System.out.println("  - Message Type: " + fileMessage.getMessageType());
                System.out.println("  - File URL: " + fileMessage.getFileUrl());

                String targetUserId = fileMessage.getReceiverId();
                if ("system".equals(targetUserId)) {
                    handleSystemFileMessage(client, fileMessage, ackSender);
                } else {
                    handleDirectFileMessage(client, fileMessage, ackSender);
                }
            } catch (Exception e) {
                System.out.println("? ERROR PROCESSING FILE MESSAGE: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    private void handleSystemMessage(SocketIOClient client, ChatDTO data, AckRequest ackRequest) {
        System.out.println("  - Processing SYSTEM message");

        SeekerStaffMapping mapping = seekerStaffMappingService.getMappingBySeeker(data.getSenderId());
        String staffId = null;

        if (mapping != null) {
            staffId = mapping.getStaffId();
            System.out.println("  - Seeker đã có staff: " + staffId);
        } else {
            List<String> onlineStaffIds = userRoleMap.entrySet().stream()
                    .filter(entry -> "staff".equals(entry.getValue()))
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            if (onlineStaffIds.isEmpty()) {
                staffId = "USER0000000126";
            } else {
                List<Staff> onlineStaffs = staffRepository.findAllById(onlineStaffIds);
                Staff selected = onlineStaffs.stream()
                        .min((s1, s2) -> Integer.compare(
                                s1.getCurrentSeekerCount() == null ? 0 : s1.getCurrentSeekerCount(),
                                s2.getCurrentSeekerCount() == null ? 0 : s2.getCurrentSeekerCount()))
                        .orElse(null);

                if (selected != null) {
                    staffId = selected.getStaffId();
                    selected.setCurrentSeekerCount(
                            (selected.getCurrentSeekerCount() == null ? 0 : selected.getCurrentSeekerCount()) + 1);
                    staffRepository.save(selected);
                    seekerStaffMappingService.assignStaffToSeeker(data.getSenderId(), staffId);
                } else {
                    staffId = onlineStaffIds.get(0);
                }
            }
        }

        Chat savedChat = chatService.saveMessage(data.getSenderId(), staffId, data.getMessage());
        ChatDTO chatDTO = convertChatToDTO(savedChat);

        UUID staffSessionId = userClients.get(staffId);
        if (staffSessionId != null) {
            socketIOServer.getClient(staffSessionId).sendEvent("chat", chatDTO);
        }

        SocketIOClient senderClient = socketIOServer.getClient(userClients.get(data.getSenderId()));
        if (senderClient != null) {
            Map<String, String> conversationUpdate = new HashMap<>();
            conversationUpdate.put("activeStaff", staffId);
            senderClient.sendEvent("conversation_update", conversationUpdate);
        }

        if (ackRequest.isAckRequested()) {
            ackRequest.sendAckData(chatDTO);
        }
    }

    private void handleSystemFileMessage(SocketIOClient client, ChatDTO data, AckRequest ackRequest) {
        System.out.println("  - Processing SYSTEM file message");

        SeekerStaffMapping mapping = seekerStaffMappingService.getMappingBySeeker(data.getSenderId());
        String staffId = null;

        if (mapping != null) {
            staffId = mapping.getStaffId();
        } else {
            List<String> onlineStaffIds = userRoleMap.entrySet().stream()
                    .filter(entry -> "staff".equals(entry.getValue()))
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            if (onlineStaffIds.isEmpty()) {
                staffId = "USER0000000126";
            } else {
                List<Staff> onlineStaffs = staffRepository.findAllById(onlineStaffIds);
                Staff selected = onlineStaffs.stream()
                        .min((s1, s2) -> Integer.compare(
                                s1.getCurrentSeekerCount() == null ? 0 : s1.getCurrentSeekerCount(),
                                s2.getCurrentSeekerCount() == null ? 0 : s2.getCurrentSeekerCount()))
                        .orElse(null);

                if (selected != null) {
                    staffId = selected.getStaffId();
                    selected.setCurrentSeekerCount(
                            (selected.getCurrentSeekerCount() == null ? 0 : selected.getCurrentSeekerCount()) + 1);
                    staffRepository.save(selected);
                    seekerStaffMappingService.assignStaffToSeeker(data.getSenderId(), staffId);
                } else {
                    staffId = onlineStaffIds.get(0);
                }
            }
        }

        Chat savedChat = chatService.saveFileMessage(
                data.getSenderId(),
                staffId,
                data.getMessage(),
                data.getMessageType(),
                data.getFileUrl(),
                data.getFileName(),
                data.getFileType(),
                data.getFileSize());

        ChatDTO chatDTO = convertChatToDTO(savedChat);

        UUID staffSessionId = userClients.get(staffId);
        if (staffSessionId != null) {
            socketIOServer.getClient(staffSessionId).sendEvent("file_message", chatDTO);
        }

        SocketIOClient senderClient = socketIOServer.getClient(userClients.get(data.getSenderId()));
        if (senderClient != null) {
            Map<String, String> conversationUpdate = new HashMap<>();
            conversationUpdate.put("activeStaff", staffId);
            senderClient.sendEvent("conversation_update", conversationUpdate);
        }

        if (ackRequest.isAckRequested()) {
            ackRequest.sendAckData(chatDTO);
        }
    }

    private void handleDirectMessage(SocketIOClient client, ChatDTO data, AckRequest ackRequest) {
        Chat savedChat = chatService.saveMessage(data.getSenderId(), data.getReceiverId(), data.getMessage());
        System.out.println("  - Message saved with ID: " + savedChat.getChatId());

        ChatDTO chatDTO = convertChatToDTO(savedChat);

        UUID receiverSessionId = userClients.get(data.getReceiverId());
        if (receiverSessionId != null) {
            System.out.println("  - Receiver online! Broadcasting message...");
            SocketIOClient receiverClient = socketIOServer.getClient(receiverSessionId);
            if (receiverClient != null) {
                receiverClient.sendEvent("chat", chatDTO);
                System.out.println("  - Message broadcasted to receiver");
            } else {
                System.out.println("  - ⚠️ Receiver client not found despite session ID in map");
            }
        } else {
            System.out.println("  - Receiver not online, message will be stored only");
        }

        if (ackRequest.isAckRequested()) {
            System.out.println("  - Sending acknowledgment to sender");
            ackRequest.sendAckData(chatDTO);
        }
    }

    private void handleDirectFileMessage(SocketIOClient client, ChatDTO data, AckRequest ackRequest) {
        try {
            // Save file message to database với đầy đủ thông tin
            Chat savedMessage = chatService.saveFileMessage(
                    data.getSenderId(),
                    data.getReceiverId(),
                    data.getMessage(),
                    data.getMessageType(), // Đảm bảo messageType được lưu đúng
                    data.getFileUrl(),
                    data.getFileName(),
                    data.getFileType(),
                    data.getFileSize());

            // Create response DTO với đầy đủ thông tin file
            ChatDTO responseMessage = convertChatToDTO(savedMessage);

            System.out.println("? Sending file message response:");
            System.out.println("  - Message Type: " + responseMessage.getMessageType());
            System.out.println("  - File URL: " + responseMessage.getFileUrl());
            System.out.println("  - File Name: " + responseMessage.getFileName());

            // Send to sender (acknowledgment)
            if (ackRequest.isAckRequested()) {
                ackRequest.sendAckData(responseMessage);
            }

            // Send to receiver if online
            UUID receiverClientId = userClients.get(data.getReceiverId());
            if (receiverClientId != null) {
                SocketIOClient receiverClient = socketIOServer.getClient(receiverClientId);
                if (receiverClient != null) {
                    receiverClient.sendEvent("file_message", responseMessage);
                }
            }

            // Broadcast to all clients of receiver (for multiple tabs)
            socketIOServer.getRoomOperations(data.getReceiverId()).sendEvent("file_message", responseMessage);

        } catch (Exception e) {
            System.out.println("? ERROR in handleDirectFileMessage: " + e.getMessage());
            e.printStackTrace();
            if (ackRequest.isAckRequested()) {
                ackRequest.sendAckData("Error: " + e.getMessage());
            }
        }
    }

    // Gửi notification realtime cho user
    public void sendNotification(String userId, String title, String content) {
        UUID clientId = userClients.get(userId);
        if (clientId != null) {
            SocketIOClient client = socketIOServer.getClient(clientId);
            if (client != null) {
                Map<String, Object> notification = new HashMap<>();
                notification.put("title", title);
                notification.put("content", content);
                notification.put("timestamp", System.currentTimeMillis());
                client.sendEvent("notification", notification);
            }
        }
    }

    // Call request handler
    @SuppressWarnings("rawtypes")
    private DataListener<Map> onCallRequest() {
        return (client, data, ackRequest) -> {
            try {
                String senderId = (String) data.get("senderId");
                String senderName = (String) data.get("senderName");
                String receiverId = (String) data.get("receiverId");
                String receiverName = (String) data.get("receiverName");
                Boolean isVideoCall = (Boolean) data.get("isVideoCall");
                Map<String, Object> signal = (Map<String, Object>) data.get("signal");

                System.out.println("📞 CALL REQUEST:");
                System.out.println("  - From: " + senderName + " (" + senderId + ")");
                System.out.println("  - To: " + receiverName + " (" + receiverId + ")");
                System.out.println("  - Type: " + (isVideoCall ? "Video" : "Audio"));

                // Handle system calls
                if ("system".equals(receiverId)) {
                    // Route to appropriate staff
                    SeekerStaffMapping mapping = seekerStaffMappingService.getMappingBySeeker(senderId);
                    String staffId = null;

                    if (mapping != null) {
                        staffId = mapping.getStaffId();
                    } else {
                        // Find available staff
                        List<String> onlineStaffIds = userRoleMap.entrySet().stream()
                                .filter(entry -> "staff".equals(entry.getValue()))
                                .map(Map.Entry::getKey)
                                .collect(Collectors.toList());

                        if (!onlineStaffIds.isEmpty()) {
                            staffId = onlineStaffIds.get(0);
                            seekerStaffMappingService.assignStaffToSeeker(senderId, staffId);
                        }
                    }

                    if (staffId != null) {
                        receiverId = staffId;
                        User staff = userService.getUserById(staffId);
                        receiverName = staff != null ? staff.getName() : "Staff";
                    }
                }

                UUID receiverSessionId = userClients.get(receiverId);
                if (receiverSessionId != null) {
                    SocketIOClient receiverClient = socketIOServer.getClient(receiverSessionId);
                    if (receiverClient != null) {
                        Map<String, Object> callData = new HashMap<>();
                        callData.put("senderId", senderId);
                        callData.put("senderName", senderName);
                        callData.put("receiverId", receiverId);
                        callData.put("receiverName", receiverName);
                        callData.put("isVideoCall", isVideoCall);
                        callData.put("signal", signal);

                        receiverClient.sendEvent("incoming_call", callData);
                        System.out.println("  - Call request sent to receiver");
                    }
                } else {
                    System.out.println("  - Receiver not online");
                    // Send busy signal back to caller
                    client.sendEvent("call_rejected", Map.of("reason", "User not available"));
                }

            } catch (Exception e) {
                System.err.println("❌ ERROR HANDLING CALL REQUEST: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    // Call accepted handler
    @SuppressWarnings("rawtypes")
    private DataListener<Map> onCallAccepted() {
        return (client, data, ackRequest) -> {
            try {
                String senderId = (String) data.get("senderId");
                String receiverId = (String) data.get("receiverId");
                Map<String, Object> signal = (Map<String, Object>) data.get("signal");

                System.out.println("✅ CALL ACCEPTED:");
                System.out.println("  - From: " + senderId);
                System.out.println("  - To: " + receiverId);

                UUID receiverSessionId = userClients.get(receiverId);
                if (receiverSessionId != null) {
                    SocketIOClient receiverClient = socketIOServer.getClient(receiverSessionId);
                    if (receiverClient != null) {
                        receiverClient.sendEvent("call_accepted", data);
                        System.out.println("  - Call accepted signal sent");
                    }
                }

            } catch (Exception e) {
                System.err.println("❌ ERROR HANDLING CALL ACCEPTED: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    // Call rejected handler
    @SuppressWarnings("rawtypes")
    private DataListener<Map> onCallRejected() {
        return (client, data, ackRequest) -> {
            try {
                String senderId = (String) data.get("senderId");
                String receiverId = (String) data.get("receiverId");

                System.out.println("❌ CALL REJECTED:");
                System.out.println("  - From: " + senderId);
                System.out.println("  - To: " + receiverId);

                UUID receiverSessionId = userClients.get(receiverId);
                if (receiverSessionId != null) {
                    SocketIOClient receiverClient = socketIOServer.getClient(receiverSessionId);
                    if (receiverClient != null) {
                        receiverClient.sendEvent("call_rejected", data);
                        System.out.println("  - Call rejected signal sent");
                    }
                }

            } catch (Exception e) {
                System.err.println("❌ ERROR HANDLING CALL REJECTED: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    // Register peer ID
    @SuppressWarnings("rawtypes")
    private DataListener<Map> onRegisterPeer() {
        return (client, data, ackRequest) -> {
            try {
                String userId = (String) data.get("userId");
                String peerId = (String) data.get("peerId");

                System.out.println("🎯 REGISTER PEER:");
                System.out.println("  - User ID: " + userId);
                System.out.println("  - Peer ID: " + peerId);

                userPeerMap.put(userId, peerId);
                System.out.println("  - Peer registered successfully");

                if (ackRequest.isAckRequested()) {
                    ackRequest.sendAckData("Peer registered");
                }

            } catch (Exception e) {
                System.err.println("❌ ERROR REGISTERING PEER: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    // Get peer ID
    @SuppressWarnings("rawtypes")
    private DataListener<Map> onGetPeerId() {
        return (client, data, ackRequest) -> {
            try {
                String userId = (String) data.get("userId");

                System.out.println("🔍 GET PEER ID REQUEST:");
                System.out.println("  - For User ID: " + userId);

                String peerId = userPeerMap.get(userId);

                Map<String, Object> response = new HashMap<>();
                if (peerId != null) {
                    response.put("peerId", peerId);
                    System.out.println("  - Found Peer ID: " + peerId);
                } else {
                    response.put("error", "User not online or peer not registered");
                    System.out.println("  - User not found or peer not registered");
                }

                if (ackRequest.isAckRequested()) {
                    ackRequest.sendAckData(response);
                }

            } catch (Exception e) {
                System.err.println("❌ ERROR GETTING PEER ID: " + e.getMessage());
                e.printStackTrace();
                if (ackRequest.isAckRequested()) {
                    ackRequest.sendAckData(Map.of("error", "Server error"));
                }
            }
        };
    }

    // Call ended handler
    @SuppressWarnings("rawtypes")
    private DataListener<Map> onCallEnded() {
        return (client, data, ackRequest) -> {
            try {
                String senderId = (String) data.get("senderId");
                String receiverId = (String) data.get("receiverId");

                System.out.println("📞 CALL ENDED:");
                System.out.println("  - From: " + senderId);
                System.out.println("  - To: " + receiverId);

                UUID receiverSessionId = userClients.get(receiverId);
                if (receiverSessionId != null) {
                    SocketIOClient receiverClient = socketIOServer.getClient(receiverSessionId);
                    if (receiverClient != null) {
                        receiverClient.sendEvent("call_ended", data);
                        System.out.println("  - Call ended signal sent");
                    }
                }

            } catch (Exception e) {
                System.err.println("❌ ERROR HANDLING CALL ENDED: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    private ChatDTO convertChatToDTO(Chat chat) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setChatId(chat.getChatId());
        chatDTO.setSenderId(chat.getSender().getUserId());
        chatDTO.setSenderName(chat.getSender().getName());
        chatDTO.setSenderRole(chat.getSender().getRole());
        chatDTO.setReceiverId(chat.getReceiver().getUserId());
        chatDTO.setReceiverName(chat.getReceiver().getName());
        chatDTO.setReceiverRole(chat.getReceiver().getRole());
        chatDTO.setMessage(chat.getMessage());
        chatDTO.setMessageType(chat.getMessageType());
        chatDTO.setFileUrl(chat.getFileUrl());
        chatDTO.setFileName(chat.getFileName());
        chatDTO.setFileType(chat.getFileType());
        chatDTO.setFileSize(chat.getFileSize());
        chatDTO.setRead(chat.isRead());
        chatDTO.setCreatedAt(chat.getCreatedAt());
        return chatDTO;
    }

    @SuppressWarnings("rawtypes")
    private DataListener onMessagesRead() {
        return new DataListener<Map>() {
            @Override
            public void onData(SocketIOClient client, Map data, AckRequest ackRequest) {
                try {
                    String senderId = (String) data.get("senderId");
                    String receiverId = (String) data.get("receiverId");

                    System.out.println("📚 MARKING MESSAGES AS READ:");
                    System.out.println("  - From sender: " + senderId);
                    System.out.println("  - To receiver: " + receiverId);

                    chatService.markAsRead(senderId, receiverId);
                    System.out.println("  - Messages marked as read in database");

                    UUID senderSessionId = userClients.get(senderId);
                    if (senderSessionId != null) {
                        System.out.println("  - Sender is online, sending read notification");
                        Map<String, Object> readInfo = new HashMap<>();
                        readInfo.put("receiverId", receiverId);

                        SocketIOClient senderClient = socketIOServer.getClient(senderSessionId);
                        if (senderClient != null) {
                            senderClient.sendEvent("read", readInfo);
                            System.out.println("  - Read notification sent to sender");
                        } else {
                            System.out.println("  - ⚠️ Sender client not found despite session ID in map");
                        }
                    } else {
                        System.out.println("  - Sender not online, no notification sent");
                    }

                    if (ackRequest.isAckRequested()) {
                        ackRequest.sendAckData("Messages marked as read");
                        System.out.println("  - Acknowledgment sent");
                    }
                } catch (Exception e) {
                    System.err.println("❌ ERROR MARKING MESSAGES AS READ: " + e.getMessage());
                    e.printStackTrace();

                    if (ackRequest.isAckRequested()) {
                        Map<String, Object> error = new HashMap<>();
                        error.put("error", e.getMessage());
                        ackRequest.sendAckData(error);
                    }
                }
            }
        };
    }
}