import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { busService, operatorService, routeService, userService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('manage-users');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [stats, setStats] = useState({ totalFleet: 0, activeRoutes: 0, totalUsers: 0, totalOperators: 0, totalBookings: 0 });
    const [recentBuses, setRecentBuses] = useState([]);
    const [allBuses, setAllBuses] = useState([]);
    const [operators, setOperators] = useState([]);
    const [users, setUsers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [operatorData, setOperatorData] = useState({
        companyName: '', email: '', phone: '', password: '', contactPersonName: '', address: ''
    });

    const [routeData, setRouteData] = useState({
        busId: '', serviceNumber: '', origin: '', destination: '', departureTime: '', arrivalTime: '', departureDate: '', fare: '', endDate: '', scheduleType: 'Single Day'
    });

    const [busData, setBusData] = useState({
        busName: '', busNumber: '', busType: 'AC Sleeper', totalSeats: 36, operatorId: '', serviceNumber: ''
    });

    const fetchDashboardData = async () => {
        try {
            const [busesRes, routesRes, opsRes, usersRes, bookingsRes] = await Promise.all([
                busService.getAllBuses(),
                routeService.getAllRoutes(),
                operatorService.getAllOperators(),
                userService.getAllUsers().catch(() => ({ data: [] })),
                bookingService.getBookingStats().catch(() => ({ data: [] }))
            ]);

            const allOps = opsRes.data || [];
            const allUsers = usersRes.data || [];

            // Extract operator emails to exclude them from customer count
            const opEmails = allOps.map(op => op.email.toLowerCase());

            // Filter users to get true customers (excluding operators and system accounts)
            const customersOnly = allUsers.filter(user =>
                !opEmails.includes(user.email.toLowerCase()) &&
                !user.email.toLowerCase().includes('admin')
            );

            setStats({
                totalFleet: busesRes.data?.length || 0,
                activeRoutes: routesRes.data?.length || 0,
                totalUsers: customersOnly.length,
                totalOperators: allOps.length,
                totalBookings: (bookingsRes.data || []).filter(b => (b.bookingStatus || b.status || '').toUpperCase() === 'CONFIRMED').length || 0
            });
            setRecentBuses((busesRes.data || []).slice(-5).reverse());
            setAllBuses(busesRes.data || []);
            setOperators(allOps);
            setUsers(allUsers);
            setRoutes(routesRes.data || []);
            setBookings(bookingsRes.data || []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const validateOperatorForm = () => {
        const { companyName, contactPersonName, phone, email } = operatorData;

        const nameRegex = /^[a-zA-Z\s.-]+$/;

        if (!nameRegex.test(companyName)) {
            showMessage('danger', 'Company name should only contain alphabets, dots, or hyphens.');
            return false;
        }
        if (!nameRegex.test(contactPersonName)) {
            showMessage('danger', 'Contact person name should only contain alphabets, dots, or hyphens.');
            return false;
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            showMessage('danger', 'Phone number should be exactly 10 digits.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage('danger', 'Invalid email format.');
            return false;
        }
        return true;
    };

    const handleOperatorSubmit = async (e) => {
        e.preventDefault();

        if (!validateOperatorForm()) return;

        setLoading(true);
        try {
            await operatorService.addOperator(operatorData);
            showMessage('success', 'Operator added successfully!');
            setOperatorData({ companyName: '', email: '', phone: '', password: '', contactPersonName: '', address: '' });
            fetchDashboardData();
        } catch (error) {
            let errorMsg = 'Failed to add operator.';
            if (error.response?.status === 409) {
                errorMsg = 'An account with this email already exists.';
            } else if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') errorMsg = data;
                else if (data.message) errorMsg = data.message;
                else if (typeof data === 'object') {
                    // Extract common validation error messages if available
                    errorMsg = Object.values(data).join(', ');
                }
            }
            showMessage('danger', errorMsg || 'Problem connecting to server.');
        } finally { setLoading(false); }
    };

    const handleRouteSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { scheduleType, endDate, ...baseRouteData } = routeData;

            if (scheduleType === 'Single Day') {
                await routeService.addRoute(baseRouteData);
                showMessage('success', 'Route added successfully!');
            } else {
                let step = 1;
                if (scheduleType === 'Alternate Days') step = 2;
                else if (scheduleType === 'Every 3 Days') step = 3;
                else if (scheduleType === 'Every 4 Days') step = 4;
                else if (scheduleType === 'Every 5 Days') step = 5;
                else if (scheduleType === 'Every 6 Days') step = 6;
                else if (scheduleType === 'Weekly') step = 7;

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
            setRouteData({ busId: '', serviceNumber: '', origin: '', destination: '', departureTime: '', arrivalTime: '', departureDate: '', endDate: '', scheduleType: 'Single Day', fare: '' });
        } catch (error) {
            showMessage('danger', 'Failed to add route(s). Please try again.');
        } finally { setLoading(false); }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Delete this user account permanently?')) {
            try {
                await userService.deleteUser(userId);
                showMessage('success', 'User deleted successfully.');
                fetchDashboardData();
            } catch (e) {
                showMessage('danger', 'Failed to delete user.');
            }
        }
    };

    const handleDeleteOperator = async (operatorId) => {
        if (window.confirm('Delete this operator account permanently?')) {
            try {
                await operatorService.deleteOperator(operatorId);
                showMessage('success', 'Operator deleted successfully.');
                fetchDashboardData();
            } catch (e) {
                showMessage('danger', 'Failed to delete operator.');
            }
        }
    };

    const handleDeleteRoute = async (routeId) => {
        if (window.confirm('Delete this route?')) {
            try {
                await routeService.deleteRoute(routeId);
                showMessage('success', 'Route deleted successfully.');
                fetchDashboardData();
            } catch (e) {
                showMessage('danger', 'Failed to delete route.');
            }
        }
    };

    const handleBusSubmit = async (e) => {
        e.preventDefault();
        if (!busData.operatorId) {
            showMessage('danger', 'Please select an operator.');
            return;
        }
        setLoading(true);
        try {
            await busService.addBus({ ...busData, operatorId: parseInt(busData.operatorId) });
            showMessage('success', 'Bus registered successfully!');
            setBusData({ busName: '', busNumber: '', busType: 'AC Sleeper', totalSeats: 40, operatorId: '', serviceNumber: '' });
            fetchDashboardData();
        } catch (error) {
            let errorMsg = 'Failed to add bus.';
            if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') errorMsg = data;
                else if (data.message) errorMsg = data.message;
            }
            showMessage('danger', errorMsg);
        } finally { setLoading(false); }
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Admin Header */}
            <nav className="navbar navbar-dark bg-dark shadow-sm py-3 sticky-top">
                <div className="container d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-dark border-0 me-3 bg-transparent p-0 d-flex align-items-center justify-content-center"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#adminMenuToggle"
                            aria-expanded="false"
                            style={{ width: '30px', height: '30px' }}
                        >
                            <svg viewBox="0 0 100 80" width="24" height="24" fill="white">
                                <rect width="100" height="15" rx="8"></rect>
                                <rect y="30" width="100" height="15" rx="8"></rect>
                                <rect y="60" width="100" height="15" rx="8"></rect>
                            </svg>
                        </button>
                        <span className="navbar-brand fw-bold text-danger mb-0 h1">FastX <span className="text-white">Admin Console</span></span>
                    </div>
                    <button className="btn btn-outline-light btn-sm" onClick={() => { logout(); navigate('/login'); }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container py-4">
                {/* Collapsible Menu Header */}
                <div className="collapse mb-4 shadow-sm rounded-4 overflow-hidden" id="adminMenuToggle">
                    <div className="card border-0 rounded-0">
                        <div className="row g-0">
                            <div className="col-12">
                                <div className="list-group list-group-flush border-0">
                                    <div className="p-3 bg-light text-secondary fw-bold small text-uppercase border-bottom">Management</div>
                                    <button className={`list-group-item list-group-item-action border-0 py-3 fw-medium ${activeTab === 'manage-users' ? 'active bg-dark text-white' : ''}`} onClick={() => setActiveTab('manage-users')}>
                                        Manage Users
                                    </button>
                                    <button className={`list-group-item list-group-item-action border-0 py-3 fw-medium ${activeTab === 'manage-operators' ? 'active bg-dark text-white' : ''}`} onClick={() => setActiveTab('manage-operators')}>
                                        Manage Operators
                                    </button>
                                    <button className={`list-group-item list-group-item-action border-0 py-3 fw-medium ${activeTab === 'add-operator' ? 'active bg-dark text-white' : ''}`} onClick={() => setActiveTab('add-operator')}>
                                        ➕ Add Operator
                                    </button>
                                    <button className={`list-group-item list-group-item-action border-0 py-3 fw-medium ${activeTab === 'add-bus' ? 'active bg-dark text-white' : ''}`} onClick={() => setActiveTab('add-bus')}>
                                        🚌 Add Bus
                                    </button>
                                    <button className={`list-group-item list-group-item-action border-0 py-3 fw-medium ${activeTab === 'manage-routes' ? 'active bg-dark text-white' : ''}`} onClick={() => setActiveTab('manage-routes')}>
                                        Manage Routes
                                    </button>
                                    <button className={`list-group-item list-group-item-action border-0 py-3 fw-medium ${activeTab === 'manage-bookings' ? 'active bg-dark text-white' : ''}`} onClick={() => setActiveTab('manage-bookings')}>
                                        All Bookings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Stats Header (Replaces Sidebar Stats) */}
                    <div className="col-12">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white h-100 d-flex flex-row align-items-center justify-content-between">
                                    <div>
                                        <h6 className="opacity-75 mb-1">Total Customers</h6>
                                        <h2 className="fw-bold mb-0">{stats.totalUsers}</h2>
                                    </div>
                                    <i className="bi bi-people fs-1 opacity-50"></i>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-4 bg-info text-white h-100 d-flex flex-row align-items-center justify-content-between">
                                    <div>
                                        <h6 className="opacity-75 mb-1">Total Operators</h6>
                                        <h2 className="fw-bold mb-0">{stats.totalOperators}</h2>
                                    </div>
                                    <i className="bi bi-person-badge fs-1 opacity-50"></i>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-4 p-4 bg-success text-white h-100 d-flex flex-row align-items-center justify-content-between">
                                    <div>
                                        <h6 className="opacity-75 mb-1">Active Bookings</h6>
                                        <h2 className="fw-bold mb-0">{stats.totalBookings}</h2>
                                    </div>
                                    <i className="bi bi-ticket-detailed fs-1 opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 min-vh-100">
                            <div className="card-body p-3 p-md-5">
                                {message.text && (
                                    <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                                        {message.text}
                                        <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                                    </div>
                                )}

                                {(activeTab === 'operator' || activeTab === 'add-operator') && (
                                    <form onSubmit={handleOperatorSubmit}>
                                        <h5 className="fw-bold mb-3">Operator Details</h5>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-secondary">Company Name</label>
                                                <input type="text" name="companyName" className="form-control form-control-lg bg-light border-0" required value={operatorData.companyName} onChange={(e) => setOperatorData({ ...operatorData, companyName: e.target.value })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-secondary">Contact Person</label>
                                                <input type="text" name="contactPersonName" className="form-control form-control-lg bg-light border-0" required value={operatorData.contactPersonName} onChange={(e) => setOperatorData({ ...operatorData, contactPersonName: e.target.value })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Email</label>
                                                <input type="email" name="email" className="form-control form-control-lg bg-light border-0" required value={operatorData.email} onChange={(e) => setOperatorData({ ...operatorData, email: e.target.value })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Phone</label>
                                                <input type="text" name="phone" className="form-control form-control-lg bg-light border-0" required value={operatorData.phone} onChange={(e) => setOperatorData({ ...operatorData, phone: e.target.value })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Password</label>
                                                <input type="password" name="password" className="form-control form-control-lg bg-light border-0" required value={operatorData.password} onChange={(e) => setOperatorData({ ...operatorData, password: e.target.value })} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-bold text-secondary">Address</label>
                                                <input type="text" name="address" className="form-control form-control-lg bg-light border-0" required value={operatorData.address} onChange={(e) => setOperatorData({ ...operatorData, address: e.target.value })} />
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button type="submit" className="btn btn-danger btn-lg px-5 py-3 fw-bold shadow-sm" disabled={loading}>
                                                    {loading ? 'Processing...' : 'Complete Operator Registration'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {activeTab === 'route' && (
                                    <form onSubmit={handleRouteSubmit}>
                                        <h5 className="fw-bold mb-3">Route Details</h5>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Bus Selection</label>
                                                <select name="busId" className="form-select form-select-lg bg-light border-0" required value={routeData.busId} onChange={(e) => setRouteData({ ...routeData, busId: e.target.value })}>
                                                    <option value="">-- Select Bus --</option>
                                                    {allBuses.map(b => (
                                                        <option key={b.busId} value={b.busId}>{b.busName} ({b.busNumber})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Service Number (Route Specific)</label>
                                                <input type="text" name="serviceNumber" className="form-control form-control-lg bg-light border-0" placeholder="e.g. SRV-101" value={routeData.serviceNumber} onChange={(e) => setRouteData({ ...routeData, serviceNumber: e.target.value })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Origin</label>
                                                <input type="text" name="origin" className="form-control form-control-lg bg-light border-0" placeholder="e.g. Mumbai" required value={routeData.origin} onChange={(e) => setRouteData({ ...routeData, origin: e.target.value })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Destination</label>
                                                <input type="text" name="destination" className="form-control form-control-lg bg-light border-0" placeholder="e.g. Pune" required value={routeData.destination} onChange={(e) => setRouteData({ ...routeData, destination: e.target.value })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Schedule Type</label>
                                                <select name="scheduleType" className="form-select form-select-lg bg-light border-0" value={routeData.scheduleType} onChange={(e) => setRouteData({ ...routeData, scheduleType: e.target.value })}>
                                                    <option>Single Day</option>
                                                    <option>Everyday</option>
                                                    <option>Alternate Days</option>
                                                    <option>Every 3 Days</option>
                                                    <option>Every 4 Days</option>
                                                    <option>Every 5 Days</option>
                                                    <option>Every 6 Days</option>
                                                    <option>Weekly</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">{routeData.scheduleType === 'Single Day' ? 'Departure Date' : 'Start Date'}</label>
                                                <input type="date" name="departureDate" className="form-control form-control-lg bg-light border-0" required value={routeData.departureDate} onChange={(e) => setRouteData({ ...routeData, departureDate: e.target.value })} />
                                            </div>
                                            {routeData.scheduleType !== 'Single Day' && (
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-secondary">End Date</label>
                                                    <input type="date" name="endDate" className="form-control form-control-lg bg-light border-0" required value={routeData.endDate} onChange={(e) => setRouteData({ ...routeData, endDate: e.target.value })} />
                                                </div>
                                            )}
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Departure Time</label>
                                                <input type="time" name="departureTime" className="form-control form-control-lg bg-light border-0" required value={routeData.departureTime} onChange={(e) => setRouteData({ ...routeData, departureTime: e.target.value })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Arrival Time</label>
                                                <input type="time" name="arrivalTime" className="form-control form-control-lg bg-light border-0" required value={routeData.arrivalTime} onChange={(e) => setRouteData({ ...routeData, arrivalTime: e.target.value })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-secondary">Fare (INR)</label>
                                                <input type="number" step="0.01" name="fare" className="form-control form-control-lg bg-light border-0" required value={routeData.fare} onChange={(e) => setRouteData({ ...routeData, fare: e.target.value })} />
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button type="submit" className="btn btn-danger btn-lg px-5 py-3 fw-bold shadow-sm" disabled={loading}>
                                                    {loading ? 'Processing...' : 'Complete Route Registration'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {activeTab === 'add-bus' && (
                                    <form onSubmit={handleBusSubmit}>
                                        <h5 className="fw-bold mb-3">Register New Bus</h5>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-secondary">Bus Name</label>
                                                <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="e.g. FastX Express" required value={busData.busName} onChange={(e) => setBusData({ ...busData, busName: e.target.value })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-secondary">Bus Number</label>
                                                <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="e.g. TN01AB1234" required value={busData.busNumber} onChange={(e) => setBusData({ ...busData, busNumber: e.target.value })} />
                                            </div>
                                            <div className="col-md-12">
                                                <label className="form-label small fw-bold text-secondary">Default Service Number</label>
                                                <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="e.g. SX-1001" value={busData.serviceNumber} onChange={(e) => setBusData({ ...busData, serviceNumber: e.target.value })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Bus Type</label>
                                                <select className="form-select form-select-lg bg-light border-0" value={busData.busType} onChange={(e) => setBusData({ ...busData, busType: e.target.value })}>
                                                    <option>AC Sleeper</option>
                                                    <option>Non-AC Sleeper</option>
                                                    <option>AC Seater</option>
                                                    <option>Non-AC Seater</option>
                                                    <option>Volvo AC</option>
                                                    <option>Semi-Sleeper</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Total Seats</label>
                                                <input type="number" min="10" max="60" className="form-control form-control-lg bg-light border-0" required value={busData.totalSeats} onChange={(e) => setBusData({ ...busData, totalSeats: parseInt(e.target.value) })} />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold text-secondary">Operator</label>
                                                <select className="form-select form-select-lg bg-light border-0" required value={busData.operatorId} onChange={(e) => setBusData({ ...busData, operatorId: e.target.value })}>
                                                    <option value="">-- Select Operator --</option>
                                                    {operators.map(op => (
                                                        <option key={op.operatorId} value={op.operatorId}>{op.companyName} (#{op.operatorId})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button type="submit" className="btn btn-danger btn-lg px-5 py-3 fw-bold shadow-sm" disabled={loading}>
                                                    {loading ? 'Registering...' : 'Register Bus'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {activeTab === 'manage-users' && (
                                    <div>
                                        <h4 className="fw-bold mb-4">User Accounts</h4>
                                        <div className="table-responsive">
                                            <table className="table table-hover border align-middle bg-white">
                                                <thead className="table-light">
                                                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr>
                                                </thead>
                                                <tbody>
                                                    {users.map(u => (
                                                        <tr key={u.userId}>
                                                            <td>#{u.userId}</td>
                                                            <td className="fw-medium">{u.firstName} {u.lastName}</td>
                                                            <td>{u.email}</td>
                                                            <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.userId)}>Delete</button></td>
                                                        </tr>
                                                    ))}
                                                    {users.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4">No users found.</td></tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'manage-operators' && (
                                    <div>
                                        <h4 className="fw-bold mb-4">Operator Accounts</h4>
                                        <div className="table-responsive">
                                            <table className="table table-hover border align-middle bg-white">
                                                <thead className="table-light">
                                                    <tr><th>ID</th><th>Company</th><th>Contact Person</th><th>Email</th><th>Actions</th></tr>
                                                </thead>
                                                <tbody>
                                                    {operators.map(o => (
                                                        <tr key={o.operatorId}>
                                                            <td>#{o.operatorId}</td>
                                                            <td className="fw-medium">{o.companyName}</td>
                                                            <td>{o.contactPersonName}</td>
                                                            <td>{o.email}</td>
                                                            <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteOperator(o.operatorId)}>Delete</button></td>
                                                        </tr>
                                                    ))}
                                                    {operators.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No operators found.</td></tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'manage-routes' && (
                                    <div>
                                        <h4 className="fw-bold mb-4">Manage System Routes</h4>
                                        <div className="table-responsive">
                                            <table className="table table-hover border align-middle bg-white">
                                                <thead className="table-light">
                                                    <tr><th>Date</th><th>Origin</th><th>Destination</th><th>Timings</th><th>Service Number</th><th>Fare</th><th>Actions</th></tr>
                                                </thead>
                                                <tbody>
                                                    {routes.map(r => (
                                                        <tr key={r.routeId}>
                                                            <td>{r.departureDate}</td>
                                                            <td>{r.origin}</td>
                                                            <td>{r.destination}</td>
                                                            <td>{r.departureTime} - {r.arrivalTime}</td>
                                                            <td className="fw-bold">{r.serviceNumber}</td>
                                                            <td>₹{r.fare}</td>
                                                            <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRoute(r.routeId)}>Delete</button></td>
                                                        </tr>
                                                    ))}
                                                    {routes.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No routes found.</td></tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'manage-bookings' && (
                                    <div>
                                        <h4 className="fw-bold mb-4">System Bookings</h4>
                                        <div className="table-responsive">
                                            <table className="table table-hover border align-middle bg-white">
                                                <thead className="table-light">
                                                    <tr><th>Booking ID / PNR</th><th>User ID</th><th>Status</th><th>Amount</th><th>Date</th></tr>
                                                </thead>
                                                <tbody>
                                                    {bookings.map(b => (
                                                        <tr key={b.bookingId}>
                                                            <td>#{b.bookingId}<br /><span className="small text-muted">{b.ticketNo}</span></td>
                                                            <td className="fw-medium">User #{b.userId}</td>
                                                            <td>
                                                                <span className={`badge ${(b.bookingStatus || b.status) === 'CANCELLED' ? 'bg-danger' : 'bg-success'}`}>
                                                                    {b.bookingStatus || b.status || 'CONFIRMED'}
                                                                </span>
                                                            </td>
                                                            <td>₹{b.totalAmount}</td>
                                                            <td>{b.bookingDate?.substring(0, 10) || 'N/A'}</td>
                                                        </tr>
                                                    ))}
                                                    {bookings.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No bookings found.</td></tr>}
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

export default AdminDashboard;
