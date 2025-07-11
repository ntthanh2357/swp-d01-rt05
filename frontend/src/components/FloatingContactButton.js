import React, { useState, useEffect } from "react";
import RegisterForm from "./Register-book";
import "../css/FloatingContactButton.css";
import '../css/ContactWidget.css';

const FloatingContactButton = ({ setChatBoxOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // XÓA useEffect gây lỗi tự tắt popup

    const toggleContactBox = () => {
        setChatBoxOpen(false); // Luôn tắt chatbox trước
        setIsOpen((prev) => !prev);
    };
    const toggleForm = () => setShowForm(!showForm);

    return (
        <div>
            {/* Floating button */}
            <button
                onClick={toggleContactBox}
                className="contact-widget-btn"
                aria-label="Contact"
            >
                🤙
            </button>

            {/* Contact info popup */}
            {isOpen && (
                <div className="contact-popup">
                    <div className="contact-item">
                        <div
                            onClick={toggleForm}
                            className="contact-link full-item"
                            style={{ cursor: "pointer" }}
                        >
                            <span className="icon">🗓</span>
                            <div className="text-container">
                                <span className="text">Book an appointment</span>
                                <span className="subtext">We'll call you back</span>
                            </div>
                        </div>
                    </div>

                    <div className="contact-item">
                        <a
                            href="https://facebook.com/NamGudBoizz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link full-item"
                        >
                            <img src="/icons/fb-icon.png" alt="Facebook" className="icon-img" />
                            <span className="text">Facebook</span>
                        </a>
                    </div>

                    <div className="contact-item">
                        <a
                            href="https://zalo.me/0867955247"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link full-item"
                        >
                            <img src="/icons/zalo-icon.jpg" alt="Zalo" className="icon-img" />
                            <span className="text">Zalo</span>
                        </a>
                    </div>
                </div>
            )}

            {/* Hiển thị form popup */}
            {showForm && (
                <div className="register-form-popup">
                    <button className="close-form" onClick={toggleForm}>×</button>
                    <RegisterForm />
                </div>
            )}
        </div>
    );
};

export default FloatingContactButton;
