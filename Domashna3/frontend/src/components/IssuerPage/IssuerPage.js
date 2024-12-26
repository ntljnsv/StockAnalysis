import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StockPriceChart from "../charts/StockPriceChart";
import { getStockDataForIssuer, addIssuerToWatchlist } from "../../api/dataService"; // Assuming you have the API function for adding to the watchlist
import "./IssuerPage.css";

const IssuerPage = () => {
    const { issuerName } = useParams();
    const [stockData, setStockData] = useState([]);
    const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const data = await getStockDataForIssuer(issuerName);
                setStockData(data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
                setError('Failed to load stock data.');
            }
        };
        fetchStockData();
    }, [issuerName]);

    const displayedData = stockData.slice(0, 20);

    const chartData = displayedData
        .map((data) => ({
            lastTransactionPrice: data.lastTransactionPrice,
            date: data.date,
        }))
        .sort((a, b) => {
            const dateA = a.date.split('.').reverse().join('-');
            const dateB = b.date.split('.').reverse().join('-');
            return new Date(dateA) - new Date(dateB);
        });

    const handleAddToWatchlist = async () => {
        try {
            const response = await addIssuerToWatchlist('user1', issuerName);
            if (response) {
                setIsAddedToWatchlist(true);
            }
        } catch (error) {
            console.error('Error adding issuer to watchlist:', error);
            setError('Failed to add to watchlist.');
        }
    };

    return (
        <div className="issuer-page">
            <h1 className={"issuer-h1"}>Историски податоци за {issuerName}</h1>

            <div className="issuer-card">
                <h2 className={".issuer-h1"}>Последна цена</h2>
                <StockPriceChart data={chartData} />
            </div>

            <div className="issuer-card">
                <h2>Податоци</h2>
                <table className="styledTable">
                    <thead>
                    <tr>
                        <th>Датум</th>
                        <th>Цена на последна трансакција</th>
                        <th>Макс</th>
                        <th>Мин</th>
                        <th>Просечна цена</th>
                        <th>% Промена</th>
                        <th>Волумен</th>
                        <th>Промет во БЕСТ</th>
                        <th>Вкупен промет</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayedData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.lastTransactionPrice}</td>
                            <td>{row.maxPrice || "-"}</td>
                            <td>{row.minPrice || "-"}</td>
                            <td>{row.avgPrice}</td>
                            <td>{row.percentageChange}</td>
                            <td>{row.quantity}</td>
                            <td>{row.turnover}</td>
                            <td>{row.totalTurnover}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3">
                <button
                    className={`btn ${isAddedToWatchlist ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleAddToWatchlist}
                    disabled={isAddedToWatchlist}
                >
                    {isAddedToWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}
                </button>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
            </div>
        </div>
    );
};

export default IssuerPage;
