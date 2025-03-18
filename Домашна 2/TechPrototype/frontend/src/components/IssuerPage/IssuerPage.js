import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StockPriceChart from "../charts/StockPriceChart";
import { getStockDataForIssuer } from "../../api/dataService";
import "./IssuerPage.css";

const IssuerPage = () => {
    const { issuerName } = useParams();
    const [stockData, setStockData] = useState([]);

    useEffect(() => {
        const fetchStockData = async () => {
            const data = await getStockDataForIssuer(issuerName);
            setStockData(data);
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


    return (
        <div className="issuerPage">
            <h1>Историски податоци за {issuerName}</h1>

            <div className="card">
                <h2>Последна цена</h2>
                <StockPriceChart data={chartData} />
            </div>

            <div className="card">
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
        </div>
    );
};

export default IssuerPage;
