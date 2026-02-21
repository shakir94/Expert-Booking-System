import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
});


API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);


export const getExperts = (params) => API.get('/experts', { params });
export const getExpertById = (id) => API.get(`/experts/${id}`);


export const createBooking = (data) => API.post('/bookings', data);
export const getBookingsByEmail = (email) => API.get('/bookings', { params: { email } });
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });

export default API;
