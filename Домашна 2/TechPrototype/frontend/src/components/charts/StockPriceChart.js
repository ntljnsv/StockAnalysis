import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockPriceChart = ({ data }) => {
    const chartData = {
        labels: data.map((entry) => entry.date),
        datasets: [
            {
                label: "Цена на последна трансакција",
                data: data.map((entry) => parseFloat(entry.lastTransactionPrice)),
                fill: false,
                borderColor: "rgb(206,9,9)",
                tension: 0.1,
            },
        ],
    };




    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Цена во текот на времето",
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `$${context.raw.toFixed(2)}`;
                    },
                },
            },
        },
    };


    return (
        <div>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default StockPriceChart;
