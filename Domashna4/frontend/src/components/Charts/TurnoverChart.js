import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const StockTurnoverChart = ({ data }) => {

    const turnoverData = {
        labels: data.map((entry) => entry.date),
        datasets: [
            {
                label: "Промет во BEST",
                data: data.map((entry) => entry.turnover),
                backgroundColor: "rgb(54,162,235)",
            },
            {
                label: "Вкупен промет",
                data: data.map((entry) => entry.totalTurnover),
                backgroundColor: "rgb(75,192,192)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.raw.toFixed(2)} denars`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <Bar data={turnoverData} options={options} />
        </div>
    );
};

export default StockTurnoverChart;
