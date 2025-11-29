import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            🇮🇳 Constitution Platform
          </Link>
          
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/content" className="nav-link">Content</Link>
            <Link to="/discussions" className="nav-link">Discussions</Link>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link">Admin Dashboard</Link>
                )}
                {(user.role === 'educator' || user.role === 'legal_expert') && (
                  <Link to="/create-content" className="nav-link">Create Content</Link>
                )}
                {user && (user.role === 'educator' || user.role === 'legal_expert') && (
  <>
  
    <Link to="/my-content" className="nav-link">My Content</Link>
  </>
)}
                <span className="nav-link">
                  Welcome, {user.name} 
                  <span className={`role-badge role-${user.role}`} style={{marginLeft: '8px'}}>
                    {user.role.replace('_', ' ')}
                  </span>
                </span>
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;