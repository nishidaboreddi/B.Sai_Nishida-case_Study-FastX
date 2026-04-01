import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BusCard from '../components/bus/BusCard';
import { routeService, busService, operatorService } from '../services/api';

const SearchResults = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Search params passed from Hero search form
    const searchOrigin = location.state?.origin || '';
    const searchDestination = location.state?.destination || '';
    const searchDate = location.state?.date || '';

    const [allRoutes, setAllRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sortBy, setSortBy] = useState('cheapest');
    const [filters, setFilters] = useState({
        ac: false, nonac: false, sleeper: false, seater: false, morning: false, evening: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all necessary data in parallel
                const [routesRes, busesRes, opsRes] = await Promise.all([
                    routeService.getAllRoutes(),
                    busService.getAllBuses(),
                    operatorService.getAllOperators()
                ]);

                const buses = busesRes.data || [];
                const routes = routesRes.data || [];
                const ops = opsRes.data || [];

                // Create lookup maps
                const busMap = {};
                buses.forEach(b => { busMap[b.busId] = b; });

                const opMap = {};
                ops.forEach(op => { opMap[op.operatorId] = op.companyName; });

                // Merge route + bus info into one object per route
                const merged = routes.map(route => {
                    const unlinkedBus = {
                        busName: 'FastX Partner',
                        busNumber: 'FX-100',
                        busType: 'AC Seater',
                        totalSeats: 36,
                        serviceNumber: route.serviceNo || 'FX-101'
                    };

                    const bus = busMap[route.busId] || unlinkedBus;
                    
                    // Calculate duration from departure and arrival times
                    let duration = '';
                    try {
                        const [dh, dm] = (route.departureTime || '00:00').split(':').map(Number);
                        const [ah, am] = (route.arrivalTime || '00:00').split(':').map(Number);
                        let diffMins = (ah * 60 + am) - (dh * 60 + dm);
                        if (diffMins < 0) diffMins += 24 * 60; // overnight
                        const hrs = Math.floor(diffMins / 60);
                        const mins = diffMins % 60;
                        duration = `${hrs}h ${mins.toString().padStart(2, '0')}m`;
                    } catch (_) {}

                    const rawService = route.serviceNo || bus.serviceNumber || bus.serviceNo || '';
                    const serviceNumber = (rawService && rawService !== 'N/A') ? rawService : `SR-${route.routeId + 1000}`;
                    
                    const rawBusName = bus.busName || route.busName || '';
                    const busName = (rawBusName && rawBusName !== 'N/A' && rawBusName !== 'Unknown Bus') ? rawBusName : (bus.busName || 'FastX Partner');

                    return {
                        id: route.routeId,
                        routeId: route.routeId,
                        busId: route.busId,
                        origin: route.origin,
                        destination: route.destination,
                        departureTime: route.departureTime,
                        arrivalTime: route.arrivalTime,
                        departureDate: route.departureDate,
                        fare: route.fare,
                        serviceNumber,
                        busName,
                        busNumber: bus.busNumber || 'FX-100',
                        busType: bus.busType || 'AC Seater',
                        totalSeats: bus.totalSeats || 36,
                        operatorName: opMap[bus.operatorId] || bus.operator?.companyName || busName,
                        duration,
                        availableSeats: bus.totalSeats || 36,
                        isAC: (bus.busType || '').toLowerCase().includes('ac') && !(bus.busType || '').toLowerCase().includes('non'),
                        isSleeper: (bus.busType || '').toLowerCase().includes('sleeper'),
                        isSeater: (bus.busType || '').toLowerCase().includes('seater') || (bus.busType === 'AC Seater'),
                    };
                });

                // Deduplicate: only show one card for each bus if route and timings along with bus number is same
                const uniqueRoutes = [];
                const seen = new Set();
                
                merged.forEach(route => {
                    const key = `${route.busNumber}|${route.origin}|${route.destination}|${route.departureDate}|${route.departureTime}|${route.arrivalTime}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueRoutes.push(route);
                    }
                });

                setAllRoutes(uniqueRoutes);
            } catch (err) {
                console.error('Error fetching search data:', err);
                setError('Failed to load buses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSelectBus = (bus) => {
        navigate('/booking', { state: { bus } });
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.id]: e.target.checked });
    };

    const filteredRoutes = useMemo(() => {
        let result = [...allRoutes];

        // City normalization helper to handle spelling variants and whitespace
        const normalizeCity = (city) => {
            if (!city) return '';
            const c = city.toString().toLowerCase().trim();
            // Handle common variants like Bangalore, Bengaloere, Bengaluru
            if (c.includes('bang') || c.includes('beng')) return 'banglore'; 
            return c;
        };

        // Date normalization helper to handle format variants (YYYY-MM-DD, DD-MM-YYYY, etc.)
        const normalizeDateString = (dateStr) => {
            if (!dateStr) return '';
            // If it's already YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
            // If it's DD-MM-YYYY or DD/MM/YYYY
            const parts = dateStr.toString().split(/[-/]/);
            if (parts.length === 3) {
                // If parts[0] is YYYY
                if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                // If parts[2] is YYYY (format is DD MM YYYY)
                if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
            return dateStr;
        };

        const normOrigin = normalizeCity(searchOrigin);
        const normDest = normalizeCity(searchDestination);
        const normSearchDate = normalizeDateString(searchDate);

        // Filter by search params (origin, destination, date)
        if (normOrigin) {
            result = result.filter(r =>
                normalizeCity(r.origin).includes(normOrigin)
            );
        }
        if (normDest) {
            result = result.filter(r =>
                normalizeCity(r.destination).includes(normDest)
            );
        }
        if (normSearchDate) {
            // Compare normalized strings for absolute reliability
            result = result.filter(r => normalizeDateString(r.departureDate) === normSearchDate);
        }

        // Bus type filters
        if (filters.ac || filters.nonac) {
            result = result.filter(r =>
                (filters.ac && r.isAC) || (filters.nonac && !r.isAC)
            );
        }
        if (filters.sleeper || filters.seater) {
            result = result.filter(r =>
                (filters.sleeper && r.isSleeper) || (filters.seater && r.isSeater)
            );
        }
        // Departure time filters
        if (filters.morning || filters.evening) {
            result = result.filter(r => {
                const hour = parseInt((r.departureTime || '12:00').split(':')[0]);
                return (filters.morning && hour < 10) || (filters.evening && hour >= 17);
            });
        }

        // Sorting
        if (sortBy === 'cheapest') result.sort((a, b) => a.fare - b.fare);
        else if (sortBy === 'earliest') result.sort((a, b) => (a.departureTime || '').localeCompare(b.departureTime || ''));

        return result;
    }, [allRoutes, filters, sortBy, searchOrigin, searchDestination, searchDate]);

    const routeLabel = searchOrigin && searchDestination
        ? `${searchOrigin} to ${searchDestination}`
        : 'All Routes';

    return (
        <div className="bg-light min-vh-100 py-4">
            <div className="container">
                {/* Search Summary Bar */}
                <div className="card shadow-sm mb-4 border-0">
                    <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center py-3">
                        <div className="mb-2 mb-md-0">
                            <h4 className="fw-bold mb-0 text-primary">Travel Search Results</h4>
                            <p className="text-muted small mb-0">
                                {routeLabel}{searchDate ? ` · ${searchDate}` : ''} &bull; {filteredRoutes.length} {filteredRoutes.length === 1 ? 'Bus' : 'Buses'} Found
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/')}>
                                ← Modify Search
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Filters Sidebar */}
                    <div className="col-lg-3">
                        <div className="card shadow-sm border-0 mb-4 p-3 position-sticky" style={{ top: '20px' }}>
                            <h5 className="fw-bold mb-3 border-bottom pb-2 text-primary">Filters</h5>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase">Bus Type</label>
                                <div className="form-check small mb-1">
                                    <input className="form-check-input" type="checkbox" id="ac" checked={filters.ac} onChange={handleFilterChange} />
                                    <label className="form-check-label" htmlFor="ac">A/C</label>
                                </div>
                                <div className="form-check small mb-1">
                                    <input className="form-check-input" type="checkbox" id="nonac" checked={filters.nonac} onChange={handleFilterChange} />
                                    <label className="form-check-label" htmlFor="nonac">Non-A/C</label>
                                </div>
                                <div className="form-check small mb-1">
                                    <input className="form-check-input" type="checkbox" id="sleeper" checked={filters.sleeper} onChange={handleFilterChange} />
                                    <label className="form-check-label" htmlFor="sleeper">Sleeper</label>
                                </div>
                                <div className="form-check small mb-1">
                                    <input className="form-check-input" type="checkbox" id="seater" checked={filters.seater} onChange={handleFilterChange} />
                                    <label className="form-check-label" htmlFor="seater">Seater</label>
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="form-label small fw-bold text-muted text-uppercase">Departure Time</label>
                                <div className="form-check small mb-1">
                                    <input className="form-check-input" type="checkbox" id="morning" checked={filters.morning} onChange={handleFilterChange} />
                                    <label className="form-check-label" htmlFor="morning">Morning (Before 10 AM)</label>
                                </div>
                                <div className="form-check small mb-1">
                                    <input className="form-check-input" type="checkbox" id="evening" checked={filters.evening} onChange={handleFilterChange} />
                                    <label className="form-check-label" htmlFor="evening">Evening (After 5 PM)</label>
                                </div>
                            </div>

                            <button
                                className="btn btn-sm btn-link text-decoration-none mt-3 p-0"
                                onClick={() => setFilters({ ac: false, nonac: false, sleeper: false, seater: false, morning: false, evening: false })}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="col-lg-9">
                        {/* Sort Bar */}
                        <div className="card shadow-sm border-0 mb-3 px-3 py-2 bg-white d-flex flex-row align-items-center small justify-content-between">
                            <div className="d-flex align-items-center">
                                <span className="text-muted fw-bold me-3">Sort By:</span>
                                <div className="btn-group btn-group-sm shadow-sm">
                                    <button className={`btn ${sortBy === 'cheapest' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSortBy('cheapest')}>Cheapest</button>
                                    <button className={`btn ${sortBy === 'earliest' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSortBy('earliest')}>Earliest</button>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5 card shadow-sm border-0">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3 text-muted">Finding the best buses for you...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-5 card shadow-sm border-0">
                                <h5 className="text-danger">{error}</h5>
                            </div>
                        ) : filteredRoutes.length > 0 ? (
                            filteredRoutes.map(route => (
                                <BusCard key={route.id} bus={route} onSelect={handleSelectBus} />
                            ))
                        ) : (
                            <div className="text-center py-5 card shadow-sm border-0">
                                <h5 className="text-muted">
                                    {searchOrigin || searchDestination
                                        ? `No buses found for "${routeLabel}"${searchDate ? ` on ${searchDate}` : ''}.`
                                        : 'No buses found for selected filters.'}
                                </h5>
                                <p className="small text-muted mb-3">Try clearing filters or search another route.</p>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/')}>← Back to Search</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
