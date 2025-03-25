import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const RecipeHome = () => {
    const { currentUser } = useAuth();
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchSavedRecipes = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users", currentUser.uid, "savedRecipes"));
                const recipes = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSavedRecipes(recipes);
            } catch (error) {
                console.error("Error fetching saved recipes:", error);
            }
        };

        fetchSavedRecipes();
    }, [currentUser]);

    return (
        <>
            <Navbar />
            <div className="recipe-container">
                <h2>Your Saved Recipes</h2>
                {savedRecipes.length === 0 ? (
                    <p>No saved recipes yet.</p>
                ) : (
                    <div className="recipe-list">
                        {savedRecipes.map(recipe => (
                            <div key={recipe.id} className="recipe-item">
                                <h3>{recipe.title}</h3>
                                <Link to={`/saved-recipe/${recipe.id}`}>
                                    <img src={recipe.image} alt={recipe.title} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default RecipeHome;
