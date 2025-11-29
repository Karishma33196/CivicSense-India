import React, { useState, useEffect } from 'react';
import { usersAPI, contentAPI, discussionsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'content', 'discussions'
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, contentResponse, discussionsResponse] = await Promise.all([
        usersAPI.getAll(),
        contentAPI.getAll(),
        discussionsAPI.getAll(1, 50) // Get first 50 discussions
      ]);
      setUsers(usersResponse.data);
      setContent(contentResponse.data);
      setDiscussions(discussionsResponse.data.discussions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(userId);
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const approveContent = async (contentId) => {
    try {
      await contentAPI.approve(contentId);
      setContent(content.map(item => 
        item._id === contentId ? { ...item, isApproved: true } : item
      ));
      alert('Content approved successfully');
    } catch (error) {
      console.error('Error approving content:', error);
      alert('Error approving content');
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

  const deleteDiscussion = async (discussionId) => {
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      try {
        await discussionsAPI.delete(discussionId);
        setDiscussions(discussions.filter(discussion => discussion._id !== discussionId));
        alert('Discussion deleted successfully');
      } catch (error) {
        console.error('Error deleting discussion:', error);
        alert('Error deleting discussion');
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
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px', color: 'var(--primary)' }}>Admin Dashboard</h1>
      
      {/* Current User Info */}
      <div className="card" style={{ background: '#e3f2fd', marginBottom: '20px' }}>
        <h3>Welcome, {currentUser?.name}!</h3>
        <p>You are logged in as <span className={`role-badge role-${currentUser?.role}`}>{currentUser?.role}</span></p>
        <p style={{ fontSize: '14px', color: '#666' }}>Email: {currentUser?.email}</p>
      </div>

      {/* Navigation Tabs */}
      {currentUser?.role === 'admin' && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: activeTab === 'users' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'users' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : 'none'
              }}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('content')}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: activeTab === 'content' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'content' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'content' ? '2px solid var(--primary)' : 'none'
              }}
            >
              Content ({content.length})
            </button>
            <button
              onClick={() => setActiveTab('discussions')}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: activeTab === 'discussions' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'discussions' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'discussions' ? '2px solid var(--primary)' : 'none'
              }}
            >
              Discussions ({discussions.length})
            </button>
          </div>
        </div>
      )}
      
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
                <span className={`role-badge role-${selectedContent.author?.role}`}>
                  {selectedContent.author?.role?.replace('_', ' ') || 'Unknown'}
                </span>
                <span style={{ color: '#666' }}>
                  by {selectedContent.author?.name || 'Unknown'}
                </span>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Category: {selectedContent.category?.replace('_', ' ') || 'Unknown'}
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
              {(currentUser?.role === 'admin' || currentUser?._id === selectedContent.author?._id) && (
                <button 
                  onClick={() => {
                    deleteContent(selectedContent._id);
                    closeModal();
                  }}
                  className="btn btn-danger"
                >
                  Delete Content
                </button>
              )}
              {currentUser?.role === 'admin' && !selectedContent.isApproved && (
                <button 
                  onClick={() => {
                    approveContent(selectedContent._id);
                    closeModal();
                  }}
                  className="btn btn-secondary"
                >
                  Approve Content
                </button>
              )}
              <button onClick={closeModal} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && currentUser?.role === 'admin' && (
        <div className="card">
          <h3>User Management ({users.length} users)</h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {users.map(user => (
              <div key={user._id} style={{ 
                padding: '15px', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                marginBottom: '10px',
                background: user._id === currentUser?._id ? '#f0f8ff' : 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>
                      {user.name} 
                      {user._id === currentUser?._id && (
                        <span style={{ color: 'var(--primary)', marginLeft: '8px', fontSize: '12px' }}>
                          (You)
                        </span>
                      )}
                    </strong>
                    <span className={`role-badge role-${user.role}`} style={{ marginLeft: '10px' }}>
                      {user.role.replace('_', ' ')}
                    </span>
                    <div style={{ color: '#666', fontSize: '14px' }}>{user.email}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Show delete button only for non-admin users AND not the current user */}
                  {user.role !== 'admin' && user._id !== currentUser?._id && (
                    <button 
                      onClick={() => deleteUser(user._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  )}
                  
                  {/* Show message for current user or other admins */}
                  {(user.role === 'admin' || user._id === currentUser?._id) && (
                    <span style={{ 
                      color: '#666', 
                      fontSize: '12px', 
                      fontStyle: 'italic',
                      padding: '8px 12px'
                    }}>
                      Protected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="card">
          <h3>
            {currentUser?.role === 'admin' ? 'Content Moderation' : 'My Content'} 
            ({content.length})
          </h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {content.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No content found
              </div>
            ) : (
              content.map(item => (
                <div key={item._id} style={{ 
                  padding: '15px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span className={`role-badge role-${item.author?.role}`}>
                          {item.author?.role?.replace('_', ' ') || 'Unknown'}
                        </span>
                        <span style={{ color: '#666', fontSize: '14px' }}>
                          by {item.author?.name || 'Unknown'}
                        </span>
                        <span style={{ 
                          color: item.isApproved ? 'var(--secondary)' : 'var(--danger)',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}>
                          {item.isApproved ? '✓ Approved' : '⏳ Pending'}
                        </span>
                      </div>
                      <p style={{ 
                        color: '#666', 
                        fontSize: '14px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <button 
                      onClick={() => viewFullContent(item)}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Read Full Content
                    </button>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {/* Show delete button for admin OR content author */}
                      {(currentUser?.role === 'admin' || currentUser?._id === item.author?._id) && (
                        <button 
                          onClick={() => deleteContent(item._id)}
                          className="btn btn-danger"
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          Delete
                        </button>
                      )}
                      {/* Show approve button only for admin and only for unapproved content */}
                      {currentUser?.role === 'admin' && !item.isApproved && (
                        <button 
                          onClick={() => approveContent(item._id)}
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Discussions Tab */}
      {activeTab === 'discussions' && (
        <div className="card">
          <h3>Discussions Management ({discussions.length} discussions)</h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {discussions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No discussions found
              </div>
            ) : (
              discussions.map(discussion => (
                <div key={discussion._id} style={{ 
                  padding: '15px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Link 
                        to={`/discussions/${discussion._id}`} 
                        style={{ textDecoration: 'none' }}
                      >
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>
                          {discussion.title}
                        </h4>
                      </Link>
                      
                      <p style={{ 
                        color: '#666', 
                        fontSize: '14px',
                        marginBottom: '10px'
                      }}>
                        {discussion.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`role-badge role-${discussion.author?.role}`}>
                            {discussion.author?.role?.replace('_', ' ') || 'Unknown'}
                          </span>
                          <span style={{ color: '#666', fontSize: '14px' }}>
                            by {discussion.author?.name || 'Unknown'}
                          </span>
                        </div>

                        <span className="role-badge" style={{ background: '#e2e8f0', color: '#4a5568' }}>
                          {discussion.category?.replace('_', ' ') || 'general'}
                        </span>

                        <span style={{ color: '#666', fontSize: '14px' }}>
                          💬 {discussion.replies?.length || 0} replies
                        </span>

                        <span style={{ color: '#666', fontSize: '14px' }}>
                          👥 {discussion.participants?.length || 0} participants
                        </span>

                        <span style={{ color: '#666', fontSize: '14px' }}>
                          ⏰ {formatTime(discussion.updatedAt)}
                        </span>
                      </div>

                      {discussion.contentReference && (
                        <div style={{ 
                          background: '#c6f6d5', 
                          padding: '8px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          display: 'inline-block'
                        }}>
                          📚 Linked to: {discussion.contentReference?.title}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <Link 
                      to={`/discussions/${discussion._id}`}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none' }}
                    >
                      View Discussion
                    </Link>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {/* Show delete button for admin OR discussion author */}
                      {(currentUser?.role === 'admin' || currentUser?._id === discussion.author?._id) && (
                        <button 
                          onClick={() => deleteDiscussion(discussion._id)}
                          className="btn btn-danger"
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Statistics Card for Admin */}
      {currentUser?.role === 'admin' && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Platform Statistics</h3>
          <div className="grid grid-5">
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--primary)' }}>{users.length}</h4>
              <p>Total Users</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--secondary)' }}>{users.filter(u => u.role !== 'admin').length}</h4>
              <p>Regular Users</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--accent)' }}>{content.length}</h4>
              <p>Total Content</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: '#06d6a0' }}>{discussions.length}</h4>
              <p>Discussions</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: '#ff6b6b' }}>
                {content.filter(item => item.isApproved).length}
              </h4>
              <p>Approved Content</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;