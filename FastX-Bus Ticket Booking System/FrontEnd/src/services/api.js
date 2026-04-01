import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    // Don't send the token for login or register paths to avoid 403 errors from old tokens
    if (token && !config.url.includes('/auth/')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error)
);

// Add a response interceptor to handle expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token is expired or invalid
            localStorage.clear();
            if (window.location.pathname !== '/auth') {
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export const busService = {
    getAllBuses: () => api.get('/buses/getall'),
    addBus: (data) => api.post('/buses/add', data),
    deleteBus: (id) => api.delete(`/buses/delete/${id}`)
};

export const bookingService = {
    createBooking: (data) => api.post('/bookings/add', data),
    getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
    getBookingStats: () => api.get('/bookings/getall'),
    getBookingByTicketNo: (ticketNo) => api.get(`/bookings/ticket/${ticketNo}`),
    deleteBooking: (id) => api.delete(`/bookings/delete/${id}`),
    refundBooking: (id) => api.post(`/bookings/refund/${id}`)
};

export const operatorService = {
    addOperator: (data) => api.post('/operators/add', data),
    getAllOperators: () => api.get('/operators/getall'),
    deleteOperator: (id) => api.delete(`/operators/delete/${id}`)
};

export const userService = {
    getAllUsers: () => api.get('/users/getall'),
    deleteUser: (id) => api.delete(`/users/delete/${id}`)
};

export const routeService = {
    addRoute: (data) => api.post('/routes/add', data),
    getAllRoutes: () => api.get('/routes/getall'),
    deleteRoute: (id) => api.delete(`/routes/delete/${id}`)
};

export default api;
