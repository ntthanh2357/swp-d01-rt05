import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { ChatContext } from '../contexts/ChatContext';
import { getContacts, markAsRead, getPrompts } from '../services/chatApi';
import moment from 'moment';
import Header from '../components/Header';
import '../css/messages.css';
import { useWebRTC } from '../hooks/useWebRTC';
import CallInterface from '../components/CallInterface';

const Messages = () => {
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const { user } = useContext(UserContext);
    const {
        socket,
        conversations,
        activeConversation,
        sendMessage,
        sendFileMessage,
        loadConversation,
        setActiveConversation
    } = useContext(ChatContext);

    const [contacts, setContacts] = useState([]);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [prompts, setPrompts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Add WebRTC hook
    const webRTC = useWebRTC(socket, user);

    // Auth check logic
    useEffect(() => {
        if (user !== undefined) {
            if (!user || !user.isLoggedIn) {
                navigate('/auth/login');
                setIsCheckingAuth(false);
            } else {
                setIsCheckingAuth(false);
            }
        }
    }, [user, navigate]);

    // Load contacts
    useEffect(() => {
        if (user?.accessToken && !isCheckingAuth) {
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

                        // Auto-select first contact if no active conversation
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
    }, [user?.accessToken, isCheckingAuth, activeConversation, loadConversation]);

    // Auto scroll to bottom
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations, activeConversation]);

    // Load default prompts
    useEffect(() => {
        getPrompts()
            .then(response => {
                if (response.status === 200) {
                    setPrompts(response.data.prompts);
                }
            })
            .catch(error => {
                console.error('Error fetching prompts:', error);
            });
    }, []);

    // Handle conversation selection
    const handleSelectConversation = (contactId) => {
        if (typeof loadConversation === 'function') {
            loadConversation(contactId);

            if (user?.accessToken) {
                markAsRead(user.accessToken, contactId)
                    .catch(err => console.error('Error marking messages as read:', err))
                    .finally(() => {
                        // Refresh contacts list
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
                            })
                            .catch(err => console.error('Error refreshing contacts:', err));
                    });
            }
        } else {
            setActiveConversation(contactId);
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
                .catch(err => console.error('Error marking messages as read:', err))
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
                        })
                        .catch(err => console.error('Error refreshing contacts:', err));
                });
        }
    };

    // Add file upload handler
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !activeConversation || isUploading) return;

        setIsUploading(true);
        try {
            await sendFileMessage(activeConversation, file);

            // Refresh contacts after sending file
            if (user?.accessToken) {
                markAsRead(user.accessToken, activeConversation)
                    .catch(err => console.error('Error marking messages as read:', err))
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
                            })
                            .catch(err => console.error('Error refreshing contacts:', err));
                    });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Lỗi khi gửi file: ' + error.message);
        } finally {
            setIsUploading(false);
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Function to render message content based on type
    const renderMessageContent = (msg) => {
        // Thêm console.log để debug
        console.log('Message data:', msg);
        console.log('Message type:', msg.messageType);
        console.log('File URL:', msg.fileUrl);
        console.log('File name:', msg.fileName);

        if (msg.messageType === 'image') {
            return (
                <div className="image-message">
                    <img
                        src={msg.fileUrl}
                        alt={msg.fileName || 'Image'}
                        className="message-image"
                        style={{
                            maxWidth: '300px',
                            maxHeight: '200px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            objectFit: 'cover'
                        }}
                        onClick={() => window.open(msg.fileUrl, '_blank')}
                    />
                    {msg.message && msg.message !== msg.fileName && (
                        <div className="message-text">{msg.message}</div>
                    )}
                </div>
            );
        } else if (msg.messageType === 'document') {
            return (
                <div className="document-message">
                    <div className="document-info">
                        <div className="document-icon">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="document-details">
                            <div className="document-name">{msg.fileName}</div>
                            <div className="document-size">
                                {msg.fileSize ? `${(msg.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}
                            </div>
                        </div>
                        <a
                            href={msg.fileUrl}
                            download={msg.fileName}
                            className="download-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fas fa-download"></i>
                        </a>
                    </div>
                    {msg.message && msg.message !== msg.fileName && (
                        <div className="message-text">{msg.message}</div>
                    )}
                </div>
            );
        } else {
            // Regular text message
            return <span>{msg.message}</span>;
        }
    };

    // Handle call buttons
    const handleVideoCall = (contactId, contactName) => {
        webRTC.startCall(contactId, contactName, true);
    };

    const handleAudioCall = (contactId, contactName) => {
        webRTC.startCall(contactId, contactName, false);
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
            {/* Add Call Interface */}
            <CallInterface {...webRTC} />

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
                                                    {activeConversation === 'system'
                                                        ? 'S'
                                                        : contacts.find(c => c.userId === activeConversation)?.name?.charAt(0) || 'U'
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="mb-0">
                                            {activeConversation === 'system'
                                                ? 'Tư vấn viên hỗ trợ'
                                                : contacts.find(c => c.userId === activeConversation)?.name || 'User'
                                            }
                                        </h5>
                                        <small className="text-muted">
                                            {activeConversation === 'system' ? 'Luôn sẵn sàng hỗ trợ' : 'Đang hoạt động'}
                                        </small>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-light btn-sm rounded-circle p-2"
                                        onClick={() => handleAudioCall(
                                            activeConversation,
                                            activeConversation === 'system'
                                                ? 'Tư vấn viên hỗ trợ'
                                                : contacts.find(c => c.userId === activeConversation)?.name || 'User'
                                        )}
                                        title="Audio Call"
                                    >
                                        <i className="fas fa-phone"></i>
                                    </button>
                                    <button
                                        className="btn btn-light btn-sm rounded-circle p-2"
                                        onClick={() => handleVideoCall(
                                            activeConversation,
                                            activeConversation === 'system'
                                                ? 'Tư vấn viên hỗ trợ'
                                                : contacts.find(c => c.userId === activeConversation)?.name || 'User'
                                        )}
                                        title="Video Call"
                                    >
                                        <i className="fas fa-video"></i>
                                    </button>
                                    <button className="btn btn-light btn-sm rounded-circle p-2">
                                        <i className="fas fa-info-circle"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="messenger-messages">
                                {(!conversations[activeConversation] || conversations[activeConversation].length === 0) && (
                                    <div className="messenger-welcome">
                                        <div className="text-center">
                                            <div className="messenger-avatar messenger-avatar-lg mx-auto mb-3">
                                                <span>
                                                    {activeConversation === 'system'
                                                        ? 'S'
                                                        : contacts.find(c => c.userId === activeConversation)?.name?.charAt(0) || 'U'
                                                    }
                                                </span>
                                            </div>
                                            <h5>
                                                {activeConversation === 'system'
                                                    ? 'Chào mừng đến với dịch vụ tư vấn!'
                                                    : `Bắt đầu trò chuyện với ${contacts.find(c => c.userId === activeConversation)?.name || 'User'}`
                                                }
                                            </h5>
                                            <p className="text-muted mb-4">
                                                {activeConversation === 'system'
                                                    ? 'Hãy cho chúng tôi biết bạn cần tư vấn về vấn đề gì?'
                                                    : 'Gửi tin nhắn để bắt đầu cuộc trò chuyện'
                                                }
                                            </p>
                                            {activeConversation === 'system' && (
                                                <div className="messenger-prompts">
                                                    {prompts.map(prompt => (
                                                        <button
                                                            key={prompt.id}
                                                            className="btn btn-outline-primary btn-sm me-2 mb-2"
                                                            onClick={() => handlePromptClick(prompt.text)}
                                                        >
                                                            {prompt.text}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeConversation && conversations[activeConversation]?.map((msg, index) => (
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
                                                        {contacts.find(c => c.userId === activeConversation)?.name?.charAt(0) || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="messenger-message-content">
                                            <div className="messenger-message-bubble">
                                                {renderMessageContent(msg)}
                                            </div>
                                            <div className="messenger-message-time">
                                                {moment(msg.createdAt).format('HH:mm')}
                                                {msg.senderId === user.userId && (
                                                    <span className="read-status ms-1">
                                                        {msg.isRead ? (
                                                            <i className="fas fa-check-double text-primary"></i>
                                                        ) : (
                                                            <i className="fas fa-check"></i>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="messenger-input-area">
                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                    />
                                    <button
                                        className="btn btn-light btn-sm rounded-circle p-2"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading || !activeConversation}
                                        title="Gửi file"
                                    >
                                        {isUploading ? (
                                            <i className="fas fa-spinner fa-spin"></i>
                                        ) : (
                                            <i className="fas fa-paperclip"></i>
                                        )}
                                    </button>
                                    <input
                                        type="text"
                                        className="form-control messenger-message-input"
                                        placeholder="Nhập tin nhắn..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
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