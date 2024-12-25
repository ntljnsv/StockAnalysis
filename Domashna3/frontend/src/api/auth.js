import api from "./api";


export const login = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        console.log(response)
        const token = response.data.token;
        localStorage.setItem('token', token);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};


export const register = async (username, password, repeatedPassword) => {
    try {
        const response = await api.post('/register', { username, password, repeatedPassword });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Registration failed');
    }
};


export const logout = () => {
    localStorage.removeItem('token');
};
