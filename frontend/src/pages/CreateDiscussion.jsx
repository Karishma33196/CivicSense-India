import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { discussionsAPI, contentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CreateDiscussion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    contentReference: ''
  });
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await contentAPI.getAll();
      setContentList(response.data.filter(item => item.isApproved));
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const discussionData = {
        ...formData,
        contentReference: formData.contentReference || null
      };

      const response = await discussionsAPI.create(discussionData);
      setMessage('✅ Discussion created successfully!');
      
      setTimeout(() => {
        navigate(`/discussions/${response.data._id}`);
      }, 1500);
    } catch (error) {
      setMessage('❌ Error creating discussion: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>Please login to create a discussion.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
          <h2 style={{ marginBottom: '30px', color: 'var(--primary)' }}>
            Start New Discussion
          </h2>
          
          {message && (
            <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Discussion Title *
              </label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter a clear and descriptive title..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Description *
              </label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Describe what you want to discuss... (You can ask questions, share insights, or start a debate)"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Category *
              </label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="general">General Discussion</option>
                <option value="framework">Constitution Framework</option>
                <option value="fundamental_rights">Fundamental Rights</option>
                <option value="duties">Fundamental Duties</option>
                <option value="articles">Articles Discussion</option>
                <option value="amendments">Amendments</option>
                <option value="other">Other Topics</option>
              </select>
            </div>
            
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Link to Content (Optional)
              </label>
              <select
                name="contentReference"
                className="form-control"
                value={formData.contentReference}
                onChange={handleChange}
              >
                <option value="">Select content to link (optional)</option>
                {contentList.map(content => (
                  <option key={content._id} value={content._id}>
                    {content.title} - by {content.author.name}
                  </option>
                ))}
              </select>
              <small style={{ color: '#666', fontSize: '12px' }}>
                Link this discussion to specific constitutional content for better context
              </small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating Discussion...' : 'Start Discussion'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscussion;