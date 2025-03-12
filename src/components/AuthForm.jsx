import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/home'); // Redirect to the recipe list after login/register
        } catch (err) {
            setError(isLogin ? 'Failed to log in' : 'Failed to create an account');
        }
    };

    return (
        <div className="auth-container">
            <h2><span style ={{color: 'black'}}>{isLogin ? 'Login' : 'Register'}</span></h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
        </div>
    );
};

export default AuthForm;
