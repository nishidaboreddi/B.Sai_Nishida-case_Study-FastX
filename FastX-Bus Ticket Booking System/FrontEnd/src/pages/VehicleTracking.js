import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VehicleTracking = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Mock recent searches (purely numeric 4-5 digit strings)
    const [recentSearches] = useState(['4567', '8912', '10293']);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            alert(`Tracking Bus Service: ${searchQuery}\nStatus: On Time\nNext Stop: Hyderabad Bypass`);
        }
    };

    return (
        <div className="bg-white min-vh-100">
            {/* Red Header (Match Screenshot) */}
            <div className="bg-primary text-white py-3 shadow-sm mb-0">
                <div className="container d-flex align-items-center">
                    <button className="btn btn-primary border-0 p-0 me-3" onClick={() => navigate(-1)}>
                        <span className="h4 mb-0">&larr;</span>
                    </button>
                    <h4 className="mb-0 fw-bold flex-grow-1">Track by Service Number</h4>
                    <button className="btn btn-primary border-0 p-0">
                        <span className="h4 mb-0">☆</span>
                    </button>
                </div>
            </div>

            {/* Search Bar (Match Screenshot) */}
            <div className="bg-light py-2 border-bottom shadow-sm">
                <div className="container">
                    <form onSubmit={handleSearch} className="position-relative">
                        <span className="position-absolute translate-middle-y top-50 start-0 ms-3 text-muted">🔍</span>
                        <input 
                            type="text" 
                            className="form-control form-control-lg border-0 bg-white ps-5 rounded-pill shadow-sm"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <span 
                                className="position-absolute translate-middle-y top-50 end-0 me-3 text-muted cursor-pointer"
                                onClick={() => setSearchQuery('')}
                                style={{cursor: 'pointer'}}
                            >
                                ✕
                            </span>
                        )}
                    </form>
                </div>
            </div>

            <div className="container py-4">
                <h6 className="fw-bold mb-3 text-dark">Recent Search</h6>
                <div className="d-flex flex-wrap gap-3">
                    {recentSearches.map((s, idx) => (
                        <button 
                            key={idx} 
                            className="btn btn-outline-secondary px-4 py-2 bg-white border border-light-subtle shadow-sm rounded-1 text-dark fw-normal"
                            onClick={() => setSearchQuery(s)}
                        >
                            {s}
                        </button>
                    ))}
                    {recentSearches.length === 0 && (
                        <p className="text-muted small">No recent searches found.</p>
                    )}
                </div>

                {/* Tracking Info Placeholder */}
                {searchQuery && (
                    <div className="mt-5 text-center py-5">
                        <div className="spinner-grow text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted">Fetching real-time location for {searchQuery}...</p>
                    </div>
                )}

                {!searchQuery && (
                    <div className="mt-5 text-center py-5 opacity-25">
                        <span className="display-1">📍</span>
                        <p className="mt-2">Enter a service number to track your bus</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleTracking;
