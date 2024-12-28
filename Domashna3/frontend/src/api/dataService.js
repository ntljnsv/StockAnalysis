import api from "./api";

export const getUserWatchlist = async (username) => {
    try {
        const response = await api.get(`/user/${username}/watchlist`);
        if(response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log('Error fetching watchlist data:', error);
    }

}

export const addIssuerToWatchlist = async (username, issuerName) => {
    try {
        const response = await api.post(`/user/${username}/watchlist/add`, {
            issuerName: issuerName
        });
        if(response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log('Error adding issuer to watchlist:', error);
    }

}

export const removeIssuerFromWatchlist = async (username, issuerName) => {
    try {
        const response = await api.delete(`/user/${username}/watchlist/remove`, {
            params: {issuerName: issuerName}
        });
        if(response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log('Error adding issuer to watchlist:', error);
    }

}


export const getIssuerDataInPeriod = async (issuerName, startDate, endDate) => {
    try {
        const response = await api.get(`/dayData/issuer/${issuerName}/period`, {
            params: {startDate: startDate, endDate: endDate}
        });
        if(response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log('Error fetching issuer data for specified period:', error);
    }
}


export const getLatest100Days = async (issuerName) => {
    try {
        const response = await api.get(`/dayData/issuer/${issuerName}/latest`);
        if(response.status === 200) {
            return response.data;
        }
        console.log(response)
        return null;
    } catch (error) {
        console.log('Error fetching issuer data for last 50 days:', error);
    }
}


export const getIssuer = async (issuerName) => {
    try {
        const response = await api.get(`/issuers/${issuerName}`)
        if(response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log('Could not find data for issuer:', error);
    }

}

export const getIssuersAndLatestPrices = async (searchTerm) => {
    try {
        const response = await api.get(`/issuers/search`, {
            params: {searchTerm: searchTerm}
        });
        if(response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log('Could not find issuers:', error);
    }

}


export const getTopIssuersYesterday = async () => {
    try {
        const response = await api.get(`/issuers/top`);
        if(response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.log('Could not top issuers:', error);
    }
}