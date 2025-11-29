import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './pages/AdminDashboard';
import Content from './pages/Content';
import CreateContent from './pages/CreateContent';
import MyContent from './pages/MyContent';
import Discussions from './pages/Discussions';
import SingleDiscussion from './pages/SingleDiscussion';
import CreateDiscussion from './pages/CreateDiscussion';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/content" element={<Content />} />
             <Route path="/my-content" element={
              <ProtectedRoute>
                <MyContent />
              </ProtectedRoute>
            } />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-content" 
              element={
                <ProtectedRoute roles={['educator', 'legal_expert']}>
                  <CreateContent />
                </ProtectedRoute>
              } 
            />
             <Route path="/discussions" element={<Discussions />} />
            <Route path="/discussions/:id" element={<SingleDiscussion />} />
            <Route 
              path="/create-discussion" 
              element={
                <ProtectedRoute>
                  <CreateDiscussion />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>

  );
}

export default App;