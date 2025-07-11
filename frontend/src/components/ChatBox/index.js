import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ChatContext } from '../../contexts/ChatContext';
import { getPrompts, getContacts, markAsRead } from '../../services/chatApi';
import moment from 'moment';
import { useWebRTC } from '../../hooks/useWebRTC';
import CallInterface from '../CallInterface';
import './style.css';

const ChatBox = ({ setContactButtonOpen }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const {
        socket,
        conversations,
        activeConversation,
        sendMessage,
        sendFileMessage,
        unreadCount,
        isConnected,
        loadConversation,
        setActiveConversation
    } = useContext(ChatContext);

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [prompts, setPrompts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [contactsLoaded, setContactsLoaded] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const messagesEndRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);
    const fileInputRef = useRef(null);

    // Add WebRTC hook
    const webRTC = useWebRTC(socket, user);

    // Auto scroll to bottom - chỉ scroll khi có tin nhắn mới
    useEffect(() => {
        if (activeConversation && conversations[activeConversation]) {
            const currentLength = conversations[activeConversation].length;
            if (currentLength > prevMessagesLengthRef.current) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                prevMessagesLengthRef.current = currentLength;
            }
        }
    }, [conversations, activeConversation]);

    // Load contacts when user logs in and chat is opened
    useEffect(() => {
        if (user?.accessToken && isOpen && !contactsLoaded) {
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
                        setContactsLoaded(true);

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
    }, [user?.accessToken, isOpen, contactsLoaded]);

    // Load prompts
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

    // Load conversation when opening chat
    useEffect(() => {
        if (isOpen && activeConversation && loadConversation && contactsLoaded) {
            loadConversation(activeConversation);
        }
    }, [isOpen, activeConversation, contactsLoaded]);

    const handleChatButtonClick = () => {
        if (!user || !user.isLoggedIn) {
            navigate('/auth/login');
            return;
        }
        setIsOpen(!isOpen);

        // Reset contacts loaded state when closing
        if (isOpen) {
            setContactsLoaded(false);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isSending || !activeConversation) return;
        if (!isConnected) {
            console.error('Cannot send message: Socket not connected');
            return;
        }

        setIsSending(true);
        try {
            await sendMessage(activeConversation, message);
            setMessage('');

            // Refresh contacts after sending (only if contacts are loaded)
            if (user?.accessToken && contactsLoaded) {
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
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handlePromptClick = async (promptText) => {
        if (!isConnected || isSending || !activeConversation) {
            console.error('Cannot send message: Socket not connected or already sending');
            return;
        }

        setIsSending(true);
        try {
            await sendMessage(activeConversation, promptText);
        } catch (error) {
            console.error('Error sending prompt message:', error);
        } finally {
            setIsSending(false);
        }
    };

    // Function to handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !activeConversation || isUploading) return;

        setIsUploading(true);
        try {
            await sendFileMessage(activeConversation, file);

            // Refresh contacts after sending file
            if (user?.accessToken && contactsLoaded) {
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

    const handleViewAll = () => {
        setIsOpen(false);
    };

    // Function to render message content based on type
    const renderMessageContent = (msg) => {
        if (msg.messageType === 'image') {
            return (
                <div className="image-message">
                    <img
                        src={msg.fileUrl}
                        alt={msg.fileName || 'Image'}
                        style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            objectFit: 'cover'
                        }}
                        onClick={() => window.open(msg.fileUrl, '_blank')}
                    />
                    {msg.fileName && (
                        <div className="file-info">
                            <small>{msg.fileName}</small>
                        </div>
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
                </div>
            );
        } else {
            // Regular text message
            return <span>{msg.message}</span>;
        }
    };

    return (
        <>
            {/* Add Call Interface */}
            <CallInterface {...webRTC} />

            <div className="chat-button-container">
                <button className="chat-button" onClick={handleChatButtonClick}>
                    <i className="fas fa-comments"></i>
                    {user?.isLoggedIn && unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
                </button>
            </div>

            {user?.isLoggedIn && isOpen && (
                <div className="chat-box-container">
                    <div className="chat-box-header">
                        <h5>Trò chuyện</h5>
                        <div>
                            {/* Add call buttons */}
                            <button
                                className="control-btn me-2"
                                onClick={() => webRTC.startCall('system', 'Tư vấn viên hỗ trợ', false)}
                                title="Audio Call"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <i className="fas fa-phone"></i>
                            </button>
                            <button
                                className="control-btn me-2"
                                onClick={() => webRTC.startCall('system', 'Tư vấn viên hỗ trợ', true)}
                                title="Video Call"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <i className="fas fa-video"></i>
                            </button>
                            <Link to="/messages" className="view-all-link" onClick={handleViewAll}>
                                Xem tất cả
                            </Link>
                            <button className="close-button" onClick={() => setIsOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div className="chat-box-body">
                        {loading && (
                            <div className="text-center py-3">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                            </div>
                        )}

                        {(!conversations[activeConversation] || conversations[activeConversation].length === 0) && (
                            <div className="welcome-container">
                                <div className="system-message">
                                    <p>Xin chào! 👋</p>
                                    <p>Bạn cần tư vấn về vấn đề gì?</p>
                                </div>
                                <div className="prompt-container">
                                    {prompts.map(prompt => (
                                        <button
                                            key={prompt.id}
                                            className="prompt-button"
                                            onClick={() => handlePromptClick(prompt.text)}
                                            disabled={isSending || !isConnected}
                                        >
                                            {prompt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeConversation && conversations[activeConversation]?.map((msg, index) => (
                            <div
                                key={`${msg.id || index}-${msg.createdAt}`}
                                className={`message-bubble ${msg.senderId === user?.userId ? 'outgoing' : 'incoming'}`}
                            >
                                {renderMessageContent(msg)}
                                <div className="message-time">
                                    {moment(msg.createdAt).format('HH:mm')}
                                    {msg.senderId === user?.userId && (
                                        <span className="read-status">
                                            {msg.isRead ? (
                                                <i className="fas fa-check-double text-primary"></i>
                                            ) : (
                                                <i className="fas fa-check"></i>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-box-footer">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        />
                        <button
                            className="file-upload-button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || !isConnected}
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
                            className="chat-input"
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                            disabled={isSending}
                        />
                        <button
                            className="send-button"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || !isConnected || isSending}
                        >
                            {isSending ? (
                                <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fas fa-paper-plane"></i>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;