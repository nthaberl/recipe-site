import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import RecipeHome from './components/RecipeHome';
import RecipeDetails from './components/RecipeDetail';
import RecipeSearch from './components/RecipeSearch';
import SavedRecipeDetail from "./components/SavedRecipeDetail";
import PageNotFound from './components/PageNotFound';
import MainLayout from './layout/MainLayout';

const RedirectIfLoggedIn = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if the user is logged in and they are on the home page "/"
    if (currentUser && window.location.pathname === "/") {
      navigate("/home"); // Redirect if logged in and trying to visit the login page
    }
  }, [currentUser, navigate]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Check if user should be redirected */}
        <RedirectIfLoggedIn />
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route element={<MainLayout />}>
            <Route path="/home" element={<ProtectedRoute><RecipeHome /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><RecipeSearch /></ProtectedRoute>} />
            <Route path="/search/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
            <Route path="/saved-recipe/:id" element={<ProtectedRoute><SavedRecipeDetail /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

export default App;
