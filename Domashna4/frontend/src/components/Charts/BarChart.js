import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, label, barColor = 'rgba(75, 192, 192, 0.5)', valueType = 'price' }) => {

    const valueKey = valueType === 'price' ? 'price' : 'volume';

    const priceChartData = (data, label) => ({
        labels: data.map(item => item.issuerName),
        datasets: [
            {
                label: label,
                data: data.map(item => item[valueKey]),
                backgroundColor: barColor,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                    }
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Издавач',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: `${label.charAt(0).toUpperCase() + label.slice(1)}`,
                    font: {
                        size: 12
                    }
                },
                beginAtZero: true,
            }
        }
    };

    return (
        <div>
            <Bar data={priceChartData(data, label)} options={chartOptions} />
        </div>
    );
};

export default BarChart;
