import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import RecipeHome from './components/RecipeHome';
import RecipeDetails from './components/RecipeDetail';
import RecipeSearch from './components/RecipeSearch';
import SavedRecipeDetail from "./components/SavedRecipeDetail";
import PageNotFound from './components/PageNotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/home" element={<ProtectedRoute><RecipeHome /></ProtectedRoute>} />
          <Route path="/saved-recipe/:id" element={<SavedRecipeDetail />} />
          <Route path="/search" element={<ProtectedRoute><RecipeSearch /></ProtectedRoute>} />
          <Route path="/search/:id" element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" />;
};

export default App;
