// import { useState, useEffect } from "react";
// import { getAllIssuers, getStockDataForIssuer } from "../../api/dataService";
// import { calculateIndicators, generateSignal, aggregateByPeriod } from "../../utils/TechAnalysisUtil";
//
// const TechAnalysis = () => {
//     const [analysisData, setAnalysisData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const fetchAndAnalyzeData = async () => {
//             try {
//                 setLoading(true);
//
//                 const issuers = await getAllIssuers();
//
//                 if (!issuers || issuers.length === 0) {
//                     throw new Error('No issuers found.');
//                 }
//
//                 const results = [];
//                 let counter = 10;  // To limit the number of issuers processed
//                 for (const issuer of issuers) {
//                     const stockData = await getStockDataForIssuer(issuer.name);
//
//                     if (!stockData || stockData.length === 0) {
//                         console.warn(`No stock data available for issuer: ${issuer.name}`);
//                         continue;
//                     }
//
//                     const closePrices = stockData.map(entry => entry.lastTransactionPrice);
//                     const dates = stockData.map(entry => new Date(entry.date));
//
//                     if (closePrices.length === 0) {
//                         console.warn(`No valid prices available for issuer: ${issuer.name}`);
//                         continue;
//                     }
//
//                     // Calculate indicators for daily, weekly, and monthly periods
//                     const dailyIndicators = calculateIndicators(stockData, 14);
//                     const weeklyClosePrices = aggregateByPeriod(closePrices, dates, 'week');
//                     const weeklyIndicators = calculateIndicators(weeklyClosePrices, 14);
//                     const monthlyClosePrices = aggregateByPeriod(closePrices, dates, 'month');
//                     const monthlyIndicators = calculateIndicators(monthlyClosePrices, 14);
//
//                     if (!dailyIndicators.rsi || !weeklyIndicators.rsi || !monthlyIndicators.rsi) {
//                         continue;
//                     }
//
//                     // Generate signals for all indicators
//                     const generateAllSignals = (indicators, closePrice) => {
//                         return {
//                             rsi: generateSignal(indicators.rsi, 'rsi', closePrice),
//                             sma: generateSignal(indicators.sma, 'sma', closePrice, indicators.sma[indicators.sma.length - 1]),
//                             ema: generateSignal(indicators.ema, 'ema', closePrice, indicators.ema[indicators.ema.length - 1]),
//                             macd: generateSignal(indicators.macd, 'macd', closePrice),
//                             stochastic: generateSignal(indicators.stochastic, 'stochastic', closePrice),
//                             cci: generateSignal(indicators.cci, 'cci', closePrice),
//                             williamsR: generateSignal(indicators.williamsR, 'williamsR', closePrice),
//                             wma: generateSignal(indicators.wma, 'wma', closePrice),
//                             vwma: generateSignal(indicators.vwma, 'vwma', closePrice),
//                             hma: generateSignal(indicators.hma, 'hma', closePrice)
//                         };
//                     };
//
//                     const dailySignal = generateAllSignals(dailyIndicators, closePrices[closePrices.length - 1]);
//                     const weeklySignal = generateAllSignals(weeklyIndicators, closePrices[closePrices.length - 1]);
//                     const monthlySignal = generateAllSignals(monthlyIndicators, closePrices[closePrices.length - 1]);
//
//                     counter = counter - 1;
//                     if (counter < 0)
//                         break;
//
//                     results.push({
//                         issuer: issuer.name,
//                         daily: { indicators: dailyIndicators, signal: dailySignal },
//                         weekly: { indicators: weeklyIndicators, signal: weeklySignal },
//                         monthly: { indicators: monthlyIndicators, signal: monthlySignal },
//                     });
//                 }
//
//                 setAnalysisData(results);
//             } catch (err) {
//                 setError(err.message || 'An error occurred while processing data.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         console.log(analysisData);
//         fetchAndAnalyzeData();
//     }, []);
//
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;
//
//     return (
//         <div>
//             <h1>Technical Analysis</h1>
//             {analysisData.map((item, index) => (
//                 <div key={index}>
//                     <h2>{item.issuer}</h2>
//
//                     <h3>Daily Indicators</h3>
//                     {Object.keys(item.daily.indicators).map((indicatorKey, idx) => {
//                         const indicatorValue = item.daily.indicators[indicatorKey];
//                         const lastValue = Array.isArray(indicatorValue) ? indicatorValue.slice(-1)[0] : indicatorValue;
//
//                         return (
//                             <p key={idx}>
//                                 <strong>{indicatorKey}:</strong> {lastValue} ({item.daily.signal[indicatorKey]})
//                             </p>
//                         );
//                     })}
//
//                     <h3>Weekly Indicators</h3>
//                     {Object.keys(item.weekly.indicators).map((indicatorKey, idx) => {
//                         const indicatorValue = item.weekly.indicators[indicatorKey];
//                         const lastValue = Array.isArray(indicatorValue) ? indicatorValue.slice(-1)[0] : indicatorValue;
//
//                         return (
//                             <p key={idx}>
//                                 <strong>{indicatorKey}:</strong> {lastValue} ({item.weekly.signal[indicatorKey]})
//                             </p>
//                         );
//                     })}
//
//                     <h3>Monthly Indicators</h3>
//                     {Object.keys(item.monthly.indicators).map((indicatorKey, idx) => {
//                         const indicatorValue = item.monthly.indicators[indicatorKey];
//                         const lastValue = Array.isArray(indicatorValue) ? indicatorValue.slice(-1)[0] : indicatorValue;
//
//                         return (
//                             <p key={idx}>
//                                 <strong>{indicatorKey}:</strong> {lastValue} ({item.monthly.signal[indicatorKey]})
//                             </p>
//                         );
//                     })}
//                 </div>
//             ))}
//         </div>
//     );
// };
//
// export default TechAnalysis;
