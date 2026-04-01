import React from 'react';

const BusCard = ({ bus, onSelect }) => {
    return (
        <div className="card shadow-sm mb-3 border-0 border-start border-primary border-4">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-4">
                        <div className="mb-1">
                            <h5 className="fw-bold mb-0 text-primary">{bus.operatorName || 'FastX Premium'}</h5>
                            <div className="small fw-bold text-dark">{bus.busName}</div>
                        </div>
                        <p className="text-muted small mb-0">Service No: {bus.serviceNumber} | {bus.busType || 'A/C Sleeper (2+1)'}</p>
                    </div>
                    
                    <div className="col-md-4 text-center">
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="text-end px-3">
                                <div className="fw-bold h5 mb-0">{bus.departureTime || '21:00'}</div>
                                <div className="small text-muted">{bus.origin || 'Bengaluru'}</div>
                            </div>
                            <div className="px-2 border-start border-end text-muted small">
                                {bus.duration || '08h 30m'}
                            </div>
                            <div className="text-start px-3">
                                <div className="fw-bold h5 mb-0">{bus.arrivalTime || '05:30'}</div>
                                <div className="small text-muted">{bus.destination || 'Hyderabad'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2 text-center">
                        <div className="h4 fw-bold mb-0">₹{bus.fare || '999'}</div>
                        <div className="text-success small fw-bold">{bus.availableSeats || '12'} Seats Left</div>
                    </div>

                    <div className="col-md-2 text-end">
                        <button className="btn btn-primary w-100 fw-bold" onClick={() => onSelect(bus)}>
                            Select
                        </button>
                    </div>
                </div>
                
                <div className="mt-3 p-2 bg-light rounded px-3 d-flex flex-wrap gap-3 align-items-center small">
                    <div className="d-inline-block">
                        <span className="text-primary fw-bold me-1">✓</span> FastX Verified Service
                    </div>
                    {(bus.amenities?.waterBottle !== false) && (
                        <div className="d-inline-block text-muted" title="Water Bottle">
                            🥤 Water Bottle
                        </div>
                    )}
                    {(bus.amenities?.blanket !== false) && (
                        <div className="d-inline-block text-muted" title="Blanket">
                            🛌 Blanket
                        </div>
                    )}
                    {(bus.amenities?.chargingPoint !== false) && (
                        <div className="d-inline-block text-muted" title="Charging Point">
                            🔌 Charging Point
                        </div>
                    )}
                    {(bus.amenities?.tv !== false) && (
                        <div className="d-inline-block text-muted" title="TV">
                            📺 TV
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusCard;
