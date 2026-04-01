import React from 'react';

const ContactUs = () => {
    return (
        <div className="bg-light min-vh-100 pb-5">
            <div className="bg-primary text-white py-5 shadow-sm text-center">
                <h1 className="fw-bold display-4">Contact Us</h1>
                <p className="lead opacity-75">We’re here to help you 24/7 with your travel questions.</p>
            </div>

            <div className="container py-5">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-5 bg-white">
                            <h3 className="fw-bold text-primary mb-4">Get in Touch</h3>
                            <p className="text-muted mb-4 small">Whether it’s about a booking, an operator, or a simple hello, drop us a message below.</p>
                            <form>
                                <div className="row g-3">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-secondary">Full Name</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0 shadow-none px-4 py-3 rounded-3" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-secondary">Email Address</label>
                                        <input type="email" className="form-control form-control-lg bg-light border-0 shadow-none px-4 py-3 rounded-3" />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label small fw-bold text-secondary">Subject</label>
                                        <select className="form-select form-select-lg bg-light border-0 shadow-none px-4 py-3 rounded-3">
                                            <option>Booking Issue</option>
                                            <option>Payment Refund</option>
                                            <option>General Feedback</option>
                                            <option>Other Enquiry</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-4">
                                        <label className="form-label small fw-bold text-secondary">Message</label>
                                        <textarea className="form-control bg-light border-0 shadow-none px-4 py-3 rounded-3" rows="4"></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary btn-lg px-5 py-3 fw-bold rounded-pill shadow-sm">
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white h-100">
                            <h5 className="fw-bold text-primary mb-4">Quick Links</h5>
                            <div className="d-flex align-items-center mb-4">
                                <div className="me-3 text-secondary h2 mb-0">&bull;</div>
                                <div>
                                    <p className="small text-muted mb-0 fw-bold">Support Email</p>
                                    <p className="mb-0 text-primary">support@fastxbus.com</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-4">
                                <div className="me-3 text-secondary h2 mb-0">&bull;</div>
                                <div>
                                    <p className="small text-muted mb-0 fw-bold">Helpline (24/7)</p>
                                    <p className="mb-0 text-primary">+1 800-FASTX-BUS</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-4">
                                <div className="me-3 text-secondary h2 mb-0">&bull;</div>
                                <div>
                                    <p className="small text-muted mb-0 fw-bold">Corporate Office</p>
                                    <p className="mb-0 text-primary small">FastX Tech Hub, Sector 44, Gurgaon, Haryana, India</p>
                                </div>
                            </div>

                            <hr className="my-4 opacity-75" />

                            <h5 className="fw-bold text-primary mb-3">Follow Us</h5>
                            <div className="d-flex gap-3">
                                <div className="p-3 bg-light rounded-circle shadow-sm small text-primary">&bull;</div>
                                <div className="p-3 bg-light rounded-circle shadow-sm small text-primary">&bull;</div>
                                <div className="p-3 bg-light rounded-circle shadow-sm small text-primary">&bull;</div>
                                <div className="p-3 bg-light rounded-circle shadow-sm small text-primary">&bull;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
