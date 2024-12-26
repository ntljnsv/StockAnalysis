import React from 'react';
import { logout } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import {Button} from "react-bootstrap";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return <Button className={"btn btn-dark"} onClick={handleLogout}>Одјави се</Button>;
};

export default LogoutButton;
