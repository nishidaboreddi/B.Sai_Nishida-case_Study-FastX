import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/operator')) {
        return (
            <footer className="bg-white py-3 mt-auto border-top">
                <div className="container d-flex justify-content-between align-items-center">
                    <p className="mb-0 small text-dark fw-medium">Hexaware Technologies Limited. All rights reserved.</p>
                    <a href="https://www.hexaware.com" target="_blank" rel="noopener noreferrer" className="small text-dark text-decoration-none">www.hexaware.com</a>
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container text-center">
                <div className="row">
                    <div className="col-md-4 mb-3 text-md-start">
                        <h5 className="fw-bold text-primary">FastX Bus</h5>
                        <p className="small text-secondary">Making your travel safe, comfortable, and reliable across India.</p>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled small text-secondary">
                            <li><a href="/" className="text-decoration-none text-secondary">Home</a></li>
                            <li><a href="/search" className="text-decoration-none text-secondary">Search Buses</a></li>
                            <li><a href="/auth" className="text-decoration-none text-secondary">Login / Register</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3 text-md-end">
                        <h5>Contact Us</h5>
                        <p className="small text-secondary mb-0">Email: support@fastx.com</p>
                        <p className="small text-secondary">Phone: +91 98765 43210</p>
                    </div>
                </div>
                <hr className="bg-secondary opacity-25"/>
                <p className="mb-0 small text-secondary">&copy; {new Date().getFullYear()} FastX. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
