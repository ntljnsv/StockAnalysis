import api from "./api";


export const getAllIssuers = async () => {
    try {
        const response = await api.get("/issuers/all");
        return response.data;
    } catch (error) {
        console.error('Error fetching issuers:', error);
    }
};


export const getStockDataForIssuer = async (issuerName) => {
    try {
        const response = await api.get(`/dayData/issuer/${issuerName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
};


export const getUserWatchlist = async (username) => {
    try {
        const response = await api.get(`/user/${username}/watchlist`);
        return response.data;
    } catch (error) {
        console.error('Error fetching watchlist data:', error);
    }

}

export const addIssuerToWatchlist = async (username, issuerName) => {
    try {
        const response = await api.post(`/user/${username}/watchlist/add`, {
            issuerName: issuerName
        });
        return response.data;
    } catch (error) {
        console.error('Error adding issuer to watchlist:', error);
    }

}

export const removeIssuerFromWatchlist = async (username, issuerName) => {
    try {
        const response = await api.delete(`/user/${username}/watchlist/remove`, {
            params: {issuerName: issuerName}
        });
        return response.data;
    } catch (error) {
        console.error('Error adding issuer to watchlist:', error);
    }

}