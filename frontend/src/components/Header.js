import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ChatContext } from "../contexts/ChatContext";
import { UserContext } from "../contexts/UserContext";
import '../css/header.css';

export default function Header() {
    const { user, logout } = useContext(UserContext);
    const { unreadCount } = useContext(ChatContext);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <header className="sticky-header">
            <nav className="navbar navbar-expand-lg bg-white py-0">
                <div className="container">
                    {/* Logo  */}
                    <Link className="navbar-brand" to="/">
                        <img
                            src="/images/logo.png"
                            alt="Heatwave Scholarship"
                            style={{ height: '80px' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/placeholder-logo.png";
                            }}
                        />
                    </Link>

                    {/* Hamburger button for mobile */}
                    {!drawerOpen && (
                        <button
                            className="header-hamburger d-lg-none"
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open menu"
                        >
                            <span className="hamburger-icon"></span>
                        </button>
                    )}

                    {/* Menu chính giữa - desktop */}
                    <div className="mx-auto d-none d-lg-block">
                        <ul className="navbar-nav" style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                            <li className="nav-item mx-3">
                                <Link className="nav-link text-dark" to="/about">ABOUT</Link>
                            </li>
                            <li className="nav-item custom-dropdown mx-3">
                                <a className="nav-link text-dark">FIND SCHOLARSHIPS</a>
                                <ul className="dropdown-content">
                                    <li><Link to="/search-scholarships">Find Scholarships</Link></li>
                                    <li><Link to="/search-university">Find a University</Link></li>
                                    <li><Link to="/search-staff">Find a Staff</Link></li>
                                </ul>
                            </li>


                            {user.isLoggedIn && (
                                <>

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
                                    {user.role === 'seeker' && (
                                        <>
                                            <li className="nav-item mx-3">
                                                <Link to="/payment" className="nav-link text-dark">PAYMENT</Link>
                                            </li>
                                            <li className="nav-item mx-3">
                                                <Link to="/library" className="nav-link text-dark">LIBRARY</Link>
                                            </li>
                                        </>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>

                    {/* User menu */}
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
                                        <li><Link className="dropdown-item" to="/auth/login">Login</Link></li>
                                        <li><Link className="dropdown-item" to="/auth/user-register">Register</Link></li>
                                    </>
                                ) : (
                                    <>
                                        {user.role === 'admin' && (
                                            <>
                                                <li><Link className="dropdown-item" to="/admin/manage-users">Manage Users</Link></li>
                                                <li><Link className="dropdown-item" to="/manage-scholarships">Manage Scholarships</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                            </>
                                        )}
                                        {user.role === 'staff' && (
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" to="/staff/staff-dashboard">
                                                        Dashboard
                                                    </Link>
                                                </li>
                                                <li><Link className="dropdown-item" to="/staff/staff-profile">Profile</Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                            </>
                                        )}
                                        {user.role === 'seeker' && (
                                        <li><Link className="dropdown-item" to="/seeker/user-profile">Profile</Link></li>
                                        )}
                                        <li>
                                            <Link
                                                className="dropdown-item text-danger"
                                                to="/logout"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    logout();
                                                    window.location.href = "/auth/login";
                                                }}
                                            >
                                                Logout
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Drawer menu for mobile */}
                    <div className={`header-drawer ${drawerOpen ? 'open' : ''}`}>
                        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}></div>
                        <div className="drawer-content">
                            <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">&times;</button>
                            <ul className="navbar-nav" style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                                <li className="nav-item mb-3">
                                    <Link className="nav-link text-dark" to="/about" onClick={() => setDrawerOpen(false)}>ABOUT</Link>
                                </li>
                                <li className="nav-item custom-dropdown mb-3">
                                    <span className="nav-link text-dark">FIND SCHOLARSHIPS</span>
                                    <ul className="dropdown-content">
                                        <li><Link to="/search-scholarships" onClick={() => setDrawerOpen(false)}>Find Scholarships</Link></li>
                                        <li><Link to="/search-university" onClick={() => setDrawerOpen(false)}>Find a University</Link></li>
                                        <li><Link to="/search-staff" onClick={() => setDrawerOpen(false)}>Find a Staff</Link></li>
                                    </ul>
                                </li>
                                <li className="nav-item mb-3">
                                    <Link className="nav-link text-dark" to="/services" onClick={() => setDrawerOpen(false)}>SERVICES</Link>
                                </li>
                                {user.isLoggedIn && (
                                    <>
                                        <li className="nav-item mb-3">
                                            <Link to="/messages" className="nav-link text-dark position-relative" onClick={() => setDrawerOpen(false)}>
                                                MESSAGES
                                                {unreadCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                        {user.role === 'seeker' && (
                                            <>
                                                <li className="nav-item mb-3">
                                                    <Link to="/payment" className="nav-link text-dark" onClick={() => setDrawerOpen(false)}>PAYMENT</Link>
                                                </li>
                                                <li className="nav-item mb-3">
                                                    <Link to="/library" className="nav-link text-dark" onClick={() => setDrawerOpen(false)}>LIBRARY</Link>
                                                </li>
                                            </>
                                        )}
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
