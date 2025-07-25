import React, { createContext, useContext, useState, useEffect, useReducer, useCallback } from 'react';
import io from 'socket.io-client';
import { UserContext } from './UserContext';
import { getConversation, getContacts, getUnreadMessageCount, markAsRead as markAsReadApi, uploadFile } from '../services/chatApi';

export const ChatContext = createContext();

// Reducer quản lý conversations
const conversationsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE': {
            const { conversationId, message } = action.payload;
            return {
                ...state,
                [conversationId]: [...(state[conversationId] || []), message]
            };
        }
        case 'SET_CONVERSATION':
            return {
                ...state,
                [action.payload.userId]: action.payload.messages
            };
        case 'RESET':
            return {};
        default:
            return state;
    }
};

export const ChatProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [conversations, dispatchConversations] = useReducer(conversationsReducer, {});
    const [contacts, setContacts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeConversation, setActiveConversation] = useState(null);
    // State lưu notification
    const [notifications, setNotifications] = useState([]);

    // Kết nối socket khi user đăng nhập
    useEffect(() => {
        if (user?.accessToken) {
            const socketUrl = 'http://localhost:9092';
            const socketInstance = io(socketUrl, {
                transports: ['websocket', 'polling'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000,
                forceNew: true
            });

            socketInstance.on('connect', () => {
                setIsConnected(true);
                socketInstance.emit('join', user.userId);
            });

            socketInstance.on('disconnect', () => {
                setIsConnected(false);
            });

            // Nhận tin nhắn text
            socketInstance.on('chat', (message) => {
                const conversationId = message.senderId === user.userId
                    ? message.receiverId
                    : message.senderId;
                dispatchConversations({
                    type: 'ADD_MESSAGE',
                    payload: { conversationId, message }
                });
                // Tăng số tin chưa đọc nếu không phải activeConversation
                if (
                    message.senderId !== user.userId &&
                    (!activeConversation || activeConversation !== message.senderId)
                ) {
                    setUnreadCount(prev => prev + 1);
                }
            });

            // Nhận tin nhắn file
            socketInstance.on('file_message', (message) => {
                const conversationId = message.senderId === user.userId
                    ? message.receiverId
                    : message.senderId;
                dispatchConversations({
                    type: 'ADD_MESSAGE',
                    payload: { conversationId, message }
                });
                // Tăng số tin chưa đọc nếu không phải activeConversation
                if (
                    message.senderId !== user.userId &&
                    (!activeConversation || activeConversation !== message.senderId)
                ) {
                    setUnreadCount(prev => prev + 1);
                }
            });

            // Nhận sự kiện cập nhật staff tư vấn cho seeker
            socketInstance.on('conversation_update', (data) => {
                if (data.activeStaff) {
                    setActiveConversation(data.activeStaff);
                }
            });

            socketInstance.on('read', (data) => {
                // Có thể xử lý trạng thái đã đọc ở đây nếu muốn
            });

            // Lắng nghe notification
            socketInstance.on('notification', (data) => {
                setNotifications(prev => [...prev, data]);
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        }
    }, [user?.accessToken, user?.userId, activeConversation]);

    // Gửi tin nhắn text
    const sendMessage = (receiverId, message) => {
        return new Promise((resolve, reject) => {
            if (!socket || !isConnected) {
                reject(new Error('Socket not connected'));
                return;
            }

            const messageData = {
                senderId: user.userId,
                senderName: user.name || 'User',
                senderRole: user.role,
                receiverId: receiverId,
                message: message
            };

            socket.emit('chat', messageData, (response) => {
                if (response) {
                    dispatchConversations({
                        type: 'ADD_MESSAGE',
                        payload: {
                            conversationId: receiverId,
                            message: response
                        }
                    });
                    resolve(response);
                } else {
                    reject(new Error('No response from server'));
                }
            });
        });
    };

    // Gửi tin nhắn file
    const sendFileMessage = async (receiverId, file) => {
        try {
            if (!user?.accessToken) {
                throw new Error('User not authenticated');
            }

            // Upload file first
            const uploadResult = await uploadFile(file, user.accessToken);
            
            console.log('Upload result:', uploadResult.data);
            
            return new Promise((resolve, reject) => {
                if (!socket || !isConnected) {
                    reject(new Error('Socket not connected'));
                    return;
                }

                const fileMessageData = {
                    senderId: user.userId,
                    senderName: user.name || 'User',
                    senderRole: user.role,
                    receiverId: receiverId,
                    message: uploadResult.data.fileName || 'File attachment',
                    messageType: uploadResult.data.messageType,
                    fileUrl: uploadResult.data.fileUrl,
                    fileName: uploadResult.data.fileName,
                    fileType: uploadResult.data.fileType,
                    fileSize: uploadResult.data.fileSize
                };

                console.log('Sending file message data:', fileMessageData);

                socket.emit('file_message', fileMessageData, (response) => {
                    console.log('File message response:', response);
                    if (response) {
                        dispatchConversations({
                            type: 'ADD_MESSAGE',
                            payload: {
                                conversationId: receiverId,
                                message: response
                            }
                        });
                        resolve(response);
                    } else {
                        reject(new Error('No response from server'));
                    }
                });
            });
        } catch (error) {
            console.error('Error in sendFileMessage:', error);
            throw error;
        }
    };

    // Load hội thoại với 1 user (staff hoặc seeker)
    const loadConversation = async (userId) => {
        if (!user?.accessToken) return;
        try {
            const response = await getConversation(user.accessToken, userId);
            if (response.status === 200) {
                dispatchConversations({
                    type: 'SET_CONVERSATION',
                    payload: { userId, messages: response.data }
                });
                setActiveConversation(userId);
                if (socket && isConnected) {
                    socket.emit('read', {
                        senderId: userId,
                        receiverId: user.userId
                    });
                }
                try {
                    await markAsReadApi(user.accessToken, userId);
                    await fetchUnreadCount();
                } catch (err) {
                    // Bỏ qua lỗi API
                }
            }
        } catch (error) {
            // Bỏ qua lỗi load
        }
    };

    // Lấy số lượng tin nhắn chưa đọc
    const fetchUnreadCount = useCallback(async () => {
        if (!user?.accessToken) return;
        try {
            const response = await getUnreadMessageCount(user.accessToken);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            setUnreadCount(0);
        }
    }, [user?.accessToken]);

    // Tự động cập nhật số lượng tin nhắn chưa đọc mỗi 30s
    useEffect(() => {
        if (!user?.accessToken) return;
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount, user?.accessToken]);

    // Đánh dấu đã đọc và cập nhật số lượng chưa đọc
    const markAsRead = useCallback(async (otherUserId) => {
        if (!user?.accessToken) return;
        try {
            await markAsReadApi(user.accessToken, otherUserId);
            await fetchUnreadCount();
        } catch (error) {
            // Bỏ qua lỗi
        }
    }, [user?.accessToken, fetchUnreadCount]);

    return (
        <ChatContext.Provider
            value={{
                socket,
                isConnected,
                conversations,
                contacts,
                unreadCount,
                activeConversation,
                setActiveConversation,
                loadConversation,
                sendMessage,
                sendFileMessage,
                fetchUnreadCount,
                markAsRead,
                notifications,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};