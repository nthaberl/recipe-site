import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const RecipeSearch = () => {
    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false); //tracking whether search has been made

    // const API_KEY = process.env.API_KEY; // Use environment variable

    const searchRecipes = async (e) => {
        e.preventDefault();
        setError(null);
        setSearched(true);

        fetch(
            `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=5186f95df1f54789af41090471577ea4`
            // `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${API_KEY}`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                return response.json();
            })
            .then((data) => {
                setRecipes(data.results);
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    return (
        <>
        <Navbar />
        <div>
            <h2>Search Recipes</h2>
            <form onSubmit={searchRecipes}>
                <input
                    type="text"
                    placeholder="Search for a recipe..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {/* Only shows if search terms result in no recipes */}
            {searched && recipes.length === 0 && !error && (
                <p className="no-results">Sorry, no recipes found. Please try searching for something else.</p>
            )}

            <div className="recipe-results">
                {recipes.length > 0 && recipes.map((recipe, index) => (
                    <div key={recipe.id ?? `recipe-${index}`} className="recipe-item">
                        <h3>{recipe.title}</h3>
                        <Link to={`/search/${recipe.id}`}>
                            <img src={recipe.image} alt={recipe.title} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default RecipeSearch;
