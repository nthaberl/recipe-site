import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    //using NavLink to highlight which route the user is on
    const linkClass = ({isActive}) => isActive ? 
    'activenav' : ''

    return (
        <nav>
            <div><h1>nomDB</h1><h5>your personal nom database</h5></div>
            <NavLink to="/home" className={linkClass} aria-label="Go to homepage and view saved recipes">Home</NavLink>
            <NavLink to="/search" className={linkClass}>Search Recipes</NavLink>
            {currentUser ? (
                <>
                    <button onClick={logout} aria-label="Log out of your account">Logout</button>
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
