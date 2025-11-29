import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { discussionsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetchDiscussions();
  }, [currentPage]);

  const fetchDiscussions = async () => {
    try {
      const response = await discussionsAPI.getAll(currentPage);
      setDiscussions(response.data.discussions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Loading Discussions...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0 }}>Community Discussions</h1>
        {user && (
          <Link to="/create-discussion" className="btn btn-primary">
            Start New Discussion
          </Link>
        )}
      </div>

      {!user && (
        <div className="card" style={{ background: '#fff3cd', marginBottom: '20px' }}>
          <p style={{ margin: 0, textAlign: 'center' }}>
            <strong>Please login to participate in discussions</strong>
          </p>
        </div>
      )}

      {discussions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#666', marginBottom: '20px' }}>No Discussions Yet</h3>
          <p style={{ marginBottom: '20px' }}>
            Be the first to start a discussion about the Indian Constitution!
          </p>
          {user && (
            <Link to="/create-discussion" className="btn btn-primary">
              Start First Discussion
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-1">
            {discussions.map(discussion => (
              <div key={discussion._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Link 
                      to={`/discussions/${discussion._id}`} 
                      style={{ textDecoration: 'none' }}
                    >
                      <h3 style={{ color: 'var(--primary)', margin: '0 0 10px 0' }}>
                        {discussion.title}
                      </h3>
                    </Link>
                    
                    <p style={{ color: '#666', marginBottom: '15px' }}>
                      {discussion.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`role-badge role-${discussion.author.role}`}>
                          {discussion.author.role.replace('_', ' ')}
                        </span>
                        <span style={{ color: '#666', fontSize: '14px' }}>
                          by {discussion.author.name}
                        </span>
                      </div>

                      <span className="role-badge" style={{ background: '#e2e8f0', color: '#4a5568' }}>
                        {discussion.category.replace('_', ' ')}
                      </span>

                      {discussion.contentReference && (
                        <span style={{ 
                          background: '#c6f6d5', 
                          color: '#276749',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          📚 {discussion.contentReference.title}
                        </span>
                      )}

                      <span style={{ color: '#666', fontSize: '14px' }}>
                        💬 {discussion.replies.length} replies
                      </span>

                      <span style={{ color: '#666', fontSize: '14px' }}>
                        👥 {discussion.participants.length} participants
                      </span>

                      <span style={{ color: '#666', fontSize: '14px' }}>
                        ⏰ {formatTime(discussion.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-primary"
              >
                Previous
              </button>
              
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 15px',
                background: '#f7fafc',
                borderRadius: '8px'
              }}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-primary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Discussions;