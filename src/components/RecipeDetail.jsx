import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=5186f95df1f54789af41090471577ea4`)
            .then(response => response.json())
            .then(data => setRecipe(data))
            .catch(error => console.error('Error fetching recipe details:', error));
    }, [id]);

    if (!recipe) {
        return <p>Loading recipe details...</p>;
    }

    return (
        <>
            <Navbar />
            <div>
                <h1>{recipe.title}</h1>
                <img src={recipe.image} alt={recipe.title} style={{ width: '100%', maxWidth: '500px' }} />
                <h2>Ingredients:</h2>
                <ul>
                    {recipe.extendedIngredients.map((ingredient) => (
                        <li key={ingredient.id}>{ingredient.original}</li>
                    ))}
                </ul>
                <h2>Instructions:</h2>
                <p dangerouslySetInnerHTML={{ __html: recipe.instructions }}></p>
            </div>
        </>
    );
};

export default RecipeDetails;
