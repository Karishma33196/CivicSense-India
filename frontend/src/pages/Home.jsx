import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Indian Constitution Education Platform</h1>
          <p>Learn about the framework, fundamental rights, and duties of Indian citizens</p>
          {!user && (
            <div style={{ marginTop: '30px' }}>
              <Link to="/register" className="btn btn-primary" style={{ marginRight: '15px' }}>
                Get Started
              </Link>
              <Link to="/content" className="btn btn-accent">
                Explore Content
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="container">
        <div className="grid grid-3">
          <div className="card">
            <h3 style={{ color: 'var(--primary)' }}>📚 Constitution Framework</h3>
            <p>Understand the structure and principles of the Indian Constitution, including the Preamble and key articles.</p>
          </div>
          
          <div className="card">
            <h3 style={{ color: 'var(--secondary)' }}>⚖️ Fundamental Rights</h3>
            <p>Learn about the six fundamental rights guaranteed to every Indian citizen under Part III of the Constitution.</p>
          </div>
          
          <div className="card">
            <h3 style={{ color: 'var(--accent)' }}>🎯 Fundamental Duties</h3>
            <p>Discover the eleven fundamental duties of citizens as outlined in Article 51A of the Constitution.</p>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: '40px' }}>
          <div className="card">
            <h3>For Educators</h3>
            <p>Create educational content, conduct sessions, and share insights about constitutional provisions.</p>
            {!user && <Link to="/register" className="btn btn-secondary">Register as Educator</Link>}
          </div>
          
          <div className="card">
            <h3>For Legal Experts</h3>
            <p>Provide legal insights, update constitutional interpretations, and guide discussions.</p>
            {!user && <Link to="/register" className="btn btn-accent">Register as Legal Expert</Link>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;