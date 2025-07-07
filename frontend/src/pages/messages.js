import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import { ChatContext } from '../contexts/ChatContext';
import { getContacts, markAsRead } from '../services/chatApi';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import ScrollableFeed from 'react-scrollable-feed';
import Header from '../components/Header';
import '../css/messages.css';

const Messages = () => {
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const { user } = useContext(UserContext);
    const {
        conversations,
        activeConversation,
        sendMessage,
        loadConversation,
        setActiveConversation
    } = useContext(ChatContext);

    const [contacts, setContacts] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [prompts, setPrompts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Auth check logic
    useEffect(() => {
        const checkAuth = setTimeout(() => {
            if (!user?.accessToken) {
                navigate('/auth/login');
            }
            setIsCheckingAuth(false);
        }, 300);

        return () => clearTimeout(checkAuth);
    }, [user, navigate]);

    // Load contacts
    useEffect(() => {
        if (user?.accessToken) {
            setLoading(true);
            getContacts(user.accessToken)
                .then(response => {
                    if (response.status === 200) {
                        const sortedContacts = response.data.sort((a, b) => {
                            const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
                            const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
                            return timeB - timeA;
                        });

                        setContacts(sortedContacts);

                        if (sortedContacts.length > 0 && !activeConversation) {
                            loadConversation(sortedContacts[0].userId);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching contacts:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user?.accessToken, activeConversation, loadConversation]);

    // Auto scroll to bottom
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (activeConversation && conversations[activeConversation]?.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversations, activeConversation]);

    // Load default prompts
    useEffect(() => {
        fetch('/api/chat/prompts')
            .then(response => response.json())
            .then(data => {
                setPrompts(data.prompts || []);
            })
            .catch(error => {
                console.error('Error fetching prompts:', error);
                setPrompts([]);
            });
    }, []);

    // Handle conversation selection
    const handleSelectConversation = (contactId) => {
        if (contactId !== activeConversation) {
            if (typeof loadConversation === 'function') {
                loadConversation(contactId);

                if (user?.accessToken) {
                    markAsRead(user.accessToken, contactId)
                        .catch(err => {
                            console.error('Error marking messages as read:', err);
                        })
                        .finally(() => {
                            // Sau khi đánh dấu đã đọc, cập nhật lại contacts
                            getContacts(user.accessToken)
                                .then(response => {
                                    if (response.status === 200) {
                                        const sortedContacts = response.data.sort((a, b) => {
                                            const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
                                            const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
                                            return timeB - timeA;
                                        });
                                        setContacts(sortedContacts);
                                    }
                                });
                        });
                }
            } else {
                setActiveConversation(contactId);
            }
        }
    };

    // Handle sending messages
    const handleSendMessage = () => {
        if (!message.trim() || !activeConversation) return;

        sendMessage(activeConversation, message);
        setMessage('');

        // Sau khi gửi tin nhắn, đánh dấu đã đọc và cập nhật lại contacts
        if (user?.accessToken) {
            markAsRead(user.accessToken, activeConversation)
                .catch(err => {
                    console.error('Error marking messages as read:', err);
                })
                .finally(() => {
                    getContacts(user.accessToken)
                        .then(response => {
                            if (response.status === 200) {
                                const sortedContacts = response.data.sort((a, b) => {
                                    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
                                    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
                                    return timeB - timeA;
                                });
                                setContacts(sortedContacts);
                            }
                        });
                });
        }
    };

    // Handle prompt selection
    const handlePromptClick = (promptText) => {
        if (!activeConversation) return;
        sendMessage(activeConversation, promptText);
    };

    // Filter contacts based on search
    const filteredContacts = contacts.filter(contact =>
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isCheckingAuth) {
        return (
            <div className="messenger-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p>Đang kiểm tra thông tin đăng nhập...</p>
            </div>
        );
    }

    if (!user?.accessToken) {
        return null;
    }

    return (
        <div className="messenger-page-container">
            <div className="messenger-container">
                {/* Sidebar */}
                <div className="messenger-sidebar">
                    {/* Sidebar Header */}
                    <div className="messenger-sidebar-header">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4 className="mb-0 fw-bold">Đoạn chat</h4>
                            <div className="d-flex gap-2">
                                <button className="btn btn-light btn-sm rounded-circle p-2">
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                                <button className="btn btn-light btn-sm rounded-circle p-2">
                                    <i className="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="messenger-search">
                        <div className="position-relative">
                            <i className="fas fa-search position-absolute search-icon"></i>
                            <input
                                type="text"
                                className="form-control messenger-search-input"
                                placeholder="Tìm kiếm trên Messenger"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Contacts List */}
                    <div className="messenger-contacts">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="fas fa-comments fa-3x mb-3 text-muted"></i>
                                <p>Không có cuộc trò chuyện nào.</p>
                            </div>
                        ) : (
                            filteredContacts.map(contact => (
                                <div
                                    key={contact.userId}
                                    className={`messenger-contact-item ${activeConversation === contact.userId ? 'active' : ''}`}
                                    onClick={() => handleSelectConversation(contact.userId)}
                                >
                                    <div className="messenger-avatar-container">
                                        <div className="messenger-avatar">
                                            {contact.avatar ? (
                                                <img src={contact.avatar} alt={contact.name} />
                                            ) : (
                                                <span>{contact.name ? contact.name.charAt(0).toUpperCase() : 'U'}</span>
                                            )}
                                        </div>
                                        {contact.isOnline && <div className="online-indicator"></div>}
                                    </div>
                                    <div className="messenger-contact-info">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h6 className="messenger-contact-name mb-1">
                                                {contact.name || 'User'}
                                            </h6>
                                            <small className="messenger-timestamp">
                                                {contact.lastMessageTime ? moment(contact.lastMessageTime).format('HH:mm') : ''}
                                            </small>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="messenger-last-message mb-0">
                                                {contact.lastMessage || 'Bắt đầu cuộc trò chuyện'}
                                            </p>
                                            {contact.unreadCount > 0 && (
                                                <span className="messenger-unread-badge">{contact.unreadCount}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="messenger-chat-area">
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="messenger-chat-header">
                                <div className="d-flex align-items-center">
                                    <div className="messenger-avatar-container me-3">
                                        <div className="messenger-avatar messenger-avatar-sm">
                                            {contacts.find(c => c.userId === activeConversation)?.avatar ? (
                                                <img
                                                    src={contacts.find(c => c.userId === activeConversation)?.avatar}
                                                    alt="Avatar"
                                                />
                                            ) : (
                                                <span>
                                                    {contacts.find(c => c.userId === activeConversation)?.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            )}
                                        </div>
                                        {contacts.find(c => c.userId === activeConversation)?.isOnline && (
                                            <div className="online-indicator"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="mb-0 fw-bold">
                                            {contacts.find(c => c.userId === activeConversation)?.name || 'User'}
                                        </h5>
                                        <small className="text-muted">
                                            {contacts.find(c => c.userId === activeConversation)?.isOnline ?
                                                'Đang hoạt động' : 'Hoạt động 17 phút trước'}
                                        </small>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-light btn-sm rounded-circle p-2">
                                        <i className="fas fa-phone text-primary"></i>
                                    </button>
                                    <button className="btn btn-light btn-sm rounded-circle p-2">
                                        <i className="fas fa-video text-primary"></i>
                                    </button>
                                    <button className="btn btn-light btn-sm rounded-circle p-2">
                                        <i className="fas fa-info-circle text-primary"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="messenger-messages">
                                <ScrollableFeed>
                                    {/* Welcome message and prompts */}
                                    {(!conversations[activeConversation] || conversations[activeConversation].length === 0) && (
                                        <div className="messenger-welcome">
                                            <div className="text-center mb-4">
                                                <div className="messenger-avatar messenger-avatar-lg mx-auto mb-3">
                                                    {contacts.find(c => c.userId === activeConversation)?.avatar ? (
                                                        <img
                                                            src={contacts.find(c => c.userId === activeConversation)?.avatar}
                                                            alt="Avatar"
                                                        />
                                                    ) : (
                                                        <span>
                                                            {contacts.find(c => c.userId === activeConversation)?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                                <h5 className="fw-bold">
                                                    {contacts.find(c => c.userId === activeConversation)?.name || 'User'}
                                                </h5>
                                                <p className="text-muted">
                                                    Bạn đã kết nối trên Messenger. Hãy bắt đầu cuộc trò chuyện!
                                                </p>
                                            </div>

                                            {prompts.length > 0 && (
                                                <div className="messenger-prompts">
                                                    {prompts.map(prompt => (
                                                        <button
                                                            key={prompt.id}
                                                            className="btn btn-outline-primary btn-sm me-2 mb-2 rounded-pill"
                                                            onClick={() => handlePromptClick(prompt.text)}
                                                        >
                                                            {prompt.text}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Messages */}
                                    {conversations[activeConversation]?.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`messenger-message ${msg.senderId === user.userId ? 'own' : 'other'}`}
                                        >
                                            {msg.senderId !== user.userId && (
                                                <div className="messenger-avatar messenger-avatar-xs me-2">
                                                    {contacts.find(c => c.userId === activeConversation)?.avatar ? (
                                                        <img
                                                            src={contacts.find(c => c.userId === activeConversation)?.avatar}
                                                            alt="Avatar"
                                                        />
                                                    ) : (
                                                        <span>
                                                            {contacts.find(c => c.userId === activeConversation)?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="messenger-message-bubble">
                                                <p className="mb-0">{msg.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </ScrollableFeed>
                            </div>

                            {/* Message Input */}
                            <div className="messenger-input-area">
                                <div className="d-flex align-items-end gap-2">
                                    <button className="btn btn-light btn-sm rounded-circle p-2">
                                        <i className="fas fa-plus text-primary"></i>
                                    </button>
                                    <button className="btn btn-light btn-sm rounded-circle p-2">
                                        <i className="fas fa-camera text-primary"></i>
                                    </button>
                                    <button className="btn btn-light btn-sm rounded-circle p-2">
                                        <i className="fas fa-image text-primary"></i>
                                    </button>
                                    <button className="btn btn-light btn-sm rounded-circle p-2">
                                        <i className="fas fa-microphone text-primary"></i>
                                    </button>

                                    <div className="flex-grow-1 position-relative">
                                        <input
                                            type="text"
                                            className="form-control messenger-message-input"
                                            placeholder="Aa"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        <button className="btn btn-link position-absolute end-0 top-50 translate-middle-y p-2">
                                            <i className="fas fa-smile text-primary"></i>
                                        </button>
                                    </div>

                                    <button
                                        className={`btn btn-sm rounded-circle p-2 ${message.trim() ? 'btn-primary' : 'btn-light'}`}
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                    >
                                        <i className={`fas fa-paper-plane ${message.trim() ? 'text-white' : 'text-primary'}`}></i>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="messenger-no-chat">
                            <div className="text-center">
                                <i className="fas fa-comments fa-5x text-muted mb-4"></i>
                                <h4 className="fw-bold mb-2">Chọn một cuộc trò chuyện</h4>
                                <p className="text-muted">Chọn từ các cuộc trò chuyện hiện có hoặc bắt đầu cuộc trò chuyện mới.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Header moved to bottom */}
            <div className="messenger-header-container">
                <Header />
            </div>
        </div>
    );
};

export default Messages;