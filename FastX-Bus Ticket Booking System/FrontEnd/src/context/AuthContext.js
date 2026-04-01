import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/v1/auth/login', { 
                username: email.trim().toLowerCase(), 
                password: password.trim() 
            });
            const { token, role, name, id } = response.data;
            
            const userData = { email: email.trim().toLowerCase(), role, firstName: name, id, token };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            console.error('Detailed Login Error:', error);
            const status = error.response?.status;
            let message = 'Connection Error: Server could not be reached';
            
            if (status === 401) message = 'Invalid Email or Password';
            else if (status === 403) message = 'Access Denied: Session Expired or Invalid';
            else if (status === 500) message = 'Backend Server Error (500)';
            else if (error.message) message = error.message;

            return { success: false, message, status };
        }
    };

    const register = async (userData) => {
        try {
            const sanitizedData = {
                ...userData,
                email: userData.email.trim().toLowerCase(),
                password: userData.password.trim()
            };
            await api.post('/v1/auth/register', sanitizedData);
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || error.message || 'Registration failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
