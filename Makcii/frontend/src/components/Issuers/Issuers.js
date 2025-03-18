import React, { useEffect, useState } from 'react';
import { getIssuersAndLatestPrices } from "../../api/dataService";
import './Issuers.css';


const Issuers = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [issuers, setIssuers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            const data = await getIssuersAndLatestPrices("");
            setIssuers(data);
        }
        fetchData();
    }, []);

    const handleSearchClick = async () => {

        setLoading(true);
        try {
            const data = await getIssuersAndLatestPrices(searchTerm);
            setIssuers(data);
        } catch (error) {
            console.log('Error fetching issuers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {

        setSearchTerm(event.target.value);
    };

    return (
        <div className="issuer-search-page">
            <div className="search-container">
                <h1>Пребарувај издавачи</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Внесете име на издавач..."
                        className="search-input"
                    />
                    <button onClick={handleSearchClick} className="search-button">
                        Пребарај
                    </button>
                </div>
            </div>
            <div className="results-container">
                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : (
                    <div className="issuer-list">
                        {issuers && issuers.length > 0 ? (
                            issuers.map((issuer) => (
                                <div key={issuer.issuerName} className="issuer-item">
                                    <p className="issuer-name"><a href={`/issuer/${issuer.issuerName}`}>{issuer.issuerName}</a></p>
                                    <p className="issuer-price">
                                        Последна цена: {issuer.latestPrice ? issuer.latestPrice.toFixed(2) +" ден." : 'N/A'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>Не постојат издавачи со тоа име</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Issuers;
