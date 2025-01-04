import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StockPriceVolumeChart from "../Charts/StockPriceChart";
import PercentageChangeChart from "../Charts/PercentageChangeChart";
import TurnoverChart from "../Charts/TurnoverChart";
import {addIssuerToWatchlist, getLatest100Days, getIssuer, getIssuerPricePrediction} from "../../api/dataService";
import { calculateIndicatorsForIssuer } from "../../utils/TechAnalysisUtil";
import { getDate, formatDate } from "../../utils/DateUtils";
import "./IssuerPage.css";
import DataTable from "./DataTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStar} from "@fortawesome/free-solid-svg-icons";


const IssuerPage = () => {

    const user = localStorage.getItem("username");
    const { issuerName } = useParams();
    const [stockData, setStockData] = useState([]);
    const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
    const [error, setError] = useState("");
    const [daySignal, setDaySignal] = useState({});
    const [weekSignal, setWeekSignal] = useState({});
    const [monthSignal, setMonthSignal] = useState({});
    const [sentimentRecommendation, setSentimentRecommendation] = useState();
    const [monthlyIndicators, setMonthlyIndicators] = useState({});
    const [pricePrediction, setPricePrediction] = useState(null);


    useEffect(() => {

        const fetchStockData = async () => {
            try {
                const data = await getLatest100Days(issuerName);
                setStockData(data);
            } catch (error) {
                console.log('Error fetching stock data:', error);
                setError('Failed to load stock data.');
            }
        };

        const calculateIndicators = async () => {

            const today = formatDate(new Date());
            const oneDayAgo = getDate(1);
            const oneWeekAgo = getDate(7);
            const oneMonthAgo = getDate(null, 1);

            const d = await calculateIndicatorsForIssuer(issuerName, oneDayAgo, today, 1)
            setDaySignal(d);
            const w = await calculateIndicatorsForIssuer(issuerName, oneWeekAgo, today, 5);
            setWeekSignal(w);
            const m = await calculateIndicatorsForIssuer(issuerName, oneMonthAgo, today, 21)
            if(m && m.indicators) {
                const arrayIndicators = Object.entries(m.indicators).filter(([key, value]) =>
                    Array.isArray(value) && key !== "stochastic"
                ).map(([key, value]) => {
                    const average = value.reduce((sum, num) => sum + num, 0) / value.length;
                    return { name: key, average: average};
                }).filter(({ average }) => !isNaN(average));
                setMonthlyIndicators(arrayIndicators);
            } else {
                setMonthlyIndicators({})
            }
            setMonthSignal(m);
        }

        const fetchIssuerData = async () => {

            const data = await getIssuer(issuerName);
            setSentimentRecommendation(data.currentRecommendation);
        }

        const getPrediction = async () => {

            const data = await getIssuerPricePrediction(issuerName);
            if(data && data.prediction) {
                let pred = Number.parseFloat(data.prediction);
                pred = pred.toFixed(2);
                setPricePrediction(pred);
            }
        }

        fetchIssuerData();
        fetchStockData();
        calculateIndicators();
        getPrediction();

        console.log(weekSignal)
    }, []);


    const chartData = stockData
        .map((data) => ({
            lastTransactionPrice: data.lastTransactionPrice,
            volume: data.volume,
            date: data.date,
            turnover: data.turnover,
            totalTurnover: data.totalTurnover,
            percentageChange: data.percentageChange
        }))
        .sort((a, b) => {
            const dateA = a.date.split('.').reverse().join('-');
            const dateB = b.date.split('.').reverse().join('-');
            return new Date(dateA) - new Date(dateB);
    });


    const handleAddToWatchlist = async () => {
        try {
            const response = await addIssuerToWatchlist(user, issuerName);
            if (response) {
                setIsAddedToWatchlist(true);
            }
        } catch (error) {
            console.log('Error adding issuer to watchlist:', error);
            setError('Failed to add to watchlist.');
        }
    };

    const getRecommendationClass = (recommendation) => {
        if (recommendation === 'Buy') return 'success';
        if (recommendation === 'Sell') return 'danger';
        if (recommendation === 'no_data' || recommendation === 'Hold') return 'warning';
        return 'secondary';
    };

    return (
        <div className="issuer-page">
            <h1 className={"issuer-h1"}>Историски податоци за {issuerName}</h1>

            <div className="btn-container">
                <button
                    className={`btn ${isAddedToWatchlist ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleAddToWatchlist}
                    disabled={isAddedToWatchlist}
                >
                    <FontAwesomeIcon icon={faStar} style={{color: "#ffffff",}} /> {isAddedToWatchlist ? 'Додадено во листа на омилени' : 'Додај во листа на омилени'}
                </button>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
            </div>

            <div className={"issuer-container "}>
                <div className={"chart-recommendation"}>
                    <div className="main-chart card">
                        <h3>Последна цена</h3>
                        <StockPriceVolumeChart data={chartData} />
                    </div>

                    <div className="recommendation card">
                        <div>
                            <h3>Фундаментална анализа</h3>
                            <p className={"desc"}>Наш предлог за вашата следна акција, според анализа на сентимент на вести за издавачот</p>
                            <p className={`prediction badge bg-${getRecommendationClass(sentimentRecommendation)} me-3`}>{sentimentRecommendation
                                ? sentimentRecommendation === 'no_data'
                                    ? 'Hold'
                                    : sentimentRecommendation
                                : 'Loading...'}</p>
                        </div>
                        <hr/>
                        <div>
                            <h3>LSTM Анализа</h3>
                            <p className={"desc"}>LSTM предвидување за цената на акциите според историските податоци на издавачот</p>
                            <p className={"prediction"}>{pricePrediction ? pricePrediction : "Нема доволно нови податоци"}</p>
                        </div>

                    </div>
                </div>

                <div className={"charts"}>
                    <div className="bottom-chart turnover-chart card">
                        <h3>Промет</h3>
                        <TurnoverChart data={chartData} />
                    </div>

                    <div className="bottom-chart change-chart card">
                        <h3>Промена во проценти</h3>
                        <PercentageChangeChart data={chartData} />
                    </div>
                </div>

            </div>

            <h2 className={"signals-indicators"}>Сигнали и индикатори</h2>
            <p className={"desc"}>(RSI, SMA, EMA, MACD, CCI, WMA, VWMA, HMA, Stochastic, WilliamsR)</p>
            <div className="signal-container">
                <div className="signal-group">
                    <div className="signal-item">
                        <h3>Едно дневен сигнал:</h3>
                        <p className={`badge bg-${getRecommendationClass(daySignal ? daySignal.signal : "")} me-3`}>
                            {daySignal && daySignal.signal ? daySignal.signal : "Нема доволно податоци"}
                        </p>
                    </div>

                    <div className="signal-item">
                        <h3>Неделен сигнал:</h3>
                        <p className={`badge bg-${getRecommendationClass(weekSignal ? weekSignal.signal: "")} me-3`}>
                            {weekSignal && weekSignal.signal ? weekSignal.signal : "Нема доволно податоци"}
                        </p>
                    </div>

                    <div className="signal-item">
                        <h3>Месечен сигнал:</h3>
                        <p className={`badge bg-${getRecommendationClass(monthSignal ? monthSignal.signal: "")} me-3`}>
                            {monthSignal && monthSignal.signal ? monthSignal.signal : "Нема доволно податоци"}
                        </p>
                    </div>

                </div>

                <div className="signal-group">
                    <div className="signal-item">
                        <h3>Просек на месечни индикатори со единечна вредност:</h3>
                        {monthlyIndicators.length > 0 ? (
                            <ul>
                                {monthlyIndicators.map(({ name, average }) => (
                                    <li key={name}>
                                        <strong>{name.toUpperCase()}:</strong> {average !== null ? average.toFixed(2) : 'Нема податоци'}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Нема валидни индикатори.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="issuer-card">
                <h2>Податоци</h2>
                <p className={"desc"}>Податоци за последните валидни 100 дена</p>
                <DataTable data={stockData}></DataTable>
            </div>

        </div>
    );
};

export default IssuerPage;
