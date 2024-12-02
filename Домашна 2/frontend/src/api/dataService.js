const BASE_URL = 'http://localhost:8080';

export const getAllIssuers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/issuers/all`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching issuers:', error);
    }
};


export const getStockDataForIssuer = async (issuerName) => {
    try {
        const response = await fetch(`${BASE_URL}/api/issuer/${issuerName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
};
