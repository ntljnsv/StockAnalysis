import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopLatestIssuers } from "../../api/dataService";
import BarChart from '../Charts/BarChart';
import logo from "../../assets/logo.jpg";
import './Homepage.css';

const Homepage = () => {
    const [topIssuers, setTopIssuers] = useState({
        highestPrices: [],
        lowestPrices: [],
        highestVolume: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTopLatestIssuers();
                setTopIssuers({
                    highestPrices: data.highestPrices || [],
                    lowestPrices: data.lowestPrices || [],
                    highestVolume: data.highestVolume || []
                });
            } catch (error) {
                console.error('Error fetching top issuers data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="home-page">
            <div className="intro">
                <img src={logo} alt="App Logo" className="app-logo" />
                <h1>Добредојдовте во Макции!</h1>
                <p>Вашата go-to апликација за следење на сите информации за македонските издавачи и помошник за правње на вистинските одлуки.</p>
            </div>

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <div className="graphs">
                    <div className="graph-card">
                        <h4>Топ 10 издавачи со највисока цена</h4>
                        {topIssuers.highestPrices && topIssuers.highestPrices.length > 0 ? (
                            <BarChart data={topIssuers.highestPrices} label="Цена (ден.)" barColor="rgba(75, 192, 192, 0.5)" valueType="price" />
                        ) : (
                            <p>Нема достапни податоци за највисоки цени.</p>
                        )}
                    </div>

                    <div className="graph-card">
                        <h4>Топ 10 издавачи со најниска цена</h4>
                        {topIssuers.lowestPrices && topIssuers.lowestPrices.length > 0 ? (
                            <BarChart data={topIssuers.lowestPrices} label="Цена (ден.)" barColor="rgba(255, 99, 132, 0.5)" valueType="price" />
                        ) : (
                            <p>Нема достапни податоци за најниски цени.</p>
                        )}
                    </div>

                    <div className="graph-card">
                        <h4>Топ 10 издавачи со највисок волумен</h4>
                        {topIssuers.highestVolume && topIssuers.highestVolume.length > 0 ? (
                            <BarChart data={topIssuers.highestVolume} label="Волумен" barColor="rgba(54, 162, 235, 0.5)" valueType="volume" />
                        ) : (
                            <p>Нема достапни податоци за највисок волумен.</p>
                        )}
                    </div>
                </div>
            )}

            <div className="search-link">
                <Link to="/issuers" className="search-link-button">Пребарувајте издавачи</Link>
            </div>
        </div>
    );
};

export default Homepage;
