import React from 'react';
import { logout } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return <button className={"btn btn-dark"} onClick={handleLogout}>Одјави се</button>;
};

export default LogoutButton;
