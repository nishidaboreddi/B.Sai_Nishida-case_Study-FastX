import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = () => {
        const cleanOrigin = origin.trim();
        const cleanDest = destination.trim();
        navigate('/search', {
            state: { origin: cleanOrigin, destination: cleanDest, date }
        });
    };

    const cities = ['Banglore', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune', 'Delhi',
                    'Vijayawada', 'Visakhapatnam', 'Coimbatore', 'Kolkata'];

    return (
        <section className="bg-primary text-white py-5">
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <h1 className="display-4 fw-bold mb-3">Travel Beyond Boundaries</h1>
                        <p className="lead mb-4">Experience the highest standards of safety, comfort, and reliability with FastX. Book your tickets in seconds.</p>
                        <div className="d-flex gap-2">
                            <span className="badge bg-light text-primary py-2 px-3 shadow-sm">Safe Travel</span>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card shadow-lg text-dark">
                            <div className="card-body p-4">
                                <h4 className="card-title mb-4 fw-bold">Search Buses</h4>
                                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">From</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Origin"
                                            list="originList"
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                            required
                                        />
                                        <datalist id="originList">
                                            {cities.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">To</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Destination"
                                            list="destList"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            required
                                        />
                                        <datalist id="destList">
                                            {cities.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Date of Journey</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                                        Search Buses
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
