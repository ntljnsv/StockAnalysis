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
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Не валидно корисничко име или лозинка');
        }
    };

    return (
        <div className={'container'} >
            <div className={'card'} >
                <div className={'img-container'}>
                    <img src={logo} alt="Logo"/>
                </div>
                <h2 className={'form-title'} >Најавете се</h2>
                {error && <p className={'error'} >{error}</p>}
                <form onSubmit={handleSubmit} className={'form'} >
                    <input
                        type="text"
                        placeholder="Корисничко име"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={'input'}
                    />
                    <input
                        type="password"
                        placeholder="Лозинка"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={'input'}
                    />
                    <button
                        type="submit"
                        className={`button ${error ? 'button-error' : ''}`}
                    >
                        Најави се
                    </button>
                </form>
            </div>
        </div>
    );
};



export default Login;
