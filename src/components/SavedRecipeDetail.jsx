import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, doc, getDocs, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const SavedRecipeDetail = () => {
    const { currentUser } = useAuth();
    const { id } = useParams();
    const recipeId = Number(id);  // {id is a string but we need it to be a number to successfully retrieve is from db}
    const [recipe, setRecipe] = useState(null);
    const [newNotes, setNewNotes] = useState("");
    const [newIngredients, setNewIngredients] = useState([]);
    const [newInstructions, setNewInstructions] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        if (!currentUser || !id) return;

        const fetchRecipe = async () => {
            try {
                // Query Firestore for the recipe where the recipeId field matches the id from the URL
                const recipeQuery = query(
                    collection(db, "users", currentUser.uid, "savedRecipes"),
                    where("id", "==", recipeId) // Looking for a document with the recipeId field matching the URL id
                );
                const querySnapshot = await getDocs(recipeQuery);

                if (!querySnapshot.empty) {
                    const recipeDoc = querySnapshot.docs[0]; // Get the first matched document
                    const data = recipeDoc.data();
                    setRecipe({
                        ...data,
                        docId: recipeDoc.id,  // Store Firestore document ID separately
                    });
                    setNewNotes(data.notes || "");
                    setNewInstructions(data.instructions || "");
                    // Initialize newIngredients as an array of ingredient objects
                    setNewIngredients(data.ingredients || []);
                } else {
                    console.log('No recipe found!');
                    setRecipe(null); // Explicitly set recipe to null if not found
                }
            } catch (error) {
                console.error("Error fetching recipe:", error);
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchRecipe();
    }, [currentUser, id]);


    const saveEdits = async () => {
        if (!currentUser || !recipe) return;

        try {
            const recipeRef = doc(db, "users", currentUser.uid, "savedRecipes", recipe.docId);
            await updateDoc(recipeRef, {
                notes: newNotes,
                instructions: newInstructions,
                ingredients: newIngredients,
            });

            setRecipe(prev => ({
                ...prev,
                notes: newNotes,
                instructions: newInstructions,
                ingredients: newIngredients
            }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    };

    const handleIngredientChange = (index, value) => {
        const updatedIngredients = [...newIngredients];
        updatedIngredients[index] = value; // Update ingredient text
        setNewIngredients(updatedIngredients);
    };

    if (loading) return <p>Loading recipe...</p>;
    if (!recipe) return <p>No recipe found!</p>;

    return (
        <>
            <Navbar />
            <div>
                <h2>{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} style={{ width: "300px" }} />

                <h3>Ingredients:</h3>
                {isEditing ? (
                    <div>
                        {newIngredients.map((ingredient, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    style={{ width: "100%", marginBottom: "5px" }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul>
                        {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                )}

                {isEditing ? (
                    <div>
                        <h4>Edit Instructions</h4>
                        <textarea value={newInstructions} onChange={(e) => setNewInstructions(e.target.value)} />

                        <h4>Add Notes</h4>
                        <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />

                        <button onClick={saveEdits}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <p><strong>Instructions:</strong> {recipe.instructions}</p>
                        <p><strong>Notes:</strong> {recipe.notes}</p>
                        <button onClick={() => setIsEditing(true)}>Edit Recipe</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SavedRecipeDetail;
