import React, { useRef } from 'react';
import { Card, Badge, Button, Row, Col, Image } from 'react-bootstrap';
import { FaBan, FaUnlock, FaUser, FaEnvelope, FaCalendarAlt, FaCamera } from 'react-icons/fa';
import './UserCard.css';

function UserCard({ user, onBan, onUnban, onAvatarChange }) {
    const fileInputRef = useRef(null);
    
    const handleBanClick = () => {
        if (window.confirm("Bạn có chắc chắn muốn khóa người dùng này?")) {
            onBan(user.userId);
        }
    };
    
    const handleUnbanClick = () => {
        if (window.confirm("Bạn có chắc chắn muốn mở khóa người dùng này?")) {
            onUnban(user.userId);
        }
    };
    
    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };
    
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0] && onAvatarChange) {
            onAvatarChange(user.userId, e.target.files[0]);
        }
    };

    // Tạo avatar mặc định dựa trên tên người dùng
    const getDefaultAvatar = (name) => {
        const userName = name || 'User';
        // Sử dụng UI Avatars để tạo avatar với chữ cái đầu của tên
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff&size=100&rounded=true&bold=true`;
    };

    // Sử dụng avatar từ user, nếu không có thì dùng avatar mặc định
    const avatarUrl = user.avatar || getDefaultAvatar(user.name || user.username);
    
    return (
        <Card className={`user-card shadow-sm ${user.isBanned ? 'border-danger banned-card' : 'border-primary'}`}>
            <Card.Body className="p-0">
                <Row className="g-0">
                    {/* Avatar column */}
                    <Col md={4} className="user-avatar-container d-flex flex-column align-items-center justify-content-center p-3">
                        <div className="avatar-container position-relative">
                            <Image 
                                src={avatarUrl} 
                                alt={`${user.name || user.username} avatar`} 
                                className="user-avatar mb-2"
                            />
                            
                            {onAvatarChange && (
                                <>
                                    <div className="avatar-edit" onClick={handleAvatarClick}>
                                        <FaCamera size={14} />
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="avatar-input"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </>
                            )}
                            
                            {user.isBanned && (
                                <div className="banned-overlay">
                                    <FaBan size={30} />
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-2">
                            <Badge bg={user.isBanned ? 'danger' : user.role === 'admin' ? 'primary' : 'success'}>
                                {user.isBanned ? 'Đã khóa' : user.role || 'Người dùng'}
                            </Badge>
                        </div>
                    </Col>
                    
                    {/* Phần còn lại của component giữ nguyên */}
                    <Col md={8} className="p-3">
                        <h5 className="fw-bold mb-3">{user.name || user.username}</h5>
                        
                        <div className="user-info mb-3">
                            <div className="d-flex align-items-center mb-2">
                                <FaUser className="text-secondary me-2" />
                                <span>ID: {user.userId || user.user_id}</span>
                            </div>
                            
                            <div className="d-flex align-items-center mb-2">
                                <FaEnvelope className="text-secondary me-2" />
                                <span>{user.email}</span>
                            </div>
                            
                            {user.createdAt && (
                                <div className="d-flex align-items-center">
                                    <FaCalendarAlt className="text-secondary me-2" />
                                    <span>Tham gia: {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Action buttons */}
                        <div className="mt-auto d-flex gap-2">
                            <Button
                                variant="danger"
                                className="d-flex align-items-center"
                                onClick={handleBanClick}
                                disabled={user.isBanned}
                                style={{ opacity: user.isBanned ? 0.6 : 1 }}
                            >
                                <FaBan className="me-2" />
                                <span>Khóa</span>
                            </Button>
                            
                            <Button
                                variant="success"
                                className="d-flex align-items-center"
                                onClick={handleUnbanClick}
                                disabled={!user.isBanned}
                                style={{ opacity: !user.isBanned ? 0.6 : 1 }}
                            >
                                <FaUnlock className="me-2" />
                                <span>Mở khóa</span>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
            
            {user.isBanned && (
                <div className="banned-status-badge">
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                        <FaBan className="me-1" /> Đã khóa
                    </Badge>
                </div>
            )}
        </Card>
    );
}

export default UserCard;