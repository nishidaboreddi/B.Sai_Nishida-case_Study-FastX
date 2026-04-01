import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return <div className="container py-5 text-center">Loading...</div>;

    const isOperator = user.role === 'ROLE_OPERATOR';

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="card shadow-sm border-0 mb-4 overflow-hidden">
                            <div className="bg-primary py-4 text-center text-white">
                                <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-primary mb-2 shadow-sm" style={{width: '60px', height: '60px', fontSize: '1.5rem'}}>
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                                <h5 className="mb-0">{user.firstName} {user.lastName}</h5>
                                <p className="small mb-0 opacity-75">{user.role.replace('ROLE_', '')}</p>
                            </div>
                            <div className="list-group list-group-flush small overflow-auto" style={{maxHeight: '400px'}}>
                                <button className="list-group-item list-group-item-action border-0 py-2 fw-bold text-primary" onClick={() => navigate('/')}>Book Ticket</button>
                                <button className="list-group-item list-group-item-action border-0 py-2" onClick={() => navigate('/trips')}>My Trips</button>
                                <button className="list-group-item list-group-item-action border-0 py-2" onClick={() => navigate('/cancel-ticket')}>Cancel Ticket</button>
                                <button className="list-group-item list-group-item-action border-0 py-2" onClick={() => navigate('/vehicle-tracking')}>Vehicle Tracking</button>
                                <button className="list-group-item list-group-item-action border-0 py-2">About Us</button>
                                <button className="list-group-item list-group-item-action border-0 py-2">Help</button>
                                <button className="list-group-item list-group-item-action border-0 py-2">Contact Us</button>
                                <button className="list-group-item list-group-item-action border-0 py-2">Terms & Conditions</button>
                                <button onClick={logout} className="list-group-item list-group-item-action border-0 py-3 text-danger fw-bold border-top mt-2">Logout</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="card shadow-sm border-0 p-4">
                            <h4 className="fw-bold mb-4">{isOperator ? 'Operator Overview' : 'Recent Bookings'}</h4>
                            
                            <div className="row g-3 mb-4">
                                <div className="col-md-4">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded text-center">
                                        <label className="text-muted small fw-bold d-block mb-1">{isOperator ? 'Buses Managed' : 'Total Bookings'}</label>
                                        <p className="h3 fw-bold text-primary mb-0">0</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="bg-warning bg-opacity-10 p-3 rounded text-center">
                                        <label className="text-muted small fw-bold d-block mb-1">Pending Items</label>
                                        <p className="h3 fw-bold text-warning mb-0">0</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="bg-success bg-opacity-10 p-3 rounded text-center">
                                        <label className="text-muted small fw-bold d-block mb-1">Account Status</label>
                                        <p className="h3 fw-bold text-success mb-0 overflow-hidden text-truncate px-1">Active</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center py-5 border rounded bg-white">
                                <p className="text-muted mb-0">No {isOperator ? 'buses' : 'bookings'} found. Start your journey today!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
