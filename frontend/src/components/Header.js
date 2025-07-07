import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ChatContext } from "../contexts/ChatContext";
import { UserContext } from "../contexts/UserContext";

export default function Header() {
    const { user, logout } = useContext(UserContext);
    const { unreadCount } = useContext(ChatContext);

    return (
        <header className="bg-white text-dark shadow-sm py-2">
            <nav className="navbar navbar-expand-lg bg-white py-0">
                <div className="container">
                    {/* Logo  */}
                    <a className="navbar-brand" href="/">
                        <img
                            src="/images/logo.png"
                            alt="Heatwave Scholarship"
                            style={{ height: '80px' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/placeholder-logo.png";
                            }}
                        />
                    </a>

                    {/* Menu chính giữa */}
                    <div className="mx-auto">
                        <ul className="navbar-nav" style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                            <li className="nav-item mx-3">
                                <a className="nav-link text-dark" href="/about">ABOUT</a>
                            </li>
                            <li className="nav-item mx-3">
                                <a className="nav-link text-dark" href="/search">FIND SCHOLARSHIPS</a>
                            </li>
                            <li className="nav-item mx-3">
                                <a className="nav-link text-dark" href="/services">SERVICES</a>
                            </li>
                            <li className="nav-item mx-3">
                                <Link to="/payment" className="nav-link text-dark">PAYMENT</Link>
                            </li>
                            {user.isLoggedIn && (
                                <li className="nav-item mx-3">
                                    <Link to="/messages" className="nav-link text-dark position-relative">
                                        MESSAGES
                                        {unreadCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Dropdown user menu */}
                    <div className="ms-auto">
                        <div className="dropdown">
                            <button
                                className="btn btn-light dropdown-toggle d-flex align-items-center"
                                type="button"
                                id="userMenu"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ border: 'none' }}
                            >
                                <i className="fas fa-user-circle fs-4 me-2"></i>
                                <span>
                                    {user.isLoggedIn ? `Xin chào, ${user.name}` : "Tài khoản"}
                                </span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                                {!user.isLoggedIn ? (
                                    <>
                                        <li><a className="dropdown-item" href="/auth/login">Login</a></li>
                                        <li><a className="dropdown-item" href="/auth/user-register">Register</a></li>
                                    </>
                                ) : (
                                    <>
                                        {user.role === 'admin' && (
                                            <>
                                                <li><a className="dropdown-item" href="/admin/manage-users">Manage Users</a></li>
                                                <li><a className="dropdown-item" href="/manage-scholarships">Manage Scholarships</a></li>
                                                <li><a className="dropdown-item" href="/admin/dashboard">Admin Dashboard</a></li>
                                                <li><hr className="dropdown-divider" /></li>
                                            </>
                                        )}
                                        {user.role === 'staff' && (
                                            <>
                                                <li>
                                                    <a className="dropdown-item" href="/staff/staff-dashboard">
                                                        Dashboard
                                                    </a>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                            </>
                                        )}
                                        <li><a className="dropdown-item" href="/seeker/user-profile">Profile</a></li>
                                        <li>
                                            <a
                                                className="dropdown-item text-danger"
                                                href="/logout"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    logout();
                                                    window.location.href = "/auth/login";
                                                }}
                                            >
                                                Đăng xuất
                                            </a>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}