import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllIssuers } from '../../api/dataService';
import './Homepage.css';

const Homepage = () => {
    const [issuers, setIssuers] = useState([]);

    useEffect(() => {
        const fetchIssuers = async () => {
            const data = await getAllIssuers();
            setIssuers(data);
        };
        fetchIssuers();
    }, []);

    return (
        <div className="homepage">
            <h1 className={"home-h1"}>Издавачи</h1>
            <div className="issuerGrid">
                {issuers && issuers.map((issuer, index) => (
                    <div className="issuerCard" key={index}>
                        <h2>{issuer.name}</h2>
                        <Link to={`/issuer/${issuer.name}`} className="viewDetails">
                            Повеќе информации
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
