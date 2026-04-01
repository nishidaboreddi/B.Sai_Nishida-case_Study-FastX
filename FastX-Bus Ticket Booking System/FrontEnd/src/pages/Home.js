import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/common/Hero';
import { routeService } from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const [popularRoutes, setPopularRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularRoutes = async () => {
            try {
                const response = await routeService.getAllRoutes();
                const allRoutes = response.data || [];
                
                // Group by unique Origin-Destination pairs and find cheapest fare
                const routeMap = {};
                allRoutes.forEach(r => {
                    const key = `${r.origin}-${r.destination}`;
                    if (!routeMap[key] || r.fare < routeMap[key].fare) {
                        routeMap[key] = {
                            origin: r.origin,
                            destination: r.destination,
                            fare: r.fare,
                            date: r.departureDate // suggested date
                        };
                    }
                });

                // Convert map to array and take top 6
                setPopularRoutes(Object.values(routeMap).slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch popular routes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularRoutes();
    }, []);

    const handleViewBuses = (route) => {
        navigate('/search', {
            state: { 
                origin: route.origin, 
                destination: route.destination, 
                date: route.date 
            }
        });
    };

    return (
        <div className="home-page">
            <Hero />
            
            <section className="container py-5">
                <h2 className="mb-4 text-center fw-bold text-primary">Popular Routes</h2>
                <div className="row g-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm border-0 bg-light-subtle animate-pulse" style={{minHeight: '150px'}}></div>
                            </div>
                        ))
                    ) : popularRoutes.length > 0 ? (
                        popularRoutes.map((route, idx) => (
                            <div key={idx} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm border-0 border-top border-primary border-4 hover-lift">
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold mb-1 text-dark text-capitalize">{route.origin} to {route.destination}</h5>
                                        <p className="text-muted small mb-3">Daily Services • High Comfort</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="h5 mb-0 text-primary fw-bold">₹{route.fare} <small className="text-muted fw-normal" style={{fontSize: '0.8rem'}}>onwards</small></span>
                                            <button className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={() => handleViewBuses(route)}>View Buses</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center text-muted">
                            <p>Discover our wide network of routes across the country.</p>
                        </div>
                    )}
                </div>
            </section>

            <style>{`
                .hover-lift { transition: transform 0.2s; }
                .hover-lift:hover { transform: translateY(-5px); }
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
            `}</style>

            <section className="bg-light py-5">
                <div className="container">
                    <div className="row text-center g-4">
                        <div className="col-md-4">
                            <div className="p-3">
                                <h3 className="h5 fw-bold">24/7 Support</h3>
                                <p className="text-muted small">We are here to help you anytime, anywhere.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3">
                                <h3 className="h5 fw-bold">Safe Travel</h3>
                                <p className="text-muted small">Your safety is our top priority during every journey.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3">
                                <h3 className="h5 fw-bold">Easy Cancellation</h3>
                                <p className="text-muted small">Get instant refunds with our simple cancellation policy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
