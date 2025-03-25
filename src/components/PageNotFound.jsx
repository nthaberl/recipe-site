import React from 'react';
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div className='recipe-container'>
            <h2>No noms here ...</h2>
            <img src="src/assets/images/404_cake.png" alt="sad cake" />
            <p>
                <Link to={`/home`}>Go back home</Link>
            </p>
        </div>
    )
}

export default PageNotFound