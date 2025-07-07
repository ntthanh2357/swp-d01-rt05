package com.swp391_g6.demo.service;

import com.swp391_g6.demo.dto.ChatDTO;
import com.swp391_g6.demo.entity.Chat;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.repository.ChatRepository;
import com.swp391_g6.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Chat saveMessage(String senderId, String receiverId, String message) {
        User sender = userRepository.findById(senderId).orElse(null);
        User receiver = userRepository.findById(receiverId).orElse(null);
        
        if (sender == null || receiver == null) {
            throw new RuntimeException("Sender or receiver not found");
        }
        
        Chat chat = new Chat(sender, receiver, message);
        return chatRepository.save(chat);
    }
    
    public List<ChatDTO> getConversation(String userId1, String userId2) {
        User user1 = userRepository.findById(userId1).orElse(null);
        User user2 = userRepository.findById(userId2).orElse(null);
        
        if (user1 == null || user2 == null) {
            return new ArrayList<>();
        }
        
        List<Chat> chats = chatRepository.findConversation(user1, user2);
        return chats.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public void markAsRead(String senderId, String receiverId) {
        User sender = userRepository.findById(senderId).orElse(null);
        User receiver = userRepository.findById(receiverId).orElse(null);
        
        if (sender != null && receiver != null) {
            chatRepository.markAsRead(sender, receiver);
        }
    }
    
    public long countUnreadMessages(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return 0;
        return chatRepository.countUnreadMessages(user);
    }
    
    public List<Map<String, Object>> getContactList(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return new ArrayList<>();
        
        // Get all users who have sent or received messages with this user
        List<User> senders = chatRepository.findDistinctSenders(user);
        List<User> receivers = chatRepository.findDistinctReceivers(user);
        
        // Combine and remove duplicates
        Set<User> contacts = new HashSet<>();
        contacts.addAll(senders);
        contacts.addAll(receivers);
        
        // Create a response with user info and unread message counts
        return contacts.stream().map(contact -> {
            Map<String, Object> contactInfo = new HashMap<>();
            contactInfo.put("userId", contact.getUserId());
            contactInfo.put("name", contact.getName());
            contactInfo.put("role", contact.getRole());
            
            // Find last message
            List<Chat> conversation = chatRepository.findConversation(user, contact);
            Chat lastMessage = conversation.isEmpty() ? null : conversation.get(conversation.size() - 1);
            
            if (lastMessage != null) {
                contactInfo.put("lastMessage", lastMessage.getMessage());
                contactInfo.put("lastMessageTime", lastMessage.getCreatedAt());
                
                // Count unread messages from this contact
                long unreadCount = conversation.stream()
                        .filter(chat -> chat.getSender().equals(contact) && !chat.isRead())
                        .count();
                contactInfo.put("unreadCount", unreadCount);
            } else {
                contactInfo.put("lastMessage", "");
                contactInfo.put("lastMessageTime", null);
                contactInfo.put("unreadCount", 0);
            }
            
            return contactInfo;
        }).collect(Collectors.toList());
    }
    
    private ChatDTO convertToDTO(Chat chat) {
        ChatDTO dto = new ChatDTO();
        dto.setChatId(chat.getChatId());
        dto.setSenderId(chat.getSender().getUserId());
        dto.setSenderName(chat.getSender().getName());
        dto.setSenderRole(chat.getSender().getRole());
        dto.setReceiverId(chat.getReceiver().getUserId());
        dto.setReceiverName(chat.getReceiver().getName());
        dto.setReceiverRole(chat.getReceiver().getRole());
        dto.setMessage(chat.getMessage());
        dto.setRead(chat.isRead());
        dto.setCreatedAt(chat.getCreatedAt());
        return dto;
    }
}