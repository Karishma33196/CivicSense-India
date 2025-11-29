import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contentAPI } from '../utils/api';

const MyContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyContent();
  }, []);

  const fetchMyContent = async () => {
    try {
      const response = await contentAPI.getAll();
      // Filter content created by current user
      const myContent = response.data.filter(item => item.author?._id === user?._id);
      setContent(myContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await contentAPI.delete(contentId);
        setContent(content.filter(item => item._id !== contentId));
        alert('Content deleted successfully');
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Error deleting content');
      }
    }
  };

  const viewFullContent = (contentItem) => {
    setSelectedContent(contentItem);
    setShowContentModal(true);
  };

  const closeModal = () => {
    setShowContentModal(false);
    setSelectedContent(null);
  };

  if (loading) {
    return <div className="container">Loading your content...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px', color: 'var(--primary)' }}>My Content</h1>

      {/* Content Modal */}
      {showContentModal && selectedContent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: 'var(--primary)', margin: 0 }}>{selectedContent.title}</h2>
              <button onClick={closeModal} style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '24px', 
                cursor: 'pointer',
                color: '#666'
              }}>
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ 
                  color: selectedContent.isApproved ? 'var(--secondary)' : 'var(--danger)',
                  fontWeight: 'bold'
                }}>
                  Status: {selectedContent.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
                <span style={{ color: '#666' }}>
                  Category: {selectedContent.category?.replace('_', ' ')}
                </span>
              </div>
              
              <div style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '8px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedContent.content}
              </div>
              
              {selectedContent.tags && selectedContent.tags.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <strong>Tags: </strong>
                  {selectedContent.tags.map(tag => (
                    <span 
                      key={tag}
                      style={{
                        background: '#e2e8f0',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginRight: '8px',
                        display: 'inline-block',
                        marginTop: '5px'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  deleteContent(selectedContent._id);
                  closeModal();
                }}
                className="btn btn-danger"
              >
                Delete Content
              </button>
              <button onClick={closeModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {content.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#666', marginBottom: '20px' }}>No Content Created Yet</h3>
          <p style={{ marginBottom: '20px' }}>
            You haven't created any content yet. Start by creating educational content about the Indian Constitution.
          </p>
          <a href="/create-content" className="btn btn-primary">
            Create Your First Content
          </a>
        </div>
      ) : (
        <div className="grid grid-2">
          {content.map(item => (
            <div key={item._id} className="card">
              <h3 style={{ color: 'var(--primary)' }}>{item.title}</h3>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ 
                  color: item.isApproved ? 'var(--secondary)' : 'var(--danger)',
                  fontWeight: 'bold'
                }}>
                  {item.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
                </span>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.5'
              }}>
                {item.content}
              </p>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => viewFullContent(item)}
                  className="btn btn-primary"
                >
                  Read Full
                </button>
                <button 
                  onClick={() => deleteContent(item._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContent;