import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const WriteBlog = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    image: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newPost = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      excerpt: formData.content.substring(0, 150) + '...',
      tags: formData.tags.split(',').map(tag => tag.trim()),
      image: formData.image,
      authors: [user.avatar],
      author: user.name,
      authorId: user.id,
      date: new Date().toLocaleDateString(),
      comments: []
    }
    
    const existingPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    existingPosts.unshift(newPost)
    localStorage.setItem('userPosts', JSON.stringify(existingPosts))
    
    navigate('/')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({...formData, image: e.target.result})
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="modern-write-page">
      <div className="write-header">
        <div className="write-header-container">
          <div className="user-info">
            <img src={user.avatar} alt={user.name} className="user-avatar-small" />
            <span>{user.name}</span>
          </div>
          <div className="header-actions">
            <button type="button" onClick={() => navigate('/')} className="btn-text">Cancel</button>
            <button onClick={handleSubmit} className="btn-publish">Publish</button>
          </div>
        </div>
      </div>

      <div className="write-container">
        {!formData.image ? (
          <div className="cover-upload">
            <div className="upload-placeholder">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Add a cover image to your article</p>
              <label className="upload-btn">
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                Upload from computer
              </label>
            </div>
          </div>
        ) : (
          <div className="cover-preview">
            <img src={formData.image} alt="Cover" />
            <button className="remove-cover" onClick={() => setFormData({...formData, image: ''})}>
              ×
            </button>
          </div>
        )}

        <div className="editor-content">
          <textarea
            className="title-input"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            rows="1"
          />
          
          <textarea
            className="content-input"
            placeholder="Write here. You can paste formatted text and it will preserve formatting."
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />
          
          <input
            className="tags-input"
            placeholder="Add tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
          />
        </div>
      </div>
    </div>
  )
}

export default WriteBlog