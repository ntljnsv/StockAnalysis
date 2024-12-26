import React from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from "@fortawesome/free-solid-svg-icons";
import LogoutButton from './LogoutBtn';
import logo from '../../assets/logo.jpg';
import './Navbar.css';
import {Button} from "react-bootstrap";

const Navbar = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogin = () => {
        navigate('/login');
    }

    const handleRegister = () => {
        navigate('/register');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" />
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({isActive}) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Почетна
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/about"
                                className={({isActive}) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                За нас
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/tech"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Техничка анализа
                            </NavLink>
                        </li>
                    </ul>
                    <div className="ms-auto d-flex align-items-center">
                        {token && <NavLink to="/profile" className="me-3 text-decoration-none">
                            <FontAwesomeIcon icon={faUser} size="lg" className="text-dark profile-icon" />
                        </NavLink>}
                        {token && <LogoutButton/>}
                        {!token && <Button className={'btn-primary'} onClick={handleLogin}>Најави се</Button>}
                        {!token && <Button className={'btn-dark'} onClick={handleRegister}>Регистрирај се</Button>}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
