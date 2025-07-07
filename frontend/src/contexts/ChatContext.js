import React, { createContext, useContext, useState, useEffect, useReducer, useCallback } from 'react';
import io from 'socket.io-client';
import { UserContext } from './UserContext';
import { getConversation, getContacts, getUnreadMessageCount, markAsRead as markAsReadApi } from '../services/chatApi';

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

            // Nhận tin nhắn realtime
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

            // Nhận sự kiện cập nhật staff tư vấn cho seeker
            socketInstance.on('conversation_update', (data) => {
                if (data.activeStaff) {
                    setActiveConversation(data.activeStaff);
                }
            });

            socketInstance.on('read', (data) => {
                // Có thể xử lý trạng thái đã đọc ở đây nếu muốn
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        }
    }, [user?.accessToken, user?.userId, activeConversation]);

    // Gửi tin nhắn: tin đầu tiên gửi tới "system", các tin sau gửi tới staff
    const sendMessage = (receiverId, message) => {
        if (!socket || !isConnected) return;
        sendMessageToSocket(receiverId, message);
    };

    const sendMessageToSocket = (receiverId, message) => {
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
            }
        });
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
            setUnreadCount(response.data.count);
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
    const markAsRead = useCallback(async (messageIds) => {
        if (!user?.accessToken) return;
        try {
            await markAsReadApi(user.accessToken, messageIds);
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
                fetchUnreadCount,
                markAsRead,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};