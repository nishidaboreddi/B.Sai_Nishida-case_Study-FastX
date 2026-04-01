import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';

const CancelTicket = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState('list'); // 'list' | 'confirm' | 'done'
    const [trips, setTrips] = useState([]);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        const fetchTripsForCancellation = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await bookingService.getUserBookings(user.id || 1);
                const all = response.data || [];

                const today = new Date().toISOString().split('T')[0];
                const upcoming = all.filter(b =>
                    b.bookingStatus === 'CONFIRMED' &&
                    b.journeyDate >= today
                );

                setTrips(upcoming.reverse());
            } catch (err) {
                console.error("Error fetching trips:", err);
                setError("Failed to load your trips. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTripsForCancellation();
    }, [user]);

    const handleCancelClick = (trip) => {
        setBooking(trip);
        setStep('confirm');
    };

    const handleConfirmCancel = async () => {
        if (!booking) return;
        setCancelLoading(true);
        setError('');
        try {
            await bookingService.refundBooking(booking.bookingId);
            setStep('done');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to cancel ticket. Please try again.');
        } finally {
            setCancelLoading(false);
        }
    };

    const TripCard = ({ trip }) => (
        <div className="card shadow-sm mb-3 border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-white py-2 d-flex justify-content-between align-items-center border-bottom-0 pt-3 px-4">
                <span className="small text-muted fw-bold">Ticket Number : {trip.ticketNo}</span>
                <span className="fw-bold text-primary">₹{trip.totalAmount}</span>
            </div>
            <div className="card-body py-3 px-4">
                <h5 className="fw-bold mb-2">{trip.routeName}</h5>
                <div className="small text-muted mb-1">
                    <span className="fw-bold">Journey Date : </span> {trip.journeyDate} | {trip.departureTime}
                </div>
                <div className="small text-muted mb-1">
                    <span className="fw-bold">Service No : </span> {trip.serviceNo || 'FX-101'}
                </div>
                <div className="small text-muted mb-3">
                    <span className="fw-bold">Seat No : </span> {trip.seatNumbers}
                </div>
                <button
                    className="btn btn-outline-danger btn-sm w-100 fw-bold py-2 rounded-3"
                    onClick={() => handleCancelClick(trip)}
                >
                    Cancel Ticket
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-light min-vh-100 pb-5">
            {/* Header */}
            <div className="bg-primary text-white py-3 shadow-sm mb-4 sticky-top">
                <div className="container d-flex align-items-center">
                    <button
                        className="btn btn-primary border-0 p-0 me-3"
                        onClick={() => step === 'confirm' ? setStep('list') : navigate(-1)}
                    >
                        <span className="h4 mb-0">&larr;</span>
                    </button>
                    <h4 className="mb-0 fw-bold flex-grow-1 text-center pe-4">Cancel Ticket</h4>
                </div>
            </div>

            <div className="container py-2">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-10">

                        {/* Step 1 — List of Cancellable Trips */}
                        {step === 'list' && (
                            <>
                                {loading ? (
                                    <div className="text-center py-5 card shadow-sm border-0 rounded-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3 text-muted">Fetching cancellable journeys...</p>
                                    </div>
                                ) : !user ? (
                                    <div className="text-center py-5 card border-0 shadow-sm rounded-4">
                                        <h5 className="text-muted mb-3 text-center w-100">Login to view your cancellable tickets.</h5>
                                        <div className="px-5 w-100">
                                            <button className="btn btn-primary w-100 py-2 rounded-pill fw-bold" onClick={() => navigate('/auth')}>Login Now</button>
                                        </div>
                                    </div>
                                ) : trips.length > 0 ? (
                                    <>
                                        <div className="alert alert-info border-0 shadow-sm rounded-3 mb-4 small">
                                            <i className="bi bi-info-circle-fill me-2"></i>
                                            Select a ticket from your upcoming journeys to proceed with cancellation.
                                        </div>
                                        {trips.map(trip => (
                                            <TripCard key={trip.bookingId} trip={trip} />
                                        ))}
                                    </>
                                ) : (
                                    <div className="text-center py-5 card shadow-sm border-0 rounded-4">
                                        <div className="display-4 text-muted mb-3">🎫</div>
                                        <h5 className="text-muted mb-0">No active bookings found for cancellation.</h5>
                                        <button className="btn btn-link text-decoration-none mt-2 fw-bold" onClick={() => navigate('/')}>Book a New Journey</button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Step 2 — Confirm Cancellation UI */}
                        {step === 'confirm' && booking && (
                            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                                <div className="card-header bg-danger text-white py-3 px-4 border-bottom-0">
                                    <h5 className="modal-title fw-bold">Cancel Ticket Validation</h5>
                                    <p className="small mb-0 opacity-75">Review booking details before final cancellation</p>
                                </div>
                                <div className="card-body p-4 bg-light">
                                    <div className="alert alert-warning border-0 small mb-4 rounded-3 shadow-sm">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        Are you sure you want to cancel this booking? This action cannot be undone.
                                    </div>

                                    <h6 className="fw-bold mb-3 text-secondary border-bottom pb-2">Trip & Passenger Details</h6>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Route:</span>
                                        <span className="fw-bold small">{booking.routeName || 'Journey'}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Journey Date/Time:</span>
                                        <span className="fw-bold small">{booking.journeyDate} | {booking.departureTime}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Seat(s):</span>
                                        <span className="fw-bold small">{booking.seatNumbers}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Operator:</span>
                                        <span className="fw-bold small">{booking.busOperator}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Service No:</span>
                                        <span className="fw-bold small">{booking.serviceNo || 'FX-101'}</span>
                                    </div>

                                    <div className="card border-0 bg-white shadow-sm mb-4 rounded-4 mt-4 overflow-hidden">
                                        <div className="card-header bg-white border-bottom-0 pt-3 px-4">
                                            <h6 className="fw-bold mb-0 text-dark">Refund Breakdown</h6>
                                        </div>
                                        <div className="card-body px-4 pb-4">
                                            <div className="d-flex justify-content-between mb-2 small">
                                                <span className="text-muted">Total Amount Paid</span>
                                                <span className="fw-bold text-dark">₹{booking.totalAmount}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2 small text-danger">
                                                <span className="opacity-75">Amenities Fee (Deducted)</span>
                                                <span>- ₹{Math.round((booking.totalAmount - (booking.fare || (booking.totalAmount - 80))) * 0.625)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3 small text-danger">
                                                <span className="opacity-75">Reservation Fee (Deducted)</span>
                                                <span>- ₹{(booking.totalAmount - (booking.fare || (booking.totalAmount - 80))) - Math.round((booking.totalAmount - (booking.fare || (booking.totalAmount - 80))) * 0.625)}</span>
                                            </div>
                                            <hr className="my-3 opacity-10" />
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <div className="fw-bold text-dark">Total Refund Amount</div>
                                                    <div className="text-success x-small" style={{ fontSize: '0.7rem' }}>Processed to original payment method</div>
                                                </div>
                                                <div className="h4 fw-bold text-success mb-0">
                                                    ₹{booking.fare || (booking.totalAmount - 80)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {error && <div className="alert alert-danger py-2 small mb-4">{error}</div>}

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-secondary flex-grow-1 fw-medium py-3 rounded-3"
                                            onClick={() => setStep('list')}
                                            disabled={cancelLoading}
                                        >
                                            Keep Ticket
                                        </button>
                                        <button
                                            className="btn btn-danger flex-grow-1 fw-bold py-3 shadow-sm rounded-3"
                                            onClick={handleConfirmCancel}
                                            disabled={cancelLoading}
                                        >
                                            {cancelLoading
                                                ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                                                : 'Confirm Cancellation'
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3 — Success UI */}
                        {step === 'done' && (
                            <div className="card border-0 shadow-lg text-center p-5 rounded-4 overflow-hidden">
                                <div className="display-1 mb-3 animate__animated animate__bounceIn">✅</div>
                                <h3 className="fw-bold text-success">Ticket Cancelled</h3>
                                <div className="p-3 bg-light rounded-3 mb-4 mt-3">
                                    <p className="text-muted mb-1 small">Ticket Reference:</p>
                                    <h6 className="fw-bold text-dark">{booking?.ticketNo}</h6>
                                </div>
                                <p className="text-muted small">A refund of ₹{booking?.fare || (booking?.totalAmount - 80)} has been initiated.</p>
                                <div className="d-flex gap-2 justify-content-center mt-4 pt-2">
                                    <button className="btn btn-primary px-4 py-2 fw-bold shadow-sm" onClick={() => navigate('/trips')}>My Trips</button>
                                    <button className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate('/')}>Home</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelTicket;
