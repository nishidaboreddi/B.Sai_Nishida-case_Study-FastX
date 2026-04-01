import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="bg-light min-vh-100 pb-5">
            <div className="bg-primary text-white py-5 shadow-sm text-center">
                <h1 className="fw-bold display-4">Policy & Terms</h1>
                <p className="lead opacity-75">Our commitment to transparency and fairness in services.</p>
            </div>

            <div className="container py-5">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow-sm rounded-4 bg-white p-5 overflow-hidden">
                            <h3 className="fw-bold text-primary mb-4 p-3 border-0 border-bottom">Booking Policy</h3>
                            <p className="text-secondary small mb-4 ms-3" style={{lineHeight: '1.8'}}>
                                - Tickets are non-transferable and must be presented at the time of boarding. <br />
                                - Passengers must arrive at the boarding point at least 15 minutes before the departure time. <br />
                                - FastX is a technology platform connecting travelers and bus operators. We are not responsible for bus delays or breakdowns.
                            </p>

                            <h3 className="fw-bold text-primary mb-4 p-3 border-0 border-bottom">Refund & Cancellation</h3>
                            <p className="text-secondary small mb-4 ms-3" style={{lineHeight: '1.8'}}>
                                - Cancellation made 24 hours prior to travel: 90% Refund. <br />
                                - Cancellation made 12-24 hours prior to travel: 75% Refund. <br />
                                - Cancellation made within 12 hours: No Refund. <br />
                                - Refunds will be credited to the original payment source within 5-7 business days.
                            </p>

                            <h3 className="fw-bold text-primary mb-4 p-3 border-0 border-bottom">Privacy Policy</h3>
                            <p className="text-secondary small mb-4 ms-3" style={{lineHeight: '1.8'}}>
                                - We value your privacy and only collect necessary details like name, email, and travel preference. <br />
                                - Your data is protected using enterprise-grade encryption. <br />
                                - We do not sell your personal data to third parties.
                            </p>

                            <h3 className="fw-bold text-primary mb-4 p-3 border-0 border-bottom">Insurance & Liability</h3>
                            <p className="text-secondary small mb-4 ms-3" style={{lineHeight: '1.8'}}>
                                - Every ticket booked through FastX includes a complimentary travel insurance policy for the duration of the journey. <br />
                                - Liability for loss of luggage lies with the bus operator as per their individual carrier policy.
                            </p>

                            <div className="alert alert-info border-0 rounded-4 mt-5 p-4 d-flex align-items-center">
                                <span className="h4 text-info fw-bold me-3 mb-0">&bull;</span>
                                <p className="mb-0 text-muted small">
                                    Last Updated: March 30, 2026. For further clarification, please contact our Legal team at legal@fastxbus.com.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
