import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const RecipeSearch = () => {

    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve the search history from sessionStorage
    const searchHistory = JSON.parse(sessionStorage.getItem('searchHistory')) || [];

    const [query, setQuery] = useState(sessionStorage.getItem('searchTerm') || '');
    const [recipes, setRecipes] = useState(JSON.parse(sessionStorage.getItem('searchResults')) || []);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(sessionStorage.getItem('searched') === 'true'); //tracking if search has been made
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore previous search when navigating back
        //location.state retreieves the query and results
        const currentState = location.state;
        if (currentState?.query) {
            setQuery(currentState.query);
            setRecipes(currentState.results);
            setSearched(true);
        }
    }, [location]);


    const searchRecipes = async (e) => {
        e.preventDefault();
        setError(null);
        setSearched(true);

        fetch(
            `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=5186f95df1f54789af41090471577ea4`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                return response.json();
            })
            .then((data) => {
                setRecipes(data.results);
                setLoading(false); // Stop loading once data is received

                // Save new search in history
                const updatedHistory = [...searchHistory, { query, results: data.results }];
                sessionStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

                // Navigate to the same page but with search state
                navigate('/search', { state: { query, results: data.results } });
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false); // Stop loading even if there's an error
            });
    };

    return (
        <>
            <section className='recipe-container'>
                <h2>Search Recipes</h2>
                <form onSubmit={searchRecipes}>
                    <input
                        type="text"
                        placeholder="Search for a recipe..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                        aria-label="Search for recipes"
                    />
                    <button type="submit">Search</button>
                </form>

                {error && <p className="error-message">{error}</p>}

                {/* message while waiting for results */}
                {searched && loading && <p aria-live="polite">Searching for noms</p>}

                {/* Only shows if search terms result in no recipes */}
                {searched && recipes.length === 0 && !error && !loading && (
                    <p aria-live="polite">Sorry, no recipes found. Please try searching for something else.</p>
                )}


                {recipes.length > 0 && (
                    <section className="recipe-results">
                        {recipes.map((recipe, index) => (
                            //using ?? to ensure the key is not null or undefined
                            <div key={recipe.id ?? `recipe-${index}`} className="recipe-item">
                                <h3>{recipe.title}</h3>
                                <Link to={`/search/${recipe.id}`} aria-label={`View details for ${recipe.title}`}>
                                    <img src={recipe.image} alt={recipe.title} />
                                </Link>
                            </div>
                        ))}
                    </section>
                )}
            </section>
        </>
    );
};

export default RecipeSearch;
