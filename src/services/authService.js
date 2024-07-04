import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const login = (formData) => {
    return axios.post(`${API_URL}/login`, formData);
};

export default {
    login,
};
