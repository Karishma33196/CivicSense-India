import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { discussionsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SingleDiscussion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [discussion?.replies]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchDiscussion = async () => {
    try {
      const response = await discussionsAPI.getById(id);
      setDiscussion(response.data);
    } catch (error) {
      console.error('Error fetching discussion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const response = await discussionsAPI.addReply(id, newMessage);
      setDiscussion(response.data);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Loading Discussion...</h2>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Discussion Not Found</h2>
          <p>The discussion you're looking for doesn't exist.</p>
          <Link to="/discussions" className="btn btn-primary">
            Back to Discussions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Discussion Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Link to="/discussions" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                ← Back to Discussions
              </Link>
            </div>
            
            <h1 style={{ color: 'var(--primary)', margin: '0 0 10px 0' }}>
              {discussion.title}
            </h1>
            
            <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
              {discussion.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`role-badge role-${discussion.author.role}`}>
                  {discussion.author.role.replace('_', ' ')}
                </span>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Started by {discussion.author.name}
                </span>
              </div>

              <span className="role-badge" style={{ background: '#e2e8f0', color: '#4a5568' }}>
                {discussion.category.replace('_', ' ')}
              </span>

              {discussion.contentReference && (
                <Link 
                  to={`/content`} 
                  style={{ 
                    background: '#c6f6d5', 
                    color: '#276749',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  📚 Related: {discussion.contentReference.title}
                </Link>
              )}

              <span style={{ color: '#666', fontSize: '14px' }}>
                👥 {discussion.participants.length} participants
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ 
          height: '500px', 
          overflowY: 'auto', 
          padding: '20px',
          background: '#f8f9fa'
        }}>
          {discussion.replies.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              <h3>No messages yet</h3>
              <p>Be the first to contribute to this discussion!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {discussion.replies.map((reply, index) => {
                const showDate = index === 0 || 
                  formatDate(discussion.replies[index - 1].createdAt) !== formatDate(reply.createdAt);
                
                return (
                  <div key={reply._id}>
                    {/* Date Separator */}
                    {showDate && (
                      <div style={{ 
                        textAlign: 'center', 
                        margin: '15px 0',
                        color: '#666',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {formatDate(reply.createdAt)}
                      </div>
                    )}

                    {/* Message */}
                    <div style={{ 
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: reply.user.role === 'admin' ? 'var(--primary)' : 
                                   reply.user.role === 'educator' ? 'var(--secondary)' : 
                                   reply.user.role === 'legal_expert' ? 'var(--accent)' : '#a0aec0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        flexShrink: 0
                      }}>
                        {reply.user.name.charAt(0).toUpperCase()}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                          <strong style={{ color: '#2d3748' }}>{reply.user.name}</strong>
                          <span className={`role-badge role-${reply.user.role}`} style={{ fontSize: '10px' }}>
                            {reply.user.role.replace('_', ' ')}
                          </span>
                          <span style={{ color: '#718096', fontSize: '12px' }}>
                            {formatTime(reply.createdAt)}
                          </span>
                        </div>
                        
                        <div style={{
                          background: 'white',
                          padding: '12px 15px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {reply.message}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        {user ? (
          <div style={{ 
            borderTop: '1px solid #e2e8f0', 
            padding: '20px',
            background: 'white'
          }}>
            <form onSubmit={handleSendMessage}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: '12px 15px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  disabled={sending}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ 
            borderTop: '1px solid #e2e8f0', 
            padding: '20px',
            background: '#fff3cd',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>
              Please <Link to="/login">login</Link> to participate in this discussion
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleDiscussion;