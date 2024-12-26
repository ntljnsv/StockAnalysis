import React, { useEffect, useState } from 'react';
import { RSI, SMA, EMA} from 'technicalindicators';
import  {getAllIssuers, getStockDataForIssuer} from "../../api/dataService";

const calculateIndicators = (closePrices, period) => {
    return {
        rsi: RSI.calculate({ values: closePrices, period }),
        sma: SMA.calculate({ values: closePrices, period }),
        ema: EMA.calculate({ values: closePrices, period }),
    };
};

const aggregateByPeriod = (prices, dates, period) => {
    const grouped = {};

    dates.forEach((date, index) => {
        const key =
            period === 'week'
                ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
                : `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(prices[index]);
    });

    return Object.values(grouped).map(periodPrices =>
        periodPrices.reduce((sum, price) => sum + price, 0) / periodPrices.length
    );
};

const generateSignal = (indicator, type, closePrice, sma, ema) => {

    let signal = 'Hold';
    if (indicator === undefined || indicator.length === 0) {
        return 'Hold';
    }
    const latestIndicator = indicator[indicator.length - 1];

    if (type === 'rsi') {
        if (latestIndicator < 30) {
            signal = 'Buy';
        } else if (latestIndicator > 70) {
            signal = 'Sell';
        }
    } else if (type === 'sma') {
        if (closePrice > sma) {
            signal = 'Buy';
        } else if (closePrice < sma) {
            signal = 'Sell';
        }
    } else if (type === 'ema') {
        if (closePrice > ema) {
            signal = 'Buy';
        } else if (closePrice < ema) {
            signal = 'Sell';
        }
    }


    return signal;
};
const TechAnalysis = () => {
    const [analysisData, setAnalysisData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndAnalyzeData = async () => {
            try {
                setLoading(true);

                const issuers = await getAllIssuers();

                if (!issuers || issuers.length === 0) {
                    throw new Error('No issuers found.');
                }

                const results = [];
                let counter = 10;
                for (const issuer of issuers) {
                    const stockData = await getStockDataForIssuer(issuer.name);

                    if (!stockData || stockData.length === 0) {
                        console.warn(`No stock data available for issuer: ${issuer.name}`);
                        continue;
                    }

                    const closePrices = stockData.map(entry => entry.lastTransactionPrice);
                    const dates = stockData.map(entry => new Date(entry.date));

                    if (closePrices.length === 0) {
                        console.warn(`No valid prices available for issuer: ${issuer.name}`);
                        continue;
                    }

                    const dailyIndicators = calculateIndicators(closePrices, 14);

                    if (dailyIndicators.rsi.length <= 0 || dailyIndicators.sma.length <= 0 || dailyIndicators.ema.length <= 0) {
                        continue;
                    }

                    const dailySignal = {
                        rsi: dailyIndicators.rsi.length > 0 ? generateSignal(dailyIndicators.rsi, 'rsi', closePrices[closePrices.length - 1]) : 'Hold',
                        sma: dailyIndicators.sma.length > 0 ? generateSignal(dailyIndicators.sma, 'sma', closePrices[closePrices.length - 1], dailyIndicators.sma[dailyIndicators.sma.length - 1]) : 'Hold',
                        ema: dailyIndicators.ema.length > 0 ? generateSignal(dailyIndicators.ema, 'ema', closePrices[closePrices.length - 1], dailyIndicators.ema[dailyIndicators.ema.length - 1]) : 'Hold',
                    };


                    const weeklyClosePrices = aggregateByPeriod(closePrices, dates, 'week');
                    const weeklyIndicators = calculateIndicators(weeklyClosePrices, 14);

                    if (weeklyIndicators.rsi.length <= 0 || weeklyIndicators.sma.length <= 0 || weeklyIndicators.ema.length <= 0) {
                        continue;
                    }

                    const weeklySignal = {
                        rsi: weeklyIndicators.rsi.length > 0 ? generateSignal(weeklyIndicators.rsi.slice(-1)[0], 'rsi', weeklyClosePrices[weeklyClosePrices.length - 1]) : 'Hold',
                        sma: weeklyIndicators.sma.length > 0 ? generateSignal(weeklyIndicators.sma.slice(-1)[0], 'sma', weeklyClosePrices[weeklyClosePrices.length - 1], weeklyIndicators.sma.slice(-1)[0]) : 'Hold',
                        ema: weeklyIndicators.ema.length > 0 ? generateSignal(weeklyIndicators.ema.slice(-1)[0], 'ema', weeklyClosePrices[weeklyClosePrices.length - 1], weeklyIndicators.ema.slice(-1)[0]) : 'Hold',
                    };

                    const monthlyClosePrices = aggregateByPeriod(closePrices, dates, 'month');
                    const monthlyIndicators = calculateIndicators(monthlyClosePrices, 14);

                    if (monthlyIndicators.rsi.length <= 0 || monthlyIndicators.sma.length <= 0 || monthlyIndicators.ema.length <= 0) {
                        continue;
                    }

                    const monthlySignal = {
                        rsi: monthlyIndicators.rsi.length >0 ? generateSignal(monthlyIndicators.rsi.slice(-1)[0], 'rsi', monthlyClosePrices[monthlyClosePrices.length - 1]) : 'Hold',
                        sma: monthlyIndicators.sma.length >0 ? generateSignal(monthlyIndicators.sma.slice(-1)[0], 'sma', monthlyClosePrices[monthlyClosePrices.length - 1], monthlyIndicators.sma.slice(-1)[0]) : 'Hold',
                        ema: monthlyIndicators.ema.length >0 ? generateSignal(monthlyIndicators.ema.slice(-1)[0], 'ema', monthlyClosePrices[monthlyClosePrices.length - 1], monthlyIndicators.ema.slice(-1)[0]) : 'Hold',
                    };

                    counter = counter - 1;
                    if (counter < 0)
                        break;

                    results.push({
                        issuer: issuer.name,
                        daily: { indicators: dailyIndicators , signal: dailySignal },
                        weekly: { indicators: weeklyIndicators, signal: weeklySignal },
                        monthly: { indicators: monthlyIndicators, signal: monthlySignal },
                    });
                }

                setAnalysisData(results);
            } catch (err) {
                setError(err.message || 'An error occurred while processing data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndAnalyzeData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Technical Analysis</h1>
            {analysisData.map((item, index) => (
                <div key={index}>
                    <h2>{item.issuer}</h2>
                    <h3>Daily Indicators</h3>
                    <p><strong>RSI:</strong> {item.daily.indicators.rsi.slice(-1)[0]} ({item.daily.signal.rsi})</p>
                    <p><strong>SMA:</strong> {item.daily.indicators.sma.slice(-1)[0]} ({item.daily.signal.sma})</p>
                    <p><strong>EMA:</strong> {item.daily.indicators.ema.slice(-1)[0]} ({item.daily.signal.ema})</p>

                    <h3>Weekly Indicators</h3>
                    <p><strong>RSI:</strong> {item.weekly.indicators.rsi.slice(-1)[0]}  ({item.weekly.signal.rsi})</p>
                    <p><strong>SMA:</strong> {item.weekly.indicators.sma.slice(-1)[0]}  ({item.weekly.signal.sma})</p>
                    <p><strong>EMA:</strong> {item.weekly.indicators.ema.slice(-1)[0]}  ({item.weekly.signal.ema})</p>

                    <h3>Monthly Indicators</h3>
                    <p><strong>RSI:</strong> {item.monthly.indicators.rsi.slice(-1)[0]} ({item.monthly.signal.rsi})</p>
                    <p><strong>SMA:</strong> {item.monthly.indicators.sma.slice(-1)[0]} ({item.monthly.signal.sma})</p>
                    <p><strong>EMA:</strong> {item.monthly.indicators.ema.slice(-1)[0]} ({item.monthly.signal.ema})</p>

                </div>
            ))}
        </div>
    );
};

export default TechAnalysis;
