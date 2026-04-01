import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SeatSelection from '../components/bus/SeatSelection';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const bus = location.state?.bus || { 
        operatorName: 'FastX Premium', 
        busType: 'A/C Sleeper', 
        fare: 1200,
        isSleeper: true 
    };

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [passengerDetails, setPassengerDetails] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const AMENITIES_FEE = 50;
    const RESERVATION_FEE = 30;
    
    const [bookedSeats, setBookedSeats] = useState({});
    
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await bookingService.getBookingStats();
                const allBookings = res.data || [];
                
                const travelDate = new Date();
                travelDate.setDate(travelDate.getDate() + 1);
                const journeyStr = travelDate.toISOString().split('T')[0];

                const thisRun = allBookings.filter(b => 
                    (b.serviceNo === bus.serviceNumber || b.serviceNo === bus.serviceNo) &&
                    b.journeyDate === journeyStr &&
                    b.bookingStatus === 'CONFIRMED'
                );

                const seatsObj = {};
                thisRun.forEach(b => {
                    const seats = b.seatNumbers ? b.seatNumbers.split(',').map(s => s.trim()) : [];
                    seats.forEach(s => { seatsObj[s] = 'occupied'; });
                });
                setBookedSeats(seatsObj);
            } catch (err) {
                console.error("Could not load booked seats:", err);
            }
        };
        fetchBookings();
    }, [bus]);
    
    const isSleeper = bus.isSleeper || bus.busType?.toLowerCase().includes('sleeper');
    const isLuxury = bus.busType?.toLowerCase().includes('luxury') && !isSleeper;
    const layoutType = isSleeper ? 'sleeper' : (isLuxury ? 'luxury-seater' : 'seater');

    const getAdjacentSeat = (seatId) => {
        if (layoutType === 'seater') {
            const row = seatId.slice(0, -1);
            const col = seatId.slice(-1);
            if (col === 'A') return row + 'B';
            if (col === 'B') return row + 'A';
            if (col === 'C') return row + 'D';
            if (col === 'D') return row + 'C';
        } else if (layoutType === 'luxury-seater') {
            const id = parseInt(seatId);
            const pairs = [
                [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13, 14], [15, 16],
                [17, 18], [19, 20], [21, 22], [23, 24], [25, 26], [27, 28], [29, 30],
                [31, 32], [33, 34], [35, 36], [38, 39]
            ];
            for (const pair of pairs) {
                if (pair.includes(id)) return pair.find(s => s !== id).toString();
            }
        } else {
            // Sleeper logic: 1L is solo, MR and R are pair
            if (seatId.endsWith('MR')) return seatId.replace('MR', 'R');
            if (seatId.endsWith('R') && !seatId.endsWith('MR')) return seatId.replace('R', 'MR');
        }
        return null;
    };

    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
            const newDetails = { ...passengerDetails };
            delete newDetails[seatId];
            setPassengerDetails(newDetails);
        } else {
            setSelectedSeats(prev => [...prev, seatId]);
            setPassengerDetails(prev => ({
                ...prev,
                [seatId]: { name: '', email: '', phone: '', gender: 'Female' }
            }));
        }
    };

    const handleDetailChange = (seatId, field, value) => {
        if (field === 'gender' && value === 'Male') {
            const adjacent = getAdjacentSeat(seatId);
            if (adjacent && bookedSeats[adjacent] === 'female') {
                alert(`Selection Error: Male passenger cannot sit next to a seat already booked by a female (${adjacent}).`);
                return;
            }
        }

        setPassengerDetails(prev => ({
            ...prev,
            [seatId]: { ...prev[seatId], [field]: value }
        }));
    };

    const validateBooking = () => {
        // Form validations
        for (const [seatId, details] of Object.entries(passengerDetails)) {
            if (!details.name || !details.email || !details.phone) {
                alert(`Please fill all details for passenger in seat ${seatId}`);
                return false;
            }
            if (details.name.trim().length < 2) {
                alert(`Please enter a valid name (min 2 characters) for passenger in seat ${seatId}`);
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
                alert(`Please enter a valid email address for passenger in seat ${seatId}`);
                return false;
            }
            if (!/^\d{10}$/.test(details.phone)) {
                alert(`Please enter a valid 10-digit mobile number for passenger in seat ${seatId}`);
                return false;
            }
        }
        
        const maleSeats = Object.entries(passengerDetails).filter(([_, details]) => details.gender === 'Male');
        for (const [seatId, _] of maleSeats) {
            const adjacent = getAdjacentSeat(seatId);
            if (adjacent && bookedSeats[adjacent] === 'female') {
                alert(`Validation failed: Passenger in seat ${seatId} (Male) cannot sit next to a female-booked seat (${adjacent}).`);
                return false;
            }
        }
        
        if (!user || user.role !== 'ROLE_USER') {
            alert('Please login as a User to book tickets.');
            navigate('/auth');
            return false;
        }
        
        return true;
    };

    const handleProceedToPayment = () => {
        if (!validateBooking()) return;
        
        // Show Bootstrap Modal
        const modal = new window.bootstrap.Modal(document.getElementById('paymentModal'));
        modal.show();
    };

    const confirmAndPay = async () => {
        try {
            setIsSubmitting(true);
            
            const today = new Date().toISOString().split('T')[0];
            // Use selected bus departure date or fallback
            let journeyStr = bus.departureDate;
            if (!journeyStr) {
                const travelDate = new Date();
                travelDate.setDate(travelDate.getDate() + 1);
                journeyStr = travelDate.toISOString().split('T')[0];
            }

            // Distribute fees across all seats
            const feePerSeat = (AMENITIES_FEE + RESERVATION_FEE) / selectedSeats.length;
            const finalFarePerSeat = bus.fare + feePerSeat;

            // Generate a unique booking for EACH seat
            const bookingPromises = selectedSeats.map(seatId => {
                // Generate unique ticket number based on seat
                const randomId = Math.random().toString(36).substring(7).toUpperCase();
                const ticketNo = `FX-${seatId}-${randomId}`;
                
                const passenger = passengerDetails[seatId] || { name: user?.firstName || 'Guest' };

                const payload = {
                    userId: user.id || 1, 
                    routeId: bus.routeId || bus.id || 1, 
                    totalAmount: Math.round(finalFarePerSeat),
                    bookingStatus: "CONFIRMED",
                    bookingDate: today,
                    journeyDate: journeyStr,
                    ticketNo: ticketNo,
                    routeName: (bus.origin && bus.destination) ? `${bus.origin} -> ${bus.destination}` : 'Standard Route',
                    busOperator: bus.operatorName || 'FastX Partner',
                    departureTime: bus.departureTime || '10:00',
                    seatNumbers: seatId, // Only this ONE seat
                    serviceNo: bus.serviceNumber || bus.serviceNo || 'FX-101',
                    fare: bus.fare || 0
                };
                return bookingService.createBooking(payload);
            });

            await Promise.all(bookingPromises);
            
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
            if(modal) modal.hide();

            alert(`${selectedSeats.length} Ticket(s) Booked Successfully! View them in My Trips.`);
            navigate('/trips');
        } catch (error) {
            console.error("Error creating bookings:", error);
            alert("Failed to complete booking. Please try again.");
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
            if(modal) modal.hide();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 mb-4">
                        <h4 className="fw-bold mb-4">Select {bus.isSleeper ? 'Berths' : 'Seats'}</h4>
                        <SeatSelection 
                            selectedSeats={selectedSeats} 
                            onToggleSeat={toggleSeat} 
                            bookedSeats={bookedSeats}
                            layoutType={layoutType}
                        />
                    </div>

                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 overflow-hidden mb-4">
                            <div className="card-header bg-primary text-white py-3">
                                <h5 className="mb-0 fw-bold">Booking Summary</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Bus</label>
                                    <p className="fw-bold mb-0">{bus.operatorName}</p>
                                    <p className="small text-muted mb-0">Service No: {bus.serviceNumber || bus.serviceNo || 'FX-101'} | {bus.busType} | {bus.departureDate || 'Next Day Journey'}</p>
                                </div>

                                <div className="border-top border-bottom py-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Selected {bus.isSleeper ? 'Berths' : 'Seats'}:</span>
                                        <span className="fw-bold">{selectedSeats.join(', ') || 'None'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Total Fare:</span>
                                        <span className="h4 fw-bold text-primary mb-0">₹{selectedSeats.length * bus.fare}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedSeats.length > 0 ? (
                            <div className="passenger-details-area">
                                <h5 className="fw-bold mb-3">Passenger Details</h5>
                                {selectedSeats.map((seatId) => (
                                    <div key={seatId} className="card shadow-sm border-0 mb-3 border-start border-primary border-4">
                                        <div className="card-body p-3">
                                            <h6 className="fw-bold mb-3 text-primary">Passenger - {bus.isSleeper ? 'Berth' : 'Seat'} {seatId}</h6>
                                            <div className="row g-2">
                                                <div className="col-md-12 mb-2">
                                                    <input 
                                                        className="form-control form-control-sm" 
                                                        placeholder="Full Name" 
                                                        required 
                                                        value={passengerDetails[seatId]?.name || ''}
                                                        onChange={(e) => handleDetailChange(seatId, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <input 
                                                        type="email"
                                                        className="form-control form-control-sm" 
                                                        placeholder="Email" 
                                                        required 
                                                        value={passengerDetails[seatId]?.email || ''}
                                                        onChange={(e) => handleDetailChange(seatId, 'email', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <input 
                                                        className="form-control form-control-sm" 
                                                        placeholder="Phone" 
                                                        required 
                                                        value={passengerDetails[seatId]?.phone || ''}
                                                        onChange={(e) => handleDetailChange(seatId, 'phone', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <select 
                                                        className="form-select form-select-sm"
                                                        value={passengerDetails[seatId]?.gender || 'Female'}
                                                        onChange={(e) => handleDetailChange(seatId, 'gender', e.target.value)}
                                                    >
                                                        <option value="Female">Female</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    className="btn btn-primary w-100 py-3 fw-bold mt-2 shadow"
                                    disabled={isSubmitting}
                                    onClick={handleProceedToPayment}
                                >
                                    {isSubmitting ? 'Processing Payment...' : 'Proceed to Payment'}
                                </button>
                            </div>
                        ) : (
                            <div className="alert alert-info py-3 shadow-sm border-0">
                                <strong>Select a seat</strong> to continue with booking.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Confirmation Modal */}
            <div className="modal fade" id="paymentModal" tabIndex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg p-3 rounded-4">
                        <div className="modal-header border-bottom-0 pb-0">
                            <h4 className="modal-title fw-bold text-primary" id="paymentModalLabel">Confirm Your Payment</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" disabled={isSubmitting}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-4">
                                <div className="col-md-7">
                                    <h6 className="fw-bold text-secondary mb-3 border-bottom pb-2">Journey Details</h6>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Route:</span>
                                        <span className="fw-bold small text-end">{(bus.origin && bus.destination) ? `${bus.origin} -> ${bus.destination}` : 'Standard Route'}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Operator:</span>
                                        <span className="fw-bold small text-end">{bus.operatorName} | {bus.busType}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Service No:</span>
                                        <span className="fw-bold small text-end text-primary">{bus.serviceNumber || bus.serviceNo || 'FX-101'}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Journey Date/Time:</span>
                                        <span className="fw-bold small text-end">{bus.departureDate || 'Tomorrow'} | {bus.departureTime}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Seat(s):</span>
                                        <span className="fw-bold small text-end">{selectedSeats.join(', ')}</span>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Ticket ID (Preview):</span>
                                        <span className="fw-bold small text-end text-muted">FX-{selectedSeats[0]}-XXXX</span>
                                    </div>
                                    <div className="mb-1 d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">Passenger:</span>
                                        <span className="fw-bold small text-end">{passengerDetails[selectedSeats[0]]?.name || user?.firstName || 'Guest'}</span>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="card bg-light border-0 shadow-sm p-3 h-100 rounded-4">
                                        <h6 className="fw-bold text-dark mb-3">Fare Breakdown</h6>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted">Base Fare ({selectedSeats.length} seats)</span>
                                            <span className="fw-bold text-dark">₹{selectedSeats.length * bus.fare}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted">Amenities Fee</span>
                                            <span className="fw-bold text-dark">+ ₹{AMENITIES_FEE}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3 small">
                                            <span className="text-muted">Reservation Fee</span>
                                            <span className="fw-bold text-dark">+ ₹{RESERVATION_FEE}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between mt-2">
                                            <span className="fw-bold fs-5">Total Payable</span>
                                            <span className="fw-bold fs-4 text-success">
                                                ₹{(selectedSeats.length * bus.fare) + AMENITIES_FEE + RESERVATION_FEE}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top-0 pt-0 mt-3 d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-light fw-bold px-4" data-bs-dismiss="modal" disabled={isSubmitting}>Cancel</button>
                            <button 
                                type="button" 
                                className="btn btn-success fw-bold px-5 shadow-sm" 
                                onClick={confirmAndPay}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing Payment...' : 'Confirm & Pay'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
