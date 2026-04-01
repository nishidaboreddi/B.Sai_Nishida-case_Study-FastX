import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { busService, routeService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OperatorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('buses');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // States for data
    const [myBuses, setMyBuses] = useState([]);
    const [myRoutes, setMyRoutes] = useState([]);
    const [myBookings, setMyBookings] = useState([]);

    // Forms
    const [busData, setBusData] = useState({
        busName: '', busNumber: '', busType: 'AC Sleeper', totalSeats: 36, serviceNumber: '',
        amenities: { waterBottle: false, chargingPoint: false, tv: false, blanket: false }
    });

    const [routeData, setRouteData] = useState({
        busId: '', origin: '', destination: '', departureTime: '', arrivalTime: '', departureDate: '', endDate: '', scheduleType: 'Single Day', fare: ''
    });

    const fetchDashboardData = async () => {
        try {
            // In a real scenario, the backend would filter by operator ID. 
            // We use standard GET all endpoints and filter frontend for demonstration if needed, 
            // or assume backend handles it.
            const [busesRes, routesRes, bookingsRes] = await Promise.all([
                busService.getAllBuses(),
                routeService.getAllRoutes(),
                bookingService.getBookingStats()
            ]);
            
            // Filter buses for this operator
            // Filter buses for this operator: backend returns operatorId in the DTO
            const filteredBuses = (busesRes.data || []).filter(b => b.operatorId === user?.id); 
            setMyBuses(filteredBuses);
            
            // For routes table, we need a lookup for bus details
            const busLookup = {};
            (busesRes.data || []).forEach(b => { busLookup[b.busId] = b; });
            
            const routesWithBusInfo = (routesRes.data || []).filter(r => {
                const bus = busLookup[r.busId];
                return bus && bus.operatorId === user?.id; // Show only routes for this operator's buses
            }).map(r => {
                const bus = busLookup[r.busId];
                return {
                    ...r,
                    serviceNumber: r.serviceNo || bus?.serviceNumber || bus?.serviceNo || `SR-${r.routeId + 1000}`,
                    busName: bus?.busName || 'Unknown Bus',
                    busNumber: bus?.busNumber || 'N/A',
                    busType: bus?.busType || 'N/A',
                    operatorName: bus?.operator?.companyName || user?.firstName || 'My Service' // Operator context
                };
            });

            setMyRoutes(routesWithBusInfo);

            // Filter bookings: 
            // 1. Must belong to this operator's buses
            // 2. Trip must NOT have started yet (Departure time hasn't passed)
            const now = new Date();
            const operatorBusIds = filteredBuses.map(b => b.busId);
            // Filter bookings for this operator
            // 1. Get all route IDs belonging to this operator's buses
            const operatorRouteIds = routesWithBusInfo.map(r => r.routeId);
            
            const operatorBookings = (bookingsRes.data || []).filter(bk => {
                // Primary Filter: By exact Route ID linkage (new bookings)
                if (operatorRouteIds.includes(bk.routeId)) return true;
                
                // Fallback Filter: By matching Service Number (historical bookings)
                // This handles cases where old database entries have NULL/0 route IDs
                const operatorServiceNumbers = routesWithBusInfo.map(r => r.serviceNumber).filter(s => s);
                return operatorServiceNumbers.includes(bk.serviceNo);
            }).map(bk => {
                // Enrich with route/bus details for UI consumption
                const routeInfo = routesWithBusInfo.find(r => r.routeId === bk.routeId || r.serviceNumber === bk.serviceNo);
                return { ...bk, route: routeInfo };
            });

            setMyBookings(operatorBookings);

        } catch (error) {
            console.error("Failed to fetch operator data", error);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'ROLE_OPERATOR') {
            navigate('/auth');
        } else {
            fetchDashboardData();
        }
    }, [user, navigate]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleBusSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Append operator ID from context
            const payload = { ...busData, operatorId: user.id };
            await busService.addBus(payload);
            showMessage('success', 'Bus added successfully!');
            setBusData({ busName: '', busNumber: '', busType: 'AC Sleeper', totalSeats: 36, serviceNumber: '', amenities: { waterBottle: false, chargingPoint: false, tv: false, blanket: false } });
            fetchDashboardData();
        } catch (error) {
            showMessage('danger', 'Failed to add bus.');
        } finally { setLoading(false); }
    };

    const handleRouteSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { scheduleType, endDate, ...baseRouteData } = routeData;

            if (!routeData.busId || routeData.busId === '0') {
                showMessage('danger', 'Please select a bus before scheduling a route.');
                setLoading(false);
                return;
            }

            if (scheduleType === 'Single Day') {
                await routeService.addRoute(baseRouteData);
                showMessage('success', 'Route scheduled successfully!');
            } else {
                let step = 1;
                if (scheduleType === 'Alternate Days') step = 2;
                else if (scheduleType === 'Every 3 Days') step = 3;
                else if (scheduleType === 'Every 4 Days') step = 4;
                else if (scheduleType === 'Every 5 Days') step = 5;
                else if (scheduleType === 'Every 6 Days') step = 6;

                const start = new Date(baseRouteData.departureDate);
                const end = new Date(endDate);
                
                if (end < start) {
                    showMessage('danger', 'End date cannot be before start date.');
                    setLoading(false);
                    return;
                }

                const requests = [];
                let current = new Date(start);
                
                while (current <= end) {
                    const formattedDate = current.toISOString().split('T')[0];
                    requests.push(routeService.addRoute({ ...baseRouteData, departureDate: formattedDate }));
                    current.setDate(current.getDate() + step);
                }

                await Promise.all(requests);
                showMessage('success', `Successfully generated ${requests.length} routes!`);
            }
            
            fetchDashboardData();
            setRouteData({ busId: '', origin: '', destination: '', departureTime: '', arrivalTime: '', departureDate: '', endDate: '', scheduleType: 'Single Day', fare: '' });
        } catch (error) {
            showMessage('danger', 'Failed to schedule route(s).');
        } finally { setLoading(false); }
    };

    const handleRefund = async (bookingId) => {
        if(window.confirm('Are you sure you want to process a refund for this ticket?')) {
            try {
                await bookingService.refundBooking(bookingId);
                showMessage('success', 'Refunded successfully.');
                fetchDashboardData();
            } catch (error) {
                showMessage('danger', 'Refund processing failed or endpoint not implemented.');
            }
        }
    };

    const handleDeleteBus = async (busId) => {
         if(window.confirm('Are you sure you want to delete this bus?')) {
            try {
                await busService.deleteBus(busId);
                showMessage('success', 'Bus deleted successfully.');
                fetchDashboardData();
            } catch (error) {
                showMessage('danger', 'Deletion failed.');
            }
        }
    };

    const handleAmenityChange = (e) => {
        setBusData({
            ...busData,
            amenities: { ...busData.amenities, [e.target.name]: e.target.checked }
        });
    };

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-3">
                <div className="container">
                    <span className="navbar-brand fw-bold">FastX <span className="text-white-50">Operator Portal</span></span>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white small fw-bold">Welcome, {user?.firstName}</span>
                        <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={() => { logout(); navigate('/auth'); }}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <header className="bg-primary text-white py-5 shadow-sm" style={{ background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end">
                        <div className="py-2">
                            <h1 className="display-5 fw-bold mb-1">Operator Dashboard</h1>
                            <p className="lead opacity-75 mb-0 font-monospace">Manage your fleet, schedules, and passenger bookings.</p>
                        </div>
                        <div className="text-end d-none d-md-block">
                            <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold shadow-sm">
                                <i className="bi bi-shield-check me-1"></i> Verified Operator
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container py-4 pb-5" style={{ position: 'relative', zIndex: 2, marginTop: '-20px' }}>
                <div className="row g-4">
                    {/* Sidebar Stats */}
                    <div className="col-lg-3">
                        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4" style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: 'white' }}>
                            <h6 className="opacity-75 mb-1">My Fleet</h6>
                            <h2 className="fw-bold mb-0">{myBuses.length}</h2>
                        </div>
                        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4" style={{ background: 'linear-gradient(135deg, #047857, #10b981)', color: 'white' }}>
                            <h6 className="opacity-75 mb-1">Active Routes</h6>
                            <h2 className="fw-bold mb-0">{myRoutes.length}</h2>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <div className="card-header bg-white border-bottom py-3 px-4">
                                <ul className="nav nav-pills nav-fill gap-2 p-1 bg-light rounded-pill border">
                                    <li className="nav-item">
                                        <button className={`nav-link rounded-pill fw-bold ${activeTab === 'buses' ? 'active bg-primary' : 'text-dark'}`} onClick={() => setActiveTab('buses')}>
                                            Manage Buses
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link rounded-pill fw-bold ${activeTab === 'routes' ? 'active bg-primary' : 'text-dark'}`} onClick={() => setActiveTab('routes')}>
                                            Schedule Routes
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link rounded-pill fw-bold ${activeTab === 'bookings' ? 'active bg-primary' : 'text-dark'}`} onClick={() => setActiveTab('bookings')}>
                                            Bookings & Refunds
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="card-body p-4">
                                {message.text && (
                                    <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                                        {message.text}
                                        <button type="button" className="btn-close" onClick={() => setMessage({type:'', text:''})}></button>
                                    </div>
                                )}

                                {activeTab === 'buses' && (
                                    <>
                                        <form onSubmit={handleBusSubmit} className="mb-5 p-4 bg-light rounded-4 border">
                                            <h5 className="fw-bold mb-3 text-primary">Add New Bus</h5>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-secondary">Bus Name</label>
                                                    <input type="text" className="form-control form-control-lg bg-white border-0" required value={busData.busName} onChange={(e) => setBusData({...busData, busName: e.target.value})} />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-secondary">Vehicle Number</label>
                                                    <input type="text" className="form-control form-control-lg bg-white border-0" required value={busData.busNumber} onChange={(e) => setBusData({...busData, busNumber: e.target.value})} />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-secondary">Service Number</label>
                                                    <input type="text" className="form-control form-control-lg bg-white border-0" placeholder="e.g. SR-101" required value={busData.serviceNumber} onChange={(e) => setBusData({...busData, serviceNumber: e.target.value})} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-bold text-secondary">Bus Type</label>
                                                    <select className="form-select form-select-lg bg-white border-0" value={busData.busType} onChange={(e) => setBusData({...busData, busType: e.target.value})}>
                                                        <option>AC Sleeper</option>
                                                        <option>Non-AC Sleeper</option>
                                                        <option>AC Seater</option>
                                                        <option>Non-AC Seater</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-bold text-secondary">Total Seats</label>
                                                    <input type="number" className="form-control form-control-lg bg-white border-0" required value={busData.totalSeats} onChange={(e) => setBusData({...busData, totalSeats: e.target.value})} />
                                                </div>
                                                
                                                <div className="col-12 mt-3">
                                                    <label className="form-label small fw-bold text-secondary mb-2">Bus Amenities</label>
                                                    <div className="d-flex gap-4 flex-wrap">
                                                        <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
                                                            <input className="form-check-input m-0" type="checkbox" name="waterBottle" checked={busData.amenities.waterBottle} onChange={handleAmenityChange} />
                                                            <label className="form-check-label small">Water Bottle</label>
                                                        </div>
                                                        <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
                                                            <input className="form-check-input m-0" type="checkbox" name="chargingPoint" checked={busData.amenities.chargingPoint} onChange={handleAmenityChange} />
                                                            <label className="form-check-label small">Charging Point</label>
                                                        </div>
                                                        <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
                                                            <input className="form-check-input m-0" type="checkbox" name="tv" checked={busData.amenities.tv} onChange={handleAmenityChange} />
                                                            <label className="form-check-label small">TV/Entertainment</label>
                                                        </div>
                                                        <div className="form-check form-switch p-0 d-flex align-items-center gap-2">
                                                            <input className="form-check-input m-0" type="checkbox" name="blanket" checked={busData.amenities.blanket} onChange={handleAmenityChange} />
                                                            <label className="form-check-label small">Blanket</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="col-12 mt-4">
                                                    <button type="submit" className="btn btn-primary px-4 py-2 fw-bold shadow-sm" disabled={loading}>
                                                        Add Bus to Fleet
                                                    </button>
                                                </div>
                                            </div>
                                        </form>

                                        <h5 className="fw-bold mb-3">My Fleet</h5>
                                        <div className="table-responsive">
                                            <table className="table table-hover border align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Bus</th>
                                                        <th>Type</th>
                                                        <th>Seats</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myBuses.map(bus => (
                                                        <tr key={bus.busId}>
                                                            <td className="fw-bold">
                                                                {bus.busName} 
                                                                <div className="text-primary x-small fw-bold">{bus.serviceNumber}</div>
                                                                <div className="text-muted small fw-normal">{bus.busNumber}</div>
                                                            </td>
                                                            <td>{bus.busType}</td>
                                                            <td>{bus.totalSeats}</td>
                                                            <td>
                                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBus(bus.busId)}>Remove</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {myBuses.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No buses registered.</td></tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'routes' && (
                                     <>
                                        <form onSubmit={handleRouteSubmit} className="mb-5 p-4 bg-light rounded-4 border">
                                            <h5 className="fw-bold mb-3 text-primary">Schedule New Route</h5>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-secondary">Select Bus</label>
                                                    <select className="form-select form-select-lg bg-white border-0" required value={routeData.busId} onChange={(e) => setRouteData({...routeData, busId: e.target.value})}>
                                                        <option value="">-- Choose Bus --</option>
                                                        {myBuses.map(b => <option key={b.busId} value={b.busId}>{b.busName} ({b.busNumber})</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-secondary">Origin</label>
                                                    <input type="text" className="form-control form-control-lg bg-white border-0" placeholder="e.g. Hyderabad" required value={routeData.origin} onChange={(e) => setRouteData({...routeData, origin: e.target.value})} />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-secondary">Destination</label>
                                                    <input type="text" className="form-control form-control-lg bg-white border-0" placeholder="e.g. Vijayawada" required value={routeData.destination} onChange={(e) => setRouteData({...routeData, destination: e.target.value})} />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label small fw-bold text-secondary">Start Date</label>
                                                    <input type="date" className="form-control form-control-lg bg-white border-0" required value={routeData.departureDate} onChange={(e) => setRouteData({...routeData, departureDate: e.target.value})} />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label small fw-bold text-secondary">Schedule Mode</label>
                                                    <select className="form-select form-select-lg bg-white border-0" value={routeData.scheduleType} onChange={(e) => setRouteData({...routeData, scheduleType: e.target.value})}>
                                                        <option>Single Day</option>
                                                        <option>Daily</option>
                                                        <option>Alternate Days</option>
                                                        <option>Every 3 Days</option>
                                                        <option>Every 4 Days</option>
                                                        <option>Every 5 Days</option>
                                                        <option>Every 6 Days</option>
                                                    </select>
                                                </div>
                                                {routeData.scheduleType !== 'Single Day' && (
                                                    <div className="col-md-3">
                                                        <label className="form-label small fw-bold text-secondary">End Date</label>
                                                        <input type="date" className="form-control form-control-lg bg-white border-0" required value={routeData.endDate} onChange={(e) => setRouteData({...routeData, endDate: e.target.value})} />
                                                    </div>
                                                )}
                                                <div className="col-md-3">
                                                    <label className="form-label small fw-bold text-secondary">Departure</label>
                                                    <input type="time" className="form-control form-control-lg bg-white border-0" required value={routeData.departureTime} onChange={(e) => setRouteData({...routeData, departureTime: e.target.value})} />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label small fw-bold text-secondary">Arrival</label>
                                                    <input type="time" className="form-control form-control-lg bg-white border-0" required value={routeData.arrivalTime} onChange={(e) => setRouteData({...routeData, arrivalTime: e.target.value})} />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label small fw-bold text-secondary">Fare (INR)</label>
                                                    <input type="number" className="form-control form-control-lg bg-white border-0" required value={routeData.fare} onChange={(e) => setRouteData({...routeData, fare: e.target.value})} />
                                                </div>
                                                <div className="col-12 mt-4">
                                                    <button type="submit" className="btn btn-primary px-4 py-2 fw-bold shadow-sm" disabled={loading}>Schedule Route</button>
                                                </div>
                                            </div>
                                        </form>

                                        <h5 className="fw-bold mb-3">Scheduled Routes</h5>
                                        <div className="table-responsive">
                                            <table className="table table-hover border align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Date / Timings</th>
                                                        <th>Route</th>
                                                        <th>Bus Name</th>
                                                        <th>Operator</th>
                                                        <th>Vehicle No</th>
                                                        <th>Bus Type</th>
                                                        <th>Service Number</th>
                                                        <th>Fare</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myRoutes.map(route => (
                                                        <tr key={route.routeId}>
                                                            <td>
                                                                <div className="fw-bold">{route.departureDate}</div>
                                                                <div className="small text-muted">{route.departureTime} - {route.arrivalTime}</div>
                                                            </td>
                                                            <td>
                                                                <div className="small fw-bold">{route.origin}</div>
                                                                <i className="bi bi-arrow-down small text-muted d-block my-1" style={{marginLeft:'5px'}}></i>
                                                                <div className="small fw-bold">{route.destination}</div>
                                                            </td>
                                                            <td className="fw-bold text-primary">{route.busName}</td>
                                                            <td className="text-muted small">{route.operatorName}</td>
                                                            <td className="text-muted">{route.busNumber}</td>
                                                            <td>
                                                                <span className={`badge ${route.busType.toLowerCase().includes('ac') ? 'bg-primary' : 'bg-secondary'} x-small`}>
                                                                    {route.busType}
                                                                </span>
                                                            </td>
                                                            <td className="fw-bold">{route.serviceNumber || 'N/A'}</td>
                                                            <td>₹{route.fare}</td>
                                                        </tr>
                                                    ))}
                                                    {myRoutes.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No routes scheduled.</td></tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                     </>
                                )}

                                {activeTab === 'bookings' && (
                                     <div>
                                        <h5 className="fw-bold mb-3">Passenger Bookings</h5>
                                        <div className="table-responsive">
                                            <table className="table table-hover border align-middle bg-white">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Booking ID</th>
                                                        <th>User</th>
                                                        <th>Status</th>
                                                        <th>Amount</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myBookings.map(bk => (
                                                        <tr key={bk.bookingId}>
                                                            <td>#{bk.bookingId}<br/><span className="small text-muted">{bk.ticketNo}</span></td>
                                                            <td>User #{bk.userId}</td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    bk.bookingStatus === 'CANCELLED' ? 'bg-danger' : 
                                                                    bk.bookingStatus === 'REFUNDED' ? 'bg-info' : 
                                                                    'bg-success'
                                                                }`}>
                                                                    {bk.bookingStatus || 'CONFIRMED'}
                                                                </span>
                                                            </td>
                                                            <td>₹{bk.totalAmount}</td>
                                                            <td>
                                                                {bk.bookingStatus === 'CANCELLED' ? (
                                                                    <button 
                                                                        className="btn btn-sm btn-outline-warning fw-bold" 
                                                                        onClick={() => handleRefund(bk.bookingId)}
                                                                    >
                                                                        Process Refund
                                                                    </button>
                                                                ) : bk.bookingStatus === 'REFUNDED' ? (
                                                                    <span className="text-success small fw-bold">
                                                                        <i className="bi bi-check-circle-fill me-1"></i> Refund Completed
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-secondary small fw-bold">NA</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {myBookings.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No passenger bookings found.</td></tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                     </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorDashboard;
