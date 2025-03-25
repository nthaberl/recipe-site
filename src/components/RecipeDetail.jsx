import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";


const RecipeDetails = () => {

    const { id } = useParams();
    const { currentUser } = useAuth(); // Get the logged-in user
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

    // Helper function to check if instructions from Spoonacular contain HTML <li> tags
    const containsHTMLTags = (str) => /<\/?li>/i.test(str);

    // Parse instructions into an array of strings based on <li> tags
    const parseInstructions = (instructions) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(instructions, 'text/html');
        const liElements = htmlDoc.querySelectorAll('li');
        return Array.from(liElements).map(li => li.textContent);  // Extract text content of each <li>
    };

    // Process instructions to handle both HTML tags and plain text
    const processInstructions = (instructions) => {
        if (containsHTMLTags(instructions)) {
            // Parse instructions based on <li> tags if present
            return parseInstructions(instructions);
        } else {
            // Otherwise, split instructions into sentences (assuming period and space as sentence delimiters)
            return instructions.split(/(?<=\.)\s+/);
        }
    };

    const saveRecipe = () => {
        if (!currentUser) {
            alert("Please log in to save recipes.");
            return;
        }
    
        const savedRecipesRef = collection(db, "users", currentUser.uid, "savedRecipes");
    
        // Check if the recipe is already saved
        const existingRecipeQuery = query(savedRecipesRef, where("id", "==", recipe.id));
    
        getDocs(existingRecipeQuery)
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    alert("This recipe is already saved in your collection.");
                    return Promise.reject("Recipe already exists"); // Stop execution
                }
    
                // Parse instructions into an array of strings before saving
                const parsedInstructions = processInstructions(recipe.instructions || "");
    
                // Save the recipe
                return addDoc(savedRecipesRef, {
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    ingredients: recipe.extendedIngredients.map(ing => ing.original),
                    instructions: parsedInstructions,
                    notes: "",
                    createdAt: new Date(),
                });
            })
            .then(() => {
                alert("Recipe saved successfully!");
            })
            .catch(error => {
                if (error !== "Recipe already exists") {
                    console.error("Error saving recipe:", error);
                }
            });
    };

    return (
        <>
            <Navbar />
            <div className="unsaved-recipe-detail-container">
                <h1>{recipe.title}</h1>
                <img src={recipe.image} alt={recipe.title}/>
                {/*  style={{ width: '100%', maxWidth: '500px' }}  */}
                <h2>Ingredients:</h2>
                <ul>
                    {recipe.extendedIngredients.map((ingredient) => (
                        <li key={ingredient.id}>{ingredient.original}</li>
                    ))}
                </ul>
                <h2>Instructions:</h2>
                {/* Display instructions */}
                <ol>
                    {processInstructions(recipe.instructions).map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                    ))}
                </ol>
                <button onClick={saveRecipe}>Save to Collection</button>
            </div>
        </>
    );
};

export default RecipeDetails;
