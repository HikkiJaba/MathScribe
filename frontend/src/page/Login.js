import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // Состояние для переключения между входом и регистрацией
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                navigate('/'); // Перенаправляем на dashboard после успешного входа
            } else {
                setError(data.msg || 'Ошибка авторизации');
            }
        } catch (err) {
            setError('Ошибка подключения к серверу');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setError(''); // Убираем ошибки
                navigate('/'); // Перенаправляем на главную страницу
            } else {
                setError(data.msg || 'Ошибка регистрации');
            }
        } catch (err) {
            setError('Ошибка подключения к серверу');
        }
    };

    return (
        <div className="login-container">
            <h2>{isRegistering ? 'Регистрация' : 'Вход в систему'}</h2>

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="form-container">
                <div className="form-group">
                    <label htmlFor="username">Имя пользователя</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" className="submit-btn">
                    {isRegistering ? 'Зарегистрироваться' : 'Войти'}
                </button>
            </form>

            <div className="toggle-link">
                {isRegistering ? (
                    <p>Уже есть аккаунт? <span onClick={() => setIsRegistering(false)} className="toggle-btn">Войти</span></p>
                ) : (
                    <p>Нет аккаунта? <span onClick={() => setIsRegistering(true)} className="toggle-btn">Зарегистрироваться</span></p>
                )}
            </div>
        </div>
    );
}

export default Login;
