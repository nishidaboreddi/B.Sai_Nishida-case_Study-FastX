import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Wallet = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow-sm border-0 p-5">
                    <h2 className="fw-bold mb-3">Please Login</h2>
                    <p className="text-muted mb-4">You need to be logged in to access your FastX Wallet.</p>
                    <button className="btn btn-primary px-5 py-2 fw-bold" onClick={() => navigate('/auth')}>Login Now</button>
                </div>
            </div>
        );
    }

    const transactions = [
        { id: 1, type: 'Cashback', amount: '+ ₹50', date: '25 Mar 2026', status: 'Success' },
        { id: 2, type: 'Ticket Booking', amount: '- ₹625', date: '24 Mar 2026', status: 'Success' },
        { id: 3, type: 'Add Money', amount: '+ ₹1000', date: '20 Mar 2026', status: 'Success' },
    ];

    return (
        <div className="bg-light min-vh-100">
            {/* Header Area */}
            <div className="bg-primary text-white py-3 shadow-sm mb-4">
                <div className="container d-flex align-items-center">
                    <button className="btn btn-primary border-0 p-0 me-3" onClick={() => navigate(-1)}>
                        <span className="h4 mb-0">&larr;</span>
                    </button>
                    <h4 className="mb-0 fw-bold flex-grow-1 text-center pe-4">My Wallet</h4>
                </div>
            </div>

            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        {/* Balance Card */}
                        <div className="card bg-primary text-white border-0 shadow-sm mb-4 overflow-hidden" style={{borderRadius: '20px'}}>
                            <div className="card-body p-4 text-center">
                                <p className="mb-1 opacity-75 small text-uppercase fw-bold ls-1">Available Balance</p>
                                <h1 className="display-4 fw-bold mb-3">₹1,425.00</h1>
                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-light px-4 fw-bold text-primary rounded-pill">Add Money</button>
                                    <button className="btn btn-outline-light px-4 fw-bold rounded-pill">Pay Bills</button>
                                </div>
                            </div>
                        </div>

                        {/* Transactions List */}
                        <div className="card border-0 shadow-sm overflow-hidden" style={{borderRadius: '20px'}}>
                            <div className="card-header bg-white py-3 border-0">
                                <h5 className="fw-bold mb-0">Recent Transactions</h5>
                            </div>
                            <div className="list-group list-group-flush">
                                {transactions.map((t) => (
                                    <div key={t.id} className="list-group-item d-flex justify-content-between align-items-center py-3 border-light">
                                        <div>
                                            <h6 className="fw-bold mb-0">{t.type}</h6>
                                            <small className="text-muted">{t.date}</small>
                                        </div>
                                        <div className="text-end">
                                            <div className={`fw-bold ${t.amount.startsWith('+') ? 'text-success' : 'text-dark'}`}>
                                                {t.amount}
                                            </div>
                                            <small className="text-success small fw-bold">{t.status}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="card-footer bg-white border-0 text-center py-3">
                                <button className="btn btn-link text-decoration-none small fw-bold">View All Activity</button>
                            </div>
                        </div>
                        
                        {/* Wallet Offers */}
                        <div className="mt-4">
                            <h6 className="fw-bold mb-3 px-1">Exclusive Offers</h6>
                            <div className="card border-0 shadow-sm bg-info bg-opacity-10 py-3 px-4 mb-3" style={{borderRadius: '15px'}}>
                                <div className="d-flex align-items-center">
                                    <span className="h3 mb-0 me-3">🎁</span>
                                    <div>
                                        <p className="fw-bold mb-0">Get 10% Cashback</p>
                                        <small className="text-muted">On bookings above ₹1000 using FastX Wallet</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
