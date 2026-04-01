import React, { useState } from 'react';

const Help = () => {
    const faqs = [
        {
            category: 'Booking',
            questions: [
                { q: "How do I book a bus ticket on FastX?", a: "Enter your source, destination, and travel date on the home page, select a bus, choose your seat, and proceed to payment." },
                { q: "Can I book a ticket for someone else?", a: "Yes, you can book for others. Just provide their correct passenger details during checkout." }
            ]
        },
        {
            category: 'Cancellations & Refunds',
            questions: [
                { q: "What is the cancellation policy?", a: "Cancellation policies vary by operator. Usually, if you cancel 24 hours before travel, you get a 90% refund." },
                { q: "How long does a refund take?", a: "Refunds typically take 5-7 business days to reflect in your bank account." }
            ]
        },
        {
            category: 'Safety & Comfort',
            questions: [
                { q: "Is it safe for female travelers?", a: "Yes, we have female-only seat reserves and track all buses in real-time." },
                { q: "Are the buses sanitized?", a: "Our partners adhere to strict hygiene standards, with sanitization before and after every trip." }
            ]
        }
    ];

    return (
        <div className="bg-light min-vh-100 pb-5">
            <div className="bg-primary text-white py-5 shadow-sm text-center">
                <h1 className="fw-bold display-4">Help & Support</h1>
                <p className="lead opacity-75">Find answers to common questions or reach out to us.</p>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {faqs.map((group, gIdx) => (
                            <div key={gIdx} className="mb-5">
                                <h3 className="fw-bold text-primary mb-4">{group.category}</h3>
                                <div className="accordion border-0 shadow-sm rounded-4 overflow-hidden" id={`accordion-${gIdx}`}>
                                    {group.questions.map((faq, qIdx) => (
                                        <div key={qIdx} className="accordion-item border-0 border-bottom">
                                            <h2 className="accordion-header">
                                                <button 
                                                    className="accordion-button collapsed py-4 px-4 fw-bold shadow-none bg-white text-dark" 
                                                    type="button" 
                                                    data-bs-toggle="collapse" 
                                                    data-bs-target={`#collapse-${gIdx}-${qIdx}`}
                                                >
                                                    {faq.q}
                                                </button>
                                            </h2>
                                            <div id={`collapse-${gIdx}-${qIdx}`} className="accordion-collapse collapse" data-bs-parent={`#accordion-${gIdx}`}>
                                                <div className="accordion-body py-4 px-4 text-secondary">
                                                    {faq.a}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="card border-0 shadow-sm rounded-4 bg-white p-5 mt-5 text-center">
                            <h4 className="fw-bold mb-4">Still have questions?</h4>
                            <p className="text-muted mb-4 px-lg-5">
                                If you couldn’t find what you were looking for, our friendly support team is just a call or message away.
                            </p>
                            <div className="d-flex flex-wrap gap-3 justify-content-center">
                                <button className="btn btn-outline-primary btn-lg px-5 py-2 fw-bold text-primary rounded-pill">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
