import React, { useContext, useState, useEffect } from "react";
import "./Notification.css";
import { UserContext } from "../../contexts/UserContext";
import { ChatContext } from "../../contexts/ChatContext";
import { getNotificationList, getUnreadCount, markNotificationAsRead } from "../../services/notificationApi";

function Notification() {
    const { user } = useContext(UserContext);
    const { notifications: chatNotifications } = useContext(ChatContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (user && user.userId) {
            fetchNotifications();
        }
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        setNotifications((prevNotifications) => {
            const updatedNotifications = [...prevNotifications];
            chatNotifications.forEach((chatNoti) => {
                // Đảm bảo mỗi thông báo đều có trường id
                const notiId = chatNoti.id || chatNoti._id || chatNoti.notificationId;
                if (!notiId) return; // Bỏ qua nếu không có id
                const index = updatedNotifications.findIndex((n) => n.id === notiId);
                const newNoti = { ...chatNoti, id: notiId }; // Đảm bảo có trường id
                if (index === -1) {
                    updatedNotifications.push(newNoti);
                } else {
                    updatedNotifications[index] = newNoti;
                }
            });
            return updatedNotifications;
        });
    }, [chatNotifications]);

    // Cập nhật số thông báo chưa đọc realtime khi notifications thay đổi
    useEffect(() => {
        const unread = notifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
    }, [notifications]);

    const fetchNotifications = async () => {
        try {
            const res = await getNotificationList(user.userId, user.accessToken);
            setNotifications(res.data || []);
            const unreadRes = await getUnreadCount(user.userId, user.accessToken);
            setUnreadCount(unreadRes.data.unread || 0);
        } catch (err) {
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    const handleMarkAsRead = async (id) => {
        // Kiểm tra id và accessToken trước khi gọi API
        if (!id || !user?.accessToken) {
            console.error("Thiếu id hoặc accessToken khi đánh dấu đã đọc", { id, accessToken: user?.accessToken });
            return;
        }
        try {
            await markNotificationAsRead(id, user.accessToken);
            // Cập nhật trạng thái đã đọc cho thông báo trong local state
            setNotifications((prev) =>
                prev.map((noti) =>
                    noti.id === id ? { ...noti, isRead: true } : noti
                )
            );
        } catch (err) {
            console.error("Lỗi khi đánh dấu đã đọc:", err);
        }
    };

    return (
        <div className="notification-wrapper">
            <div className="notification-icon" onClick={() => setShowDropdown(!showDropdown)}>
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>
            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <strong>Thông báo</strong>
                    </div>
                    {notifications.length === 0 ? (
                        <div className="notification-empty">Không có thông báo nào</div>
                    ) : (
                        notifications.map((noti) => (
                            <div
                                key={noti.id}
                                className={`notification-item${noti.isRead ? "" : " unread"}`}
                                onClick={() => handleMarkAsRead(noti.id)}
                            >
                                <div className="notification-title">{noti.title}</div>
                                <div className="notification-content">{noti.content}</div>
                                <div className="notification-date">
                                    {new Date(noti.createdAt).toLocaleString("vi-VN")}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Notification;