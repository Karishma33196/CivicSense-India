import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentAPI } from '../utils/api';

const CreateContent = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'framework',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

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
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await contentAPI.create({
        ...formData,
        tags: tagsArray
      });
      
      setMessage('Content created successfully! Waiting for admin approval.');
      setFormData({
        title: '',
        content: '',
        category: 'framework',
        tags: ''
      });
      
      setTimeout(() => {
        navigate('/content');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
          <h2 style={{ marginBottom: '30px', color: 'var(--primary)' }}>Create Educational Content</h2>
          
          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="framework">Constitution Framework</option>
                <option value="fundamental_rights">Fundamental Rights</option>
                <option value="duties">Fundamental Duties</option>
                <option value="articles">Articles</option>
                <option value="amendments">Amendments</option>
              </select>
            </div>
            
            <div className="form-group">
              <textarea
                name="content"
                className="form-control"
                placeholder="Content"
                rows="8"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="tags"
                className="form-control"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Content'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;