import api from "./api";


export const login = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        if (response.status === 200) {
            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem("username", username);
            return response.data;
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};


export const register = async (username, password, repeatedPassword) => {
    try {
        const response = await api.post('/register', { username, password, repeatedPassword });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error('Registration failed');
    }
};


export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
};
