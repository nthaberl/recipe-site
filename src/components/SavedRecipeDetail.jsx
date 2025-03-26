import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const SavedRecipeDetail = () => {
    const { currentUser } = useAuth();
    const { id } = useParams();
    const recipeId = Number(id);  // {id is a string but we need it to be a number to successfully retrieve from db}
    const [recipe, setRecipe] = useState(null);
    const [newNotes, setNewNotes] = useState("");
    const [newIngredients, setNewIngredients] = useState([]);
    const [newInstructions, setNewInstructions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || !id) return;

        //retrieve recipe
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
                    // Initialize newIngredients and newInstructions as as an array of strings
                    setNewInstructions(data.instructions || []);
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

    //update recipe
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

    //delete recipe
    const deleteRecipe = async () => {
        if (!currentUser || !recipe) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return; //stop delete if user cancels

        try {
            const recipeRef = doc(db, "users", currentUser.uid, "savedRecipes", recipe.docId);
            await deleteDoc(recipeRef); //delete recipe from db
            // Redirect the user or update state as needed
            navigate("/home");
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };


    //add/edit/delete ingredients
    const handleIngredientChange = (index, value) => {
        const updatedIngredients = [...newIngredients];
        updatedIngredients[index] = value; // Update ingredient text
        setNewIngredients(updatedIngredients);
    };

    // Add a new ingredient
    const addIngredient = () => {
        setNewIngredients([...newIngredients, ""]);
    };

    // Delete an ingredient
    const deleteIngredient = (index) => {
        const updatedIngredients = newIngredients.filter((_, i) => i !== index);
        setNewIngredients(updatedIngredients);
    };

    //add/edit/delete instructions

    const handleInstructionChange = (index, value) => {
        const updatedInstructions = [...newInstructions];
        updatedInstructions[index] = value; // Update instruction text
        setNewInstructions(updatedInstructions);
    };

    // Add a new instruction step
    const addInstruction = () => {
        setNewInstructions([...newInstructions, ""]);
    };

    // Delete an instruction step
    const deleteInstruction = (index) => {
        const updatedInstructions = newInstructions.filter((_, i) => i !== index);
        setNewInstructions(updatedInstructions);
    };

    if (loading) return <p>Loading recipe...</p>;
    if (!recipe) return <p>No recipe found!</p>;

    return (
        <>
            <div className="recipe-detail-container">
                <h2>{recipe.title}</h2>
                <img src={recipe.image} alt={`Image of ${recipe.title}`} />

                <h3>Ingredients:</h3>
                {isEditing ? (
                    <div>
                        {newIngredients.map((ingredient, index) => (
                            <div className="recipe-inputs" key={index}>
                                <input
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                />
                                <button onClick={() => deleteIngredient(index)} aria-label="remove ingredient">x</button>
                            </div>
                        ))}
                        <button onClick={addIngredient}>Add Ingredient</button>
                    </div>
                ) : (
                    <ul>
                        {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                )}

                <h3>Instructions:</h3>
                {isEditing ? (
                    <div>
                        {/* Display instructions as a numbered list with editable fields */}
                        {newInstructions.map((instruction, index) => (
                            <div className="recipe-inputs" key={index}>
                                <label>{index + 1}:</label>
                                <input
                                    type="text"
                                    value={instruction}
                                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                                />
                                <button onClick={() => deleteInstruction(index)} aria-label="remove recipe step"> X </button>
                            </div>
                        ))}
                        <button onClick={addInstruction}>Add Step</button>
                    </div>
                ) : (
                    <ol>
                        {recipe.instructions && recipe.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                )}

                {isEditing ? (
                    <>
                        <div>
                            <h4>Notes</h4>
                            <textarea value={newNotes} rows="8" cols="50" onChange={(e) => setNewNotes(e.target.value)} />

                        </div>
                        <div>

                            <button onClick={saveEdits}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </>
                ) : (
                    <div>
                        <p><strong>Notes:</strong> {recipe.notes}</p>

                        <button onClick={() => setIsEditing(true)}>Edit Recipe</button>
                        <button
                            onClick={deleteRecipe}
                            style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}>
                            Delete Recipe
                        </button>
                    </div>
                )}
            </div >
        </>
    );
};

export default SavedRecipeDetail;
