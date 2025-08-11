import axios from 'axios';

const axiosincetence = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials : true
});

export default axiosincetence;