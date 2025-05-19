import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Product from './pages/Product';
import NotFound from './pages/NotFound';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Product />
              </>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
