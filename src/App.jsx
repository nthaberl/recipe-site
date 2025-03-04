import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import RecipeHome from './components/RecipeHome';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <RecipeHome />
              </ProtectedRoute>
            }
          />

          {/* later implement a 404 here */}
          {/* <Route path="*" element={<Navigate to="/auth" />} /> */}
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
