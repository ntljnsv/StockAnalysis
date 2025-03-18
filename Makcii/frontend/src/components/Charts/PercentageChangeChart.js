import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);


const StockPercentageChangeChart = ({ data }) => {

    const percentageChangeData = {
        labels: data.map((entry) => entry.date),
        datasets: [
            {
                label: "% Промена",
                data: data.map((entry) => entry.percentageChange),
                fill: 'origin',
                borderColor: "rgb(75,192,192)",
                backgroundColor: "rgba(75,192,192, 0.2)",
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.raw.toFixed(2)}%`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <Line data={percentageChangeData} options={options} />
        </div>
    );
};

export default StockPercentageChangeChart;
