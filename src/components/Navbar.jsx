import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    return (
        <nav>
            <Link to="/home">Collection</Link>
            <Link to="/search">Search Recipes</Link>
            {currentUser ? (
                <>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
