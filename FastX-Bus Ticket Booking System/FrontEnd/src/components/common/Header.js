import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/operator')) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { label: 'Book Ticket', path: '/', bold: true },
        { label: 'My Trips', path: '/trips' },
        { label: 'Cancel Ticket', path: '/cancel-ticket' },
        { label: 'Vehicle Tracking', path: '/vehicle-tracking' },
        { label: 'About Us', path: '/about' },
        { label: 'Help', path: '/help' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'Terms & Conditions', path: '/terms' },
    ];

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
                <div className="container">
                    <div className="d-flex align-items-center">
                        {/* Hamburger Menu Toggle */}
                        <button 
                            className="btn btn-primary border-0 me-2" 
                            type="button" 
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#navSidebar"
                        >
                            <span className="navbar-toggler-icon" style={{width: '1.2em', height: '1.2em'}}></span>
                        </button>
                        
                        <Link to="/" className="navbar-brand fw-bold mb-0 h1">
                            FastX Bus
                        </Link>
                    </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/search" className="nav-link">Search Buses</Link>
                            </li>
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <Link to="/dashboard" className="nav-link fw-bold text-white">
                                            Hi, {user?.firstName}
                                        </Link>
                                    </li>
                                    <li className="nav-item ms-lg-2">
                                        <button onClick={handleLogout} className="btn btn-outline-light btn-sm rounded-pill px-3">
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item ms-lg-2">
                                    <Link to="/auth" className="btn btn-light btn-sm px-4 rounded-pill fw-bold text-primary">Login</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Global Offcanvas Sidebar */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="navSidebar" aria-labelledby="navSidebarLabel">
                <div className="offcanvas-header bg-primary text-white py-4">
                    <div className="d-flex align-items-center">
                        <div className="bg-white rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold text-primary shadow-sm" style={{width: '45px', height: '45px'}}>
                            {user?.firstName?.[0] || 'F'}
                        </div>
                        <div>
                            <h5 className="offcanvas-title fw-bold" id="navSidebarLabel">
                                {user?.firstName || 'FastX User'}
                            </h5>
                            <p className="small mb-0 opacity-75">{user ? 'Premium Member' : 'Welcome to FastX'}</p>
                        </div>
                    </div>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <div className="list-group list-group-flush">
                        {menuItems.map((item, index) => (
                            <Link 
                                key={index} 
                                to={item.path} 
                                className={`list-group-item list-group-item-action border-0 py-3 px-4 d-flex align-items-center ${item.bold ? 'fw-bold text-primary' : ''}`}
                                onClick={() => {
                                    const offcanvas = document.getElementById('navSidebar');
                                    const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvas);
                                    if (bsOffcanvas) bsOffcanvas.hide();
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    
                    {user ? (
                        <div className="p-4 border-top mt-auto">
                            <button onClick={handleLogout} className="btn btn-outline-danger w-100 py-2">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 border-top mt-auto">
                            <Link to="/auth" className="btn btn-primary w-100 py-2 shadow-sm fw-bold" onClick={() => {
                                 const offcanvas = document.getElementById('navSidebar');
                                 const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvas);
                                 if (bsOffcanvas) bsOffcanvas.hide();
                            }}>
                                Login / Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
