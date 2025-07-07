import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { ChatContext } from '../contexts/ChatContext';
import { getContacts, markAsRead } from '../services/chatApi';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import ScrollableFeed from 'react-scrollable-feed';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/messages.css';

const Messages = () => {
    const navigate = useNavigate();
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
    
    // Redirect if user not logged in
    useEffect(() => {
        if (!user?.accessToken) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Load contacts
    useEffect(() => {
        if (user?.accessToken) {
            setLoading(true);
            getContacts(user.accessToken)
                .then(response => {
                    if (response.status === 200) {
                        // Sort contacts by last message time
                        const sortedContacts = response.data.sort((a, b) => {
                            const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
                            const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
                            return timeB - timeA;
                        });
                        
                        setContacts(sortedContacts);
                        
                        // If there's no active conversation, select the first one
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

    // Load default prompts
    useEffect(() => {
        fetch('/api/chat/prompts')
            .then(response => response.json())
            .then(data => {
                setPrompts(data.prompts);
            })
            .catch(error => {
                console.error('Error fetching prompts:', error);
            });
    }, []);

    // Handle conversation selection
    const handleSelectConversation = (contactId) => {
        if (contactId !== activeConversation) {
            loadConversation(contactId);
            
            // Mark messages as read
            if (user?.accessToken) {
                markAsRead(user.accessToken, contactId).catch(err => {
                    console.error('Error marking messages as read:', err);
                });
            }
        }
    };

    // Handle sending messages
    const handleSendMessage = () => {
        if (!message.trim() || !activeConversation) return;
        
        sendMessage(activeConversation, message);
        setMessage('');
    };

    // Handle prompt selection
    const handlePromptClick = (promptText) => {
        if (!activeConversation) return;
        
        sendMessage(activeConversation, promptText);
    };

    if (!user) {
        return <div className="loading-container">Redirecting to login...</div>;
    }

    return (
        <div className="messages-page">
            <Header />
            
            <div className="messages-container">
                <div className="messages-sidebar">
                    <div className="sidebar-header">
                        <h5>Trò chuyện</h5>
                    </div>
                    
                    <div className="contacts-list">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : contacts.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                Không có cuộc trò chuyện nào.
                            </div>
                        ) : (
                            contacts.map(contact => (
                                <div 
                                    key={contact.userId}
                                    className={`contact-item ${activeConversation === contact.userId ? 'active' : ''}`}
                                    onClick={() => handleSelectConversation(contact.userId)}
                                >
                                    <div className="contact-avatar">
                                        {contact.name ? contact.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="contact-details">
                                        <div className="contact-name">
                                            {contact.name || 'User'}
                                            {contact.unreadCount > 0 && (
                                                <span className="unread-badge">{contact.unreadCount}</span>
                                            )}
                                        </div>
                                        <div className="contact-role">
                                            {contact.role === 'staff' ? 'Tư vấn viên' : 
                                             contact.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                        </div>
                                        <div className="contact-preview">
                                            {contact.lastMessage || 'Bắt đầu cuộc trò chuyện'}
                                        </div>
                                    </div>
                                    {contact.lastMessageTime && (
                                        <div className="contact-time">
                                            {moment(contact.lastMessageTime).format('HH:mm')}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
                <div className="messages-content">
                    {activeConversation ? (
                        <>
                            <div className="conversation-header">
                                {contacts.find(c => c.userId === activeConversation)?.name || 'User'}
                                <div className="conversation-role">
                                    {contacts.find(c => c.userId === activeConversation)?.role === 'staff' ? 'Tư vấn viên' : 
                                     contacts.find(c => c.userId === activeConversation)?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                </div>
                            </div>
                            
                            <div className="conversation-body">
                                <ScrollableFeed>
                                    {/* Show prompts if no messages */}
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
                                                    >
                                                        {prompt.text}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Messages */}
                                    {conversations[activeConversation]?.map((msg, index) => (
                                        <div 
                                            key={index} 
                                            className={`message-bubble ${msg.senderId === user.userId ? 'outgoing' : 'incoming'}`}
                                        >
                                            <div className="message-content">
                                                {msg.message}
                                            </div>
                                            <div className="message-time">
                                                {moment(msg.createdAt).format('HH:mm')}
                                                {msg.senderId === user.userId && (
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
                                </ScrollableFeed>
                            </div>
                            
                            <div className="conversation-footer">
                                <input
                                    type="text"
                                    className="message-input"
                                    placeholder="Nhập tin nhắn..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button 
                                    className="send-button"
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-conversation">
                            <div className="no-conversation-icon">
                                <i className="fas fa-comments"></i>
                            </div>
                            <h4>Chọn một cuộc trò chuyện để bắt đầu</h4>
                            <p>Hoặc bắt đầu một cuộc trò chuyện mới với tư vấn viên</p>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Messages;