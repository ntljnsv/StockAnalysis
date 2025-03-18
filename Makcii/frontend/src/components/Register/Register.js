import React, { useState } from 'react';
import { register } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logo from "../../assets/logo.jpg";


const RegisterPage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        repeatedPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.repeatedPassword) {
            setError('Лозинките не се совпаѓаат');
            return;
        }

        try {
            const response = await register(formData.username, formData.password, formData.repeatedPassword);
            if (response) {
                setSuccess('Успешно се регистриравте! Ве пренасочуваме кон страната за најава...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Грешка при регистрирање');
            }
        }
    };

    return (
        <div className={'reg-container'}>
            <div className={'reg-card'}>
                <div className={'reg-img-container'}>
                    <img src={logo} alt="Logo" className={"reg-img"}/>
                </div>
                <h2 className={'reg-form-title'}>Креирајте профил</h2>
                {error && <p className={'reg-error'}>{error}</p>}
                {success && <p className={'reg-success'}>{success}</p>}
                <form onSubmit={handleSubmit} className={'reg-form'}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Корисничко име"
                        value={formData.username}
                        onChange={handleChange}
                        className={'reg-input'}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Лозинка"
                        value={formData.password}
                        onChange={handleChange}
                        className={'reg-input'}
                        required
                    />
                    <input
                        type="password"
                        name="repeatedPassword"
                        placeholder="Повторена лозинка"
                        value={formData.repeatedPassword}
                        onChange={handleChange}
                        className={'reg-input'}
                        required
                    />
                    <button type="submit" className={'reg-button'}>
                        Регистрирај се
                    </button>
                    <p className={"register-reroute"}>Веќе сте регистрирани? <a href={"/login"}>Најавете се!</a></p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
