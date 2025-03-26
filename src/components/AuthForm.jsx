import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true); // tracks whether for is on login or register form
    
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    /**
     * Handles form submission for login and registration.
     * - If on login form, calls login function.
     * - If on registration form, calls signup function.
     * - Navigates to "/home" on successful authentication.
     * - Displays an error message if authentication fails.
     */

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
            //error message for when account already exists
            if (err.code === 'auth/email-already-in-use') {
                setError('Account already exists, please log in.')
            } else {
                setError(isLogin ? 'Failed to log in' : 'Failed to create an account');
            }
        }
    };

    return (
        <div className='auth-page'>
            <div className="auth-container">
                <div className="title">
                    <h1>Welcome to nomDB</h1>
                    <h2>your resource for finding and saving noms!</h2>
                </div>
                <h3>{isLogin ? 'Login' : 'Register'}</h3>
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
        </div>
    );
};

export default AuthForm;
