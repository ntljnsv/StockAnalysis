import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import './ProfilePage.css';
import { getUserWatchlist, removeIssuerFromWatchlist } from '../../api/dataService'; // Assuming you import the functions

const ProfilePage = () => {
    const [user, setUser] = useState({ username: 'user1', watchlist: [] });
    const [hoveredStock, setHoveredStock] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserWatchlist('user1');
                setUser({ username: 'user1', watchlist: data });
            } catch (error) {
                console.error('Error fetching user watchlist:', error);
            }
        };
        fetchData();
    }, []);

    const handleRemoveFromWatchlist = async (issuer) => {
        try {
            setUser((prevState) => ({
                ...prevState,
                watchlist: prevState.watchlist.filter((item) => item.issuerName !== issuer.issuerName),
            }));

            const updatedUser = await removeIssuerFromWatchlist('user1', issuer.issuerName);
            setUser(updatedUser);
        } catch (error) {
            console.error('Error removing issuer from watchlist:', error);
        }
    };


    const handleMouseEnter = (issuerName) => {
        setHoveredStock(issuerName);
    };

    const handleMouseLeave = () => {
        setHoveredStock(null);
    };

    const getRecommendationClass = (recommendation) => {
        if (recommendation === 'Buy') return 'success';
        if (recommendation === 'Sell') return 'danger';
        if (recommendation === 'no_data' || recommendation === 'Hold') return 'warning';
        return 'secondary'; // fallback for any unexpected value
    };

    return (
        <div className="container mt-5">
            <div className="profile-header text-center mb-4">
                <FontAwesomeIcon icon={faUserCircle} size="6x" className="profile-user" />
                <h2 className="mt-3">Добредојде, {user.username}!</h2>
                <p className="text-muted">Погледни ја твојата листа на издавачи</p>
            </div>

            <div className="card shadow-lg">
                <div className="card-body">
                    <h5 className="card-title">Листа на издавачи</h5>
                    <p className="card-text">Следи ја состојбата на твоите омилени издавачи:</p>
                    {user.watchlist && user.watchlist.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {user.watchlist.map((issuer, index) => (
                                <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{issuer.issuerName}</strong> - {issuer.lastTransactionPrice.toFixed(2)} ден.
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className={`badge bg-${getRecommendationClass(issuer.currentRecommendation)} me-3`}>
                                            {issuer.currentRecommendation === 'no_data' ? 'Hold' : issuer.currentRecommendation}
                                        </span>

                                        <FontAwesomeIcon
                                            icon={hoveredStock === issuer.issuerName ? faStarRegular : faStarSolid}
                                            className="text-warning"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRemoveFromWatchlist(issuer)}
                                            onMouseEnter={() => handleMouseEnter(issuer.issuerName)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="alert alert-info" role="alert">
                            You have no issuers in your watchlist. Start adding some today!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
