import React, { useState, useEffect } from 'react';
import { contentAPI } from '../utils/api';

const Content = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await contentAPI.getAll();
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const addSampleContent = async () => {
    try {
      const response = await fetch('http://localhost:5312/api/sample/sample-content', {
        method: 'POST'
      });
      const data = await response.json();
      if (response.ok) {
        alert('Sample content added successfully!');
        fetchContent(); // Refresh the content
      } else {
        alert('Error adding sample content: ' + data.message);
      }
    } catch (error) {
      alert('Error adding sample content');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Loading Content...</h2>
          <p>Please wait while we fetch the constitutional content.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--danger)' }}>Error</h2>
          <p>{error}</p>
          <button onClick={fetchContent} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const approvedContent = content.filter(item => item.isApproved);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0 }}>Constitutional Content</h1>
        {approvedContent.length === 0 && (
          <button onClick={addSampleContent} className="btn btn-secondary">
            Add Sample Content
          </button>
        )}
      </div>

      {approvedContent.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#666', marginBottom: '20px' }}>No Content Available</h3>
          <p style={{ marginBottom: '20px' }}>
            There is no approved content available yet. You can add sample content to get started.
          </p>
          <button onClick={addSampleContent} className="btn btn-primary">
            Add Sample Content
          </button>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            Or wait for educators and legal experts to create content (requires admin approval).
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {approvedContent.map(item => (
            <div key={item._id} className="card">
              <h3 style={{ color: 'var(--primary)' }}>{item.title}</h3>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span className={`role-badge role-${item.author?.role || 'citizen'}`}>
                  {(item.author?.role || 'citizen').replace('_', ' ')}
                </span>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  by {item.author?.name || 'Unknown'}
                </span>
              </div>
              <p style={{ lineHeight: '1.6' }}>{item.content}</p>
              <div style={{ marginTop: '15px' }}>
                {item.tags && item.tags.map(tag => (
                  <span 
                    key={tag}
                    style={{
                      background: '#e2e8f0',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginRight: '8px',
                      marginBottom: '8px',
                      display: 'inline-block'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Content;