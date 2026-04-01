import React from 'react';

const SeatSelection = ({ selectedSeats, onToggleSeat, bookedSeats = {}, layoutType = 'seater' }) => {
    
    const getSeatClass = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            return layoutType === 'luxury-seater' ? 'luxury-seat selected' : 'btn-primary shadow-sm';
        }
        
        const booked = bookedSeats[seatId];
        if (booked) {
            if (layoutType === 'luxury-seater') return 'luxury-seat occupied';
            return booked === 'female' ? 'btn-pink' : 'btn-danger';
        }
        
        return layoutType === 'luxury-seater' ? 'luxury-seat' : 'btn-outline-secondary';
    };

    const renderSeat = (seatId, isSleeper = false) => {
        const isBooked = !!bookedSeats[seatId];
        const isFemale = bookedSeats[seatId] === 'female';
        const isLuxury = layoutType === 'luxury-seater';
        
        const pinkStyle = (isFemale && !isLuxury) ? { backgroundColor: '#ff69b4', borderColor: '#ff69b4', color: 'white' } : {};
        
        const width = isSleeper ? '60px' : (isLuxury ? '38px' : '35px');
        const height = isSleeper ? '35px' : (isLuxury ? '38px' : '35px');

        return (
            <button 
                key={seatId}
                className={`btn btn-sm p-1 d-flex align-items-center justify-content-center ${getSeatClass(seatId)}`}
                style={{
                    width: width, 
                    height: height, 
                    fontSize: isLuxury ? '0.75rem' : '0.65rem',
                    cursor: isBooked ? 'not-allowed' : 'pointer',
                    opacity: isBooked ? 0.8 : 1,
                    ...pinkStyle
                }}
                onClick={() => !isBooked && onToggleSeat(seatId)}
            >
                {seatId}
            </button>
        );
    };

    const LuxurySeaterLayout = () => {
        const rows = [
            { left: [40], right: [2, 1], hasGap: true },
            { left: [6, 5], right: [4, 3] },
            { left: [10, 9], right: [8, 7] },
            { left: [14, 13], right: [12, 11] },
            { left: [18, 17], right: [16, 15] },
            { left: [22, 21], right: [20, 19] },
            { left: [26, 25], right: [24, 23] },
            { left: [30, 29], right: [28, 27] },
            { left: [34, 33], right: [32, 31] },
            { left: [39, 38, 37, 36, 35], right: [], isLast: true }
        ];

        return (
            <div className="luxury-bus-container mx-auto" style={{ maxWidth: '280px' }}>
                <div className="d-flex justify-content-end mb-4 px-2">
                    <svg className="steering-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    </svg>
                </div>
                <div className="d-flex flex-column gap-3">
                    {rows.map((row, idx) => (
                        <div key={idx} className="d-flex justify-content-center align-items-center">
                            {row.isLast ? (
                                <div className="d-flex gap-2">
                                    {row.left.map(s => renderSeat(s.toString()))}
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex gap-2">
                                        {row.left.map(s => renderSeat(s.toString()))}
                                        {row.hasGap && <div className="front-gap"></div>}
                                    </div>
                                    <div className="aisle-gap"></div>
                                    <div className="d-flex gap-2">
                                        {row.right.map(s => renderSeat(s.toString()))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const SeaterLayout = () => (
        <div className="bg-light p-3 border rounded mx-auto" style={{ width: '240px' }}>
            <div className="text-end mb-4">
                <span className="badge bg-secondary px-3">Steering</span>
            </div>
            <div className="d-flex flex-column gap-3">
                {[...Array(10)].map((_, rowIndex) => (
                    <div key={rowIndex} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                            {['A', 'B'].map(col => renderSeat(`${rowIndex + 1}${col}`))}
                        </div>
                        <div style={{ width: '20px' }}></div>
                        <div className="d-flex gap-2">
                            {['C', 'D'].map(col => renderSeat(`${rowIndex + 1}${col}`))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const SleeperLayout = () => {
        const renderDeck = (deckLabel, rowPrefix) => (
            <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                    <span className="fw-bold small text-muted text-uppercase">{deckLabel} Deck</span>
                    <hr className="flex-grow-1 ms-2 my-0" />
                </div>
                <div className="bg-light p-3 border rounded">
                    {deckLabel === 'Lower' && (
                         <div className="text-end mb-3">
                            <span className="badge bg-secondary px-2 py-1">Steering</span>
                         </div>
                    )}
                    <div className="d-flex flex-column gap-3">
                        {[...Array(6)].map((_, rowIndex) => (
                            <div key={rowIndex} className="d-flex justify-content-between align-items-center gap-3">
                                {/* Left Side: Single Column */}
                                <div className="d-flex">
                                    {renderSeat(`${rowPrefix}${rowIndex + 1}L`, true)}
                                </div>
                                
                                <div className="flex-grow-1"></div>
                                
                                {/* Right Side: Double Column */}
                                <div className="d-flex gap-2">
                                    {['MR', 'R'].map(col => renderSeat(`${rowPrefix}${rowIndex + 1}${col}`, true))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        return (
            <div className="mx-auto" style={{ maxWidth: '350px' }}>
                {renderDeck('Upper', 'U')}
                {renderDeck('Lower', 'L')}
            </div>
        );
    };

    const renderSelectedLayout = () => {
        if (layoutType === 'sleeper') return <SleeperLayout />;
        if (layoutType === 'luxury-seater') return <LuxurySeaterLayout />;
        return <SeaterLayout />;
    };

    return (
        <div className="p-4 bg-white border rounded shadow-sm">
            <h5 className="fw-bold mb-4 text-center border-bottom pb-2">
                {layoutType === 'sleeper' ? 'Select Berths' : 'Select Seats'}
            </h5>
            
            <div className="mb-4">
                {renderSelectedLayout()}
            </div>

            <div className="row g-2 small border-top pt-3 text-center">
                <div className="col-6 col-md-3">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className={`rounded me-2 ${layoutType === 'luxury-seater' ? 'luxury-seat' : 'border border-secondary'}`} style={{width: '15px', height: '15px'}}></div>
                        Available
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className={`rounded me-2 ${layoutType === 'luxury-seater' ? 'luxury-seat selected' : 'bg-primary'}`} style={{width: '15px', height: '15px'}}></div>
                        Selected
                    </div>
                </div>
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className={`rounded me-2 ${layoutType === 'luxury-seater' ? 'luxury-seat occupied' : 'bg-danger'}`} style={{width: '15px', height: '15px'}}></div>
                        Occupied
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
