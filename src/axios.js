import axios from 'axios';

// const instance = axios.create({
//     baseURL: 'http://localhost:5000/',
// });

const instance = axios.create({
    baseURL: 'https://blog-mern-api-sand.vercel.app',
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
});

export default instance;
