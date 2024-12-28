import { RSI, SMA, EMA, MACD, Stochastic, CCI, WilliamsR, WMA } from "technicalindicators";
import { getIssuerDataInPeriod } from "../api/dataService";

const preprocessData = (data) => {
    return data.map(d => ({
        date: d.date,
        close: d.lastTransactionPrice,
        high: d.maxPrice,
        low: d.minPrice,
        volume: d.volume,
        turnover: d.totalTurnover,
    }));
};

const calculateIndicators = (data, period) => {

    const closePrices = data.map(d => d.close);
    const highPrices = data.map(d => d.high);
    const lowPrices = data.map(d => d.low);
    const volumes = data.map(d => d.volume);

    return {
        rsi: RSI.calculate({ values: closePrices, period: period }),
        sma: SMA.calculate({ values: closePrices, period: period }),
        ema: EMA.calculate({ values: closePrices, period: period }),
        macd: MACD.calculate({
            values: closePrices,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        }),
        stochastic: Stochastic.calculate({
            high: highPrices,
            low: lowPrices,
            close: closePrices,
            period: period,
            signalPeriod: 3
        }),
        cci: CCI.calculate({
            high: highPrices,
            low: lowPrices,
            close: closePrices,
            period: period
        }),
        williamsR: WilliamsR.calculate({
            high: highPrices,
            low: lowPrices,
            close: closePrices,
            period: period
        }),
        wma: WMA.calculate({ values: closePrices, period: period }),
        vwma: calculateVWMA(closePrices, volumes),
        hma: calculateHMA(closePrices, period),
    }
};

const calculateVWMA = (closePrices, volumes) => {
    const weightedSum = closePrices.reduce((sum, price, i) => sum + price * volumes[i], 0);
    const volumeSum = volumes.reduce((sum, volume) => sum + volume, 0);
    return weightedSum / volumeSum;
};

const calculateHMA = (data, period) => {
    const sqrtPeriod = Math.sqrt(period);
    const wma1 = WMA.calculate({ values: data, period: period / 2 });
    const wma2 = WMA.calculate({ values: data, period });
    const diff = wma1.map((val, idx) => 2 * val - (wma2[idx] || 0));
    return WMA.calculate({ values: diff, period: sqrtPeriod });
};

const generateSignal = (indicators) => {

    const rsiValue = indicators.rsi.length > 0 ? indicators.rsi[0] : null;
    const smaValue = indicators.sma.length > 0 ? indicators.sma[0] : null;
    const emaValue = indicators.ema.length > 0 ? indicators.ema[0] : null;
    const macdValue = indicators.macd.length > 0 ? indicators.macd[0] : null;
    const stochasticKValue = indicators.stochastic && indicators.stochastic.length > 0 ? indicators.stochastic[0].k : null;
    const stochasticDValue = indicators.stochastic && indicators.stochastic.length > 0 ? indicators.stochastic[0].d : null;
    const williamsRValue = indicators.williamsR && indicators.williamsR.length > 0 ? indicators.williamsR[0] : null;
    const cciValue = indicators.cci && indicators.cci.length > 0 ? indicators.cci[0] : null;


    const rsiBuy = rsiValue !== null && rsiValue < 30;
    const rsiSell = rsiValue !== null && rsiValue > 70;

    const smaBuy = smaValue !== null && smaValue > emaValue;
    const smaSell = smaValue !== null && smaValue < emaValue;

    const macdBuy = macdValue !== null && macdValue > 0;
    const macdSell = macdValue !== null && macdValue < 0;

    const stochasticBuy = stochasticKValue !== null && stochasticDValue !== null && stochasticKValue > stochasticDValue;
    const stochasticSell = stochasticKValue !== null && stochasticDValue !== null && stochasticKValue < stochasticDValue;

    const williamsRBuy = williamsRValue !== null && williamsRValue < -80;
    const williamsRSell = williamsRValue !== null && williamsRValue > -20;

    const cciBuy = cciValue !== null && cciValue < -100;
    const cciSell = cciValue !== null && cciValue > 100;

    if (rsiBuy && smaBuy && macdBuy && stochasticBuy && williamsRBuy && cciBuy) {
        return "Buy";
    } else if (rsiSell && smaSell && macdSell && stochasticSell && williamsRSell && cciSell) {
        return "Sell";
    } else {
        return "Hold";
    }
};



const calculateIndicatorsForIssuer = async (issuerName, startDate, endDate, period) => {
    try {
        const data = await getIssuerDataInPeriod(issuerName, startDate, endDate);

        if (!data || data.length === 0) {
            console.log(`No data found for issuer ${issuerName} in the specified period.`);
            return null;
        }

        const processedData = preprocessData(data);
        const indicators = calculateIndicators(processedData, period);
        const signal = generateSignal(indicators);

        return {
            indicators: indicators,
            signal: signal,
        };
    } catch (error) {
        console.log('Error calculating indicators for issuer:', error);
        return null;
    }
};




export { preprocessData, calculateIndicators, generateSignal, calculateIndicatorsForIssuer };