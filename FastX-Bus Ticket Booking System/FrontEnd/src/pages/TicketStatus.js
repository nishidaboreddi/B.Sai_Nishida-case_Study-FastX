import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';

const TicketStatus = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('enquiry');
    const [formData, setFormData] = useState({ ticketNo: '', mobileNo: '' });
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.ticketNo) {
            setError('Please enter a Ticket Number.');
            return;
        }
        setLoading(true);
        setError('');
        setBooking(null);
        try {
            const response = await bookingService.getBookingByTicketNo(formData.ticketNo.trim());
            setBooking(response.data);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data;
            setError(msg || 'No booking found for this ticket number. Please check and try again.');
        } finally {
            setLoading(false);
        }
    };

    const statusColor = (status) => {
        if (!status) return 'secondary';
        const s = status.toUpperCase();
        if (s === 'CONFIRMED') return 'success';
        if (s === 'CANCELLED') return 'danger';
        if (s === 'PENDING') return 'warning';
        return 'secondary';
    };

    return (
        <div className="bg-light min-vh-100">
            {/* Header */}
            <div className="bg-primary text-white py-3 shadow-sm mb-0">
                <div className="container d-flex align-items-center">
                    <button className="btn btn-primary border-0 p-0 me-3" onClick={() => navigate(-1)}>
                        <span className="h4 mb-0">&larr;</span>
                    </button>
                    <h4 className="mb-0 fw-bold flex-grow-1 text-center pe-4">Ticket Status</h4>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-primary text-white pt-2 shadow-sm mb-5">
                <div className="container">
                    <div className="d-flex justify-content-around text-center small fw-bold">
                        {['enquiry', 'transaction', 'service'].map(tab => (
                            <div
                                key={tab}
                                className={`flex-grow-1 py-3 px-1 ${activeTab === tab ? 'border-bottom border-white border-4' : 'opacity-75'}`}
                                onClick={() => { setActiveTab(tab); setBooking(null); setError(''); }}
                                style={{ cursor: 'pointer' }}
                            >
                                {tab === 'enquiry' ? 'Ticket\u00a0Enquiry' : tab === 'transaction' ? 'Transaction\u00a0Status' : 'Service\u00a0Status'}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-8">

                        {activeTab === 'enquiry' && (
                            <>
                                <form onSubmit={handleSubmit} className="px-3">
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            id="ticketNo"
                                            className="form-control form-control-lg py-3 shadow-sm border-0"
                                            placeholder="Ticket No. (e.g. FX123456)"
                                            value={formData.ticketNo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <input
                                            type="tel"
                                            id="mobileNo"
                                            className="form-control form-control-lg py-3 shadow-sm border-0"
                                            placeholder="Mobile No. (optional)"
                                            value={formData.mobileNo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger py-2 small mb-4">{error}</div>
                                    )}
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-danger btn-lg px-5 py-2 fw-bold shadow"
                                            disabled={loading}
                                            style={{ borderRadius: '12px', minWidth: '200px' }}
                                        >
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" /><span>Checking...</span></>
                                            ) : 'Submit'}
                                        </button>
                                    </div>
                                </form>

                                {booking && (
                                    <div className="mt-4 px-3">
                                        <div className="card border-0 shadow overflow-hidden" style={{ borderRadius: '16px' }}>
                                            <div className="card-header bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <p className="small mb-0 opacity-75">Ticket Number</p>
                                                    <h5 className="fw-bold mb-0">{booking.ticketNo}</h5>
                                                </div>
                                                <span className={`badge bg-${statusColor(booking.bookingStatus)} fs-6 px-3 py-2`}>
                                                    {booking.bookingStatus || 'UNKNOWN'}
                                                </span>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="row g-3">
                                                    <div className="col-6">
                                                        <p className="text-muted small mb-1">Route</p>
                                                        <p className="fw-bold mb-0">{booking.routeName || '—'}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p className="text-muted small mb-1">Operator</p>
                                                        <p className="fw-bold mb-0">{booking.busOperator || '—'}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p className="text-muted small mb-1">Journey Date</p>
                                                        <p className="fw-bold mb-0">{booking.journeyDate || '—'}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p className="text-muted small mb-1">Departure</p>
                                                        <p className="fw-bold mb-0">{booking.departureTime || '—'}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p className="text-muted small mb-1">Service No</p>
                                                        <p className="fw-bold mb-0">{booking.serviceNo || 'FX-101'}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p className="text-muted small mb-1">Seats</p>
                                                        <p className="fw-bold mb-0">{booking.seatNumbers || '—'}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p className="text-muted small mb-1">Total Amount</p>
                                                        <p className="fw-bold mb-0 text-primary fs-5">₹{booking.totalAmount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer bg-light border-0 py-3 px-4 text-center">
                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2 fw-bold"
                                                    onClick={() => navigate('/trips')}
                                                >
                                                    My Trips
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm fw-bold"
                                                    onClick={() => navigate('/cancel-ticket')}
                                                >
                                                    Cancel Ticket
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'transaction' && (
                            <div className="px-3 text-center py-5">
                                <span className="display-4">💳</span>
                                <h5 className="fw-bold mt-3">Transaction History</h5>
                                <p className="text-muted">Login to view your payment transaction history.</p>
                                <button className="btn btn-primary px-4 fw-bold" onClick={() => navigate('/auth')}>Login</button>
                            </div>
                        )}

                        {activeTab === 'service' && (
                            <div className="px-3 text-center py-5">
                                <span className="display-4">🛎️</span>
                                <h5 className="fw-bold mt-3">Service Status</h5>
                                <p className="text-muted">All FastX services are currently operational.</p>
                                <div className="list-group shadow-sm">
                                    {['Booking Engine', 'Payment Gateway', 'Seat Reservation', 'SMS Alerts'].map(s => (
                                        <div key={s} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                            <span className="fw-medium">{s}</span>
                                            <span className="badge bg-success rounded-pill">Operational</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketStatus;
