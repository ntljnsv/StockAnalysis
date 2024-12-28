import React, { useState } from 'react';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            if (response) {
                navigate('/');
            }
        } catch (err) {
            setError('Не валидно корисничко име или лозинка');
        }
    };

    return (
        <div className={'login-container'} >
            <div className={'login-card'} >
                <div className={'login-img-container'}>
                    <img src={logo} alt="Logo" className={"login-img"}/>
                </div>
                <h2 className={'login-form-title'} >Најавете се</h2>
                {error && <p className={'login-error'} >{error}</p>}
                <form onSubmit={handleSubmit} className={'login-form'} >
                    <input
                        type="text"
                        placeholder="Корисничко име"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={'login-input'}
                    />
                    <input
                        type="password"
                        placeholder="Лозинка"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={'login-input'}
                    />
                    <button
                        type="submit"
                        className={`login-button ${error ? 'login-button-error' : ''}`}
                    >
                        Најави се
                    </button>
                    <p className={"login-reroute"}>Немате профил? <a href={"/register"}>Регистрирајте се!</a></p>
                </form>
            </div>
        </div>
    );
};



export default Login;
