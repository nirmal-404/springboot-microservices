import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`

const api = axios.create({
    baseURL: API_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    // },
});

api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    const token = localStorage.getItem("token"); // adjust as needed
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getActivities = async () => api.get(`/activities`)
export const addActivity = async (activity) => {
    console.log("Adding activity:", activity);
    api.post(`/activities`, activity)}
export const getActivityDetails = async (id) => api.get(`/recommendations/activity/${id}`)

