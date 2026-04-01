import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        gender: '',
        address: ''
    });
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const { firstName, lastName, phone, email } = formData;
        
        if (!isLogin) {
            if (!/^[a-zA-Z\s]+$/.test(firstName)) {
                alert("First name should only contain alphabets.");
                return false;
            }
            if (!/^[a-zA-Z\s]+$/.test(lastName)) {
                alert("Last name should only contain alphabets.");
                return false;
            }
            if (!/^[0-9]{10}$/.test(phone)) {
                alert("Phone number should be exactly 10 digits.");
                return false;
            }
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            if (isLogin) {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    if (result.user.role === 'ROLE_ADMIN') {
                        navigate('/admin');
                    } else if (result.user.role === 'ROLE_OPERATOR') {
                        navigate('/operator');
                    } else {
                        navigate('/');
                    }
                } else {
                    alert(result.message);
                }
            } else {
                const result = await register(formData);
                if (result.success) {
                    alert('Registration Successful! You can now log in with your email and password.');
                    setIsLogin(true);
                } else {
                    alert(result.message);
                }
            }
        } catch (error) {
            console.error('Auth Error:', error);
            const errorMessage = error.response?.data || error.message || 'Unknown error';
            alert('An unexpected error occurred: ' + errorMessage);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white min-vh-100 d-flex flex-column position-relative overflow-hidden">
            {/* Red Header (Match Screenshot) */}
            <div className="bg-primary text-white py-3 shadow-sm mb-0" style={{zIndex: 5}}>
                <div className="container d-flex align-items-center">
                    <button className="btn btn-primary border-0 p-0 me-3" onClick={() => navigate(-1)}>
                        <span className="h4 mb-0">&larr;</span>
                    </button>
                    <h4 className="mb-0 fw-bold flex-grow-1 text-center pe-4">{isLogin ? 'Login' : 'Register'}</h4>
                </div>
            </div>

            <div className="container flex-grow-1 d-flex flex-column justify-content-center pb-5 px-4" style={{zIndex: 2}}>
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-6 pb-5 mt-5">
                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <input
                                                name="firstName"
                                                type="text"
                                                className="form-control form-control-lg py-3 bg-light border-0 shadow-sm"
                                                placeholder="First Name"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                name="lastName"
                                                type="text"
                                                className="form-control form-control-lg py-3 bg-light border-0 shadow-sm"
                                                placeholder="Last Name"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <input
                                                name="phone"
                                                type="text"
                                                className="form-control form-control-lg py-3 bg-light border-0 shadow-sm"
                                                placeholder="Phone Number"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                                <select
                                                    name="gender"
                                                    className="form-select form-select-lg py-3 bg-light border-0 shadow-sm text-secondary"
                                                    required
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            name="address"
                                            type="text"
                                            className="form-control form-control-lg py-3 bg-light border-0 shadow-sm"
                                            placeholder="Full Address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="mb-3">
                                <input
                                    name="email"
                                    type="email"
                                    className="form-control form-control-lg py-3 bg-light border-0 shadow-sm"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4 position-relative">
                                <input
                                    name="password"
                                    type="password"
                                    className="form-control form-control-lg py-3 bg-light border-0 shadow-sm"
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <span className="position-absolute translate-middle-y top-50 end-0 me-3 text-muted" style={{cursor: 'pointer'}}>
                                    👁️
                                </span>
                            </div>

                            <button type="submit" className="btn btn-danger w-100 py-3 fw-bold rounded shadow-sm mb-4" style={{backgroundColor: '#ef4444'}}>
                                {isLogin ? 'Login' : 'Register'}
                            </button>

                            <div className="text-center small text-primary">
                                <span>
                                    <span className="text-dark opacity-75">{isLogin ? 'New User ? ' : 'Already have an account? '}</span>
                                    <span className="fw-bold cursor-pointer text-primary" style={{cursor: 'pointer'}} onClick={() => setIsLogin(!isLogin)}>
                                        {isLogin ? 'Register' : 'Login'}
                                    </span>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Monochrome Monument Background (Match Screenshot) */}
            <div 
                className="position-fixed bottom-0 start-0 w-100" 
                style={{
                    height: '22vh', 
                    backgroundImage: 'url(/india_monuments_monochrome.png)', 
                    backgroundSize: 'contain', 
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 0,
                    opacity: 0.8
                }}
            ></div>
        </div>
    );
};

export default Auth;
