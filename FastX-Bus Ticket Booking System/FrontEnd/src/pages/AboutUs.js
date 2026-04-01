import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-light min-vh-100 pb-5">
            <div className="bg-primary text-white py-5 text-center shadow-sm">
                <h1 className="fw-bold display-4">About FastX Bus</h1>
                <p className="lead opacity-75">Redefining Comfort and Reliability in Travel since 2015</p>
            </div>

            <div className="container py-5">
                <div className="row g-5 align-items-center mb-5">
                    <div className="col-lg-6">
                        <h2 className="fw-bold text-primary mb-4">Who We Are</h2>
                        <p className="text-secondary mb-4" style={{lineHeight: '1.8'}}>
                            FastX is India’s leading online bus ticketing platform, connecting millions of travelers with their destinations. 
                            Our mission is to provide a seamless, secure, and comfortable travel experience, leveraging state-of-the-art 
                            technology to make bus travel as accessible as a click.
                        </p>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm p-3 bg-white rounded-4">
                                    <h5 className="fw-bold mb-1">10M+</h5>
                                    <p className="small text-muted mb-0">Happy Travelers</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm p-3 bg-white rounded-4">
                                    <h5 className="fw-bold mb-1">2000+</h5>
                                    <p className="small text-muted mb-0">Bus Operators</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                            <div className="mb-3 text-primary h1 text-center pe-3 ms-2">&bull;</div>
                            <h4 className="fw-bold">Our Vision</h4>
                            <p className="text-muted small">To be the world's most loved travel brand, known for innovation and reliability.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                            <div className="mb-3 text-primary h1 text-center pe-3 ms-2">&bull;</div>
                            <h4 className="fw-bold">User First</h4>
                            <p className="text-muted small">Every feature we build is designed to solve a traveler’s problem and save time.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                            <div className="mb-3 text-primary h1 text-center pe-3 ms-2">&bull;</div>
                            <h4 className="fw-bold">Global Presence</h4>
                            <p className="text-muted small">While we started in India, we are expanding to connect the world through roads.</p>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-5 overflow-hidden bg-primary text-white p-5 text-center">
                    <h2 className="fw-bold mb-4">Travel with Safety & Style</h2>
                    <p className="opacity-75 mb-4 px-lg-5">
                        Our fleet partners are carefully vetted for safety, hygiene, and punctual service. 
                        With FastX, you get more than just a ticket; you get a promise of a better journey.
                    </p>
                    <div>
                        <button className="btn btn-light btn-lg px-5 py-3 fw-bold text-primary rounded-pill shadow-sm">
                            Book Your Journey
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
