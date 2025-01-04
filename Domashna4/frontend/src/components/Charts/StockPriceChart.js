import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);


const StockPriceVolumeChart = ({ data }) => {

    const chartData = {
        labels: data.map((entry) => entry.date),
        datasets: [
            {
                label: "Цена на последна трансакција",
                data: data.map((entry) => parseFloat(entry.lastTransactionPrice)),
                fill: false,
                borderColor: "rgb(206,9,9)",
                tension: 0.1,
                type: 'line',
                yAxisID: 'y1',
            },
            {
                label: "Волумен",
                data: data.map((entry) => parseFloat(entry.volume)),
                fill: false,
                borderColor: "rgb(0,123,255)",
                backgroundColor: "rgba(0,123,255,0.3)",
                type: 'bar',
                yAxisID: 'y2',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Цена и Волумен во текот на времето",
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        if (context.dataset.type === 'line') {
                            return `Цена: ${context.raw.toFixed(2)} ден.`;
                        }
                        return `Волумен: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                beginAtZero: false,
            },
            y2: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false,
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

export default StockPriceVolumeChart;
