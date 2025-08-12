import axios from 'axios';

const axiosincetence = axios.create({
    baseURL: 'https://real-time-chat-application-server-s.vercel.app',
    withCredentials : true
});

export default axiosincetence;