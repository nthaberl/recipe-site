import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    //getting logout function from AuthContext
    const { logout } = useAuth();

    //using NavLink to highlight which route the user is on in Navbar
    const linkClass = ({ isActive }) => isActive ?
        'activenav' : ''

    return (
        <nav>
            <div><h1>nomDB</h1><h5>your personal nom database</h5></div>
            <NavLink to="/home" className={linkClass} aria-label="Go to homepage and view saved recipes">Home</NavLink>
            <NavLink to="/search" className={linkClass}>Search Recipes</NavLink>
            <button onClick={logout} aria-label="Log out of your account">Logout</button>
        </nav>
    );
};

export default Navbar;
