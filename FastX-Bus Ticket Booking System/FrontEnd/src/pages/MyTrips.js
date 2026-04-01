import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';

const MyTrips = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trips, setTrips] = useState({
        upcoming: [],
        past: [],
        cancelled: []
    });
    const [refresh, setRefresh] = useState(0);
    const [cancellingTrip, setCancellingTrip] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        const fetchTrips = async () => {
            if (!user || user.role !== 'ROLE_USER') {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await bookingService.getUserBookings(user.id || 1);
                const bookings = response.data || [];
                
                const today = new Date().toISOString().split('T')[0];
                
                const upcoming = [];
                const past = [];
                const cancelled = [];

                bookings.forEach(booking => {
                    const mappedTrip = {
                        id: booking.bookingId,
                        ticketNo: booking.ticketNo || ('FX-' + booking.bookingId),
                        fare: booking.fare || (booking.totalAmount - 80),
                        totalPaid: booking.totalAmount,
                        route: booking.routeName || 'Journey',
                        departureTime: booking.departureTime || '10:00 AM',
                        serviceNo: booking.serviceNo || 'FX-1092',
                        serviceCode: booking.busOperator || 'FastX Partner',
                        seats: booking.seatNumbers || 'Not Assigned',
                        journeyDate: booking.journeyDate,
                        status: booking.bookingStatus
                    };

                    if (mappedTrip.status === 'CANCELLED' || mappedTrip.status === 'REFUNDED') {
                        cancelled.push(mappedTrip);
                    } else if (mappedTrip.journeyDate >= today) {
                        upcoming.push(mappedTrip);
                    } else {
                        past.push(mappedTrip);
                    }
                });

                setTrips({
                    upcoming: upcoming.reverse(),
                    past: past.reverse(),
                    cancelled: cancelled.reverse()
                });
            } catch (err) {
                console.error("Error fetching trips:", err);
                setError(err.response?.data?.message || "Failed to load your trips. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [user, refresh]);

    const handleCancelClick = (trip) => {
        setCancellingTrip(trip);
        // Show Bootstrap Modal
        const modal = new window.bootstrap.Modal(document.getElementById('cancelModal'));
        modal.show();
    };

    const confirmCancel = async () => {
        setCancelLoading(true);
        try {
            await bookingService.refundBooking(cancellingTrip.id);
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('cancelModal'));
            modal.hide();
            setCancellingTrip(null);
            setRefresh(prev => prev + 1); // Refresh trips
        } catch (err) {
            console.error(err);
            alert("Failed to cancel ticket. Please try again.");
        } finally {
            setCancelLoading(false);
        }
    };

    const TripCard = ({ trip, status }) => (
        <div className="card shadow-sm mb-3 border-0">
            <div className={`card-header bg-white py-2 d-flex justify-content-between align-items-center border-bottom-0`}>
                <span className="small text-muted fw-bold">Ticket Number : {trip.ticketNo}</span>
                <span className="fw-bold text-primary">₹{trip.totalPaid}</span>
            </div>
            <div className="card-body py-3 border-top">
                <h5 className="fw-bold mb-3">{trip.route}</h5>
                <div className="small text-muted mb-1">
                    <span className="fw-bold">Journey Date : </span> {trip.journeyDate} | {trip.departureTime}
                </div>
                <div className="small text-muted mb-1">
                    <span className="fw-bold">Service No : </span> {trip.serviceNo}
                </div>
                <div className="small text-muted mb-2">
                    <span className="fw-bold">Seat No(s) : </span> {trip.seats}
                </div>
                <div className="d-flex justify-content-between pt-2 border-top">
                    <div className="small text-muted">
                        <span className="fw-bold">Base Fare : </span> ₹{trip.fare}
                    </div>
                </div>
            </div>
            {/* Cancellation option removed in favor of dedicated Cancel Ticket page */}
        </div>
    );

    return (
        <div className="bg-light min-vh-100">
            {/* Header Area */}
            <div className="bg-primary text-white py-3 shadow-sm mb-4">
                <div className="container">
                    <h4 className="mb-0 fw-bold text-center">My Trips</h4>
                </div>
            </div>

            <div className="container pb-5">
                {/* Custom Tabs */}
                <div className="card shadow-sm border-0 mb-4 bg-white sticky-top" style={{top: '70px', zIndex: 100}}>
                    <div className="d-flex justify-content-around text-center py-2 px-1">
                        {['upcoming', 'past', 'cancelled'].map((tab) => (
                            <div 
                                key={tab}
                                className={`flex-grow-1 py-2 cursor-pointer small fw-bold text-uppercase ${activeTab === tab ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                                style={{cursor: 'pointer'}}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trip List */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        {(!user || user.role !== 'ROLE_USER') ? (
                            <div className="text-center py-5 card border-0 shadow-sm">
                                <h5 className="text-muted">Please login as a user to view your trips.</h5>
                            </div>
                        ) : loading ? (
                            <div className="text-center py-5 card shadow-sm border-0">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3 text-muted">Fetching your trips...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-5 card shadow-sm border-0">
                                <h5 className="text-danger">{error}</h5>
                            </div>
                        ) : trips[activeTab].length > 0 ? (
                            trips[activeTab].map(trip => (
                                <TripCard key={trip.id} trip={trip} status={activeTab} />
                            ))
                        ) : (
                            <div className="text-center py-5 card shadow-sm border-0">
                                <p className="text-muted mb-0 text-capitalize">No {activeTab} trips found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <div className="modal fade" id="cancelModal" tabIndex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header bg-danger text-white border-bottom-0 rounded-top-4">
                            <h5 className="modal-title fw-bold" id="cancelModalLabel">Cancel Ticket Validation</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setCancellingTrip(null)}></button>
                        </div>
                        <div className="modal-body p-4 bg-light">
                            {cancellingTrip && (
                                <>
                                    <div className="alert alert-warning border-0 small mb-4">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        Are you sure you want to cancel this booking? This action cannot be undone.
                                    </div>
                                    <h6 className="fw-bold mb-3 text-secondary border-bottom pb-2">Trip & Passenger Details</h6>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <span className="text-muted small">Route:</span>
                                        <span className="fw-bold small">{cancellingTrip.route}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <span className="text-muted small">Journey Date/Time:</span>
                                        <span className="fw-bold small">{cancellingTrip.journeyDate} | {cancellingTrip.time}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <span className="text-muted small">Seat(s):</span>
                                        <span className="fw-bold small">{cancellingTrip.seats}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between">
                                        <span className="text-muted small">Operator:</span>
                                        <span className="fw-bold small">{cancellingTrip.serviceCode}</span>
                                    </div>
                                    <div className="mb-4 d-flex justify-content-between">
                                        <span className="text-muted small">Customer Name:</span>
                                        <span className="fw-bold small">{user?.firstName}</span>
                                    </div>

                                    <div className="card border-0 bg-white shadow-sm">
                                        <div className="card-body p-3 d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="small text-muted fw-bold">Total Refund Amount</div>
                                                <div className="text-success small">Processed to original payment method</div>
                                            </div>
                                            <div className="h4 fw-bold text-success mb-0 flex-shrink-0">
                                                ₹{cancellingTrip.fare}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer border-top-0 bg-light rounded-bottom-4 pb-4 px-4">
                            <button type="button" className="btn btn-secondary px-4 fw-medium flex-grow-1" data-bs-dismiss="modal" onClick={() => setCancellingTrip(null)}>Keep Ticket</button>
                            <button type="button" className="btn btn-danger px-4 fw-bold flex-grow-1 shadow-sm" onClick={confirmCancel} disabled={cancelLoading}>
                                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTrips;
