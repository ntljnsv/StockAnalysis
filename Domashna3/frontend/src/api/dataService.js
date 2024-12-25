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
