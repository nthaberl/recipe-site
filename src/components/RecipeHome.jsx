import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


const RecipeHome = () => {
    const { currentUser } = useAuth();
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchSavedRecipes = async () => {
            try {
                //get all saved recipes for the current user from Firestore
                const querySnapshot = await getDocs(collection(db, "users", currentUser.uid, "savedRecipes"));

                //map Firestore documents to an array of recipe objects
                const recipes = querySnapshot.docs.map(doc => ({
                    id: doc.id, //firestore doc ID
                    ...doc.data() //spreading the rest of the recipe data
                }));
                setSavedRecipes(recipes); //updating state with fetched recipes
            } catch (error) {
                console.error("Error fetching saved recipes:", error);
            }
        };

        fetchSavedRecipes();
    }, [currentUser]);

    return (
        <>
            <section className="recipe-container">
                <h2>Your Saved Noms</h2>
                {savedRecipes.length === 0 ? (
                    <p>No noms here. Search for some noms to save here!</p>
                ) : (
                    <div className="recipe-list">
                        {savedRecipes.map(recipe => (
                            <div key={recipe.id} className="recipe-item">
                                <h3>{recipe.title}</h3>
                                <Link to={`/saved-recipe/${recipe.id}`} aria-label={`View details for ${recipe.title}`}>
                                    <img src={recipe.image} alt={recipe.title} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};

export default RecipeHome;
