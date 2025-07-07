import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ChatContext } from '../../contexts/ChatContext';
import { getPrompts } from '../../services/chatApi';
import moment from 'moment';
import ScrollableFeed from 'react-scrollable-feed';
import './style.css';

const CHAT_STATE_KEY = 'chatbox_state';

const ChatBox = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { 
        conversations, 
        activeConversation, 
        sendMessage, 
        unreadCount, 
        isConnected,
        loadConversation,
        setActiveConversation
    } = useContext(ChatContext);

    // Initialize state with localStorage values if available
    const getInitialState = () => {
        try {
            const savedState = localStorage.getItem(CHAT_STATE_KEY);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                return parsedState.isOpen || false;
            }
        } catch (error) {
            console.error('Error reading chat state from localStorage:', error);
        }
        return false;
    };

    const [isOpen, setIsOpen] = useState(getInitialState);
    const [message, setMessage] = useState('');
    const [prompts, setPrompts] = useState([]);
    const [showWelcome, setShowWelcome] = useState(true);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);
    const scrollTimeoutRef = useRef(null);
    const initialLoadDoneRef = useRef(false);
    const loadingConversationRef = useRef(false);

    // Save chat state to localStorage when it changes
    useEffect(() => {
        try {
            localStorage.setItem(CHAT_STATE_KEY, JSON.stringify({
                isOpen,
                activeConversation
            }));
        } catch (error) {
            console.error('Error saving chat state to localStorage:', error);
        }
    }, [isOpen, activeConversation]);

    // Auto-load conversation on page load if user is logged in
    useEffect(() => {
        if (user?.isLoggedIn && !initialLoadDoneRef.current && !loadingConversationRef.current) {
            try {
                // Always load the saved conversation on initial render
                const savedState = localStorage.getItem(CHAT_STATE_KEY);
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    
                    if (parsedState.activeConversation) {
                        // Set the active conversation
                        setActiveConversation(parsedState.activeConversation);
                        
                        // Force load the conversation
                        loadingConversationRef.current = true;
                        setLoading(true);
                        
                        loadConversation(parsedState.activeConversation)
                            .then(() => {
                                // Check if we need to open chatbox based on stored state
                                if (parsedState.isOpen) {
                                    setIsOpen(true);
                                }
                                
                                // Set welcome message display based on conversation content
                                if (conversations[parsedState.activeConversation]?.length > 0) {
                                    setShowWelcome(false);
                                }
                            })
                            .catch(error => {
                                console.error('Error loading conversation:', error);
                            })
                            .finally(() => {
                                setLoading(false);
                                loadingConversationRef.current = false;
                                initialLoadDoneRef.current = true;
                            });
                    } else {
                        initialLoadDoneRef.current = true;
                    }
                } else {
                    initialLoadDoneRef.current = true;
                }
            } catch (error) {
                console.error('Error restoring chat state from localStorage:', error);
                initialLoadDoneRef.current = true;
            }
        }
    }, [user, loadConversation, setActiveConversation, conversations]);

    // Fetch prompt suggestions
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

    // When chatbox opens, make sure conversation is loaded
    useEffect(() => {
        // Only load if we haven't already loaded during initialization
        if (isOpen && activeConversation && loadConversation && initialLoadDoneRef.current && !loadingConversationRef.current) {
            setLoading(true);
            loadConversation(activeConversation)
                .then(() => {
                    // Hide welcome message if there are messages
                    if (conversations[activeConversation]?.length > 0) {
                        setShowWelcome(false);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen, activeConversation, loadConversation, conversations]);

    // Scroll to bottom only when new messages arrive
    useEffect(() => {
        if (activeConversation && conversations[activeConversation]) {
            const currentMessagesLength = conversations[activeConversation].length;
            
            // Only scroll if new messages were added
            if (currentMessagesLength > prevMessagesLengthRef.current) {
                // Clear any existing timeout to prevent multiple scrolls
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
                
                // Use a small timeout to ensure DOM is updated
                scrollTimeoutRef.current = setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            
            // Update the reference to the current length
            prevMessagesLengthRef.current = currentMessagesLength;
        }
    }, [conversations, activeConversation]);

    // Reset message counter when changing conversations
    useEffect(() => {
        if (activeConversation) {
            prevMessagesLengthRef.current = conversations[activeConversation]?.length || 0;
            
            // Initial scroll when conversation changes
            if (conversations[activeConversation]?.length > 0) {
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [activeConversation, conversations]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    const handleChatButtonClick = () => {
        if (!user || !user.isLoggedIn) {
            // Redirect to login if not logged in
            navigate('/auth/login');
            return;
        }

        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        if (!isConnected) {
            console.error('Cannot send message: Socket not connected');
            return;
        }

        // Gửi tin nhắn tới "system" nếu không có cuộc hội thoại nào
        // Hệ thống sẽ phân phối tin nhắn tới nhân viên tư vấn đang online
        const receiverId = activeConversation || 'system';

        sendMessage(receiverId, message);
        setMessage('');
        setShowWelcome(false); // Hide welcome message after first user message
    };

    const handlePromptClick = (promptText) => {
        if (!isConnected) {
            console.error('Cannot send message: Socket not connected');
            return;
        }

        // Gửi prompt tới "system" nếu không có cuộc hội thoại nào
        const receiverId = activeConversation || 'system';
        sendMessage(receiverId, promptText);
        setShowWelcome(false);
    };

    // Navigate to messages page
    const handleViewAll = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Chat button with notification badge */}
            <div className="chat-button-container">
                <button
                    className="chat-button"
                    onClick={handleChatButtonClick}
                >
                    <i className="fas fa-comments"></i>
                    {user?.isLoggedIn && unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
                </button>
            </div>

            {/* Chat box - only show if logged in */}
            {user?.isLoggedIn && isOpen && (
                <div className="chat-box-container">
                    <div className="chat-box-header">
                        <h5>Trò chuyện</h5>
                        <div>
                            <Link to="/messages" className="view-all-link" onClick={handleViewAll}>
                                Xem tất cả
                            </Link>
                            <button className="close-button" onClick={() => setIsOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div className="chat-box-body">
                        <ScrollableFeed>
                            {/* Loading indicator */}
                            {loading && (
                                <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Đang tải...</span>
                                    </div>
                                </div>
                            )}
                        
                            {/* Welcome message and prompts */}
                            {showWelcome && (
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

                            {/* Chat messages */}
                            {activeConversation && conversations[activeConversation]?.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message-bubble ${msg.senderId === user?.userId ? 'outgoing' : 'incoming'}`}
                                >
                                    <div className="message-content">
                                        {msg.message}
                                    </div>
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
                        </ScrollableFeed>
                    </div>

                    <div className="chat-box-footer">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            className="send-button"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || !isConnected}
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;