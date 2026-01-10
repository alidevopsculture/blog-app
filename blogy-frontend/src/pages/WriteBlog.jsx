import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const WriteBlog = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (e.target.name === 'content') {
      setCursorPosition(e.target.selectionStart)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text')
    const cleanText = paste.replace(/\s+/g, ' ').trim()
    const textarea = e.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = formData.content.substring(0, start) + cleanText + formData.content.substring(end)
    setFormData({...formData, content: newContent})
  }

  const insertImage = () => {
    const imageUrl = prompt('Enter image URL:')
    if (imageUrl) {
      const textarea = document.querySelector('textarea[name="content"]')
      const start = textarea.selectionStart
      const imageTag = `\n\n[IMAGE: ${imageUrl}]\n\n`
      const newContent = formData.content.substring(0, start) + imageTag + formData.content.substring(start)
      setFormData({...formData, content: newContent})
    }
  }

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="write-blog-page">
      <div className="container">
        <h1>Write New Post</h1>
        
        <form onSubmit={handleSubmit} className="write-form">
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          
          <div className="content-section">
            <div className="content-toolbar">
              <button 
                type="button" 
                className="add-image-btn"
                onClick={() => setShowImageUpload(!showImageUpload)}
                title="Add cover image"
              >
                📷
              </button>
              <button 
                type="button" 
                className="add-image-btn"
                onClick={insertImage}
                title="Insert image in content"
              >
                +
              </button>
            </div>
            
            {showImageUpload && (
              <input
                type="url"
                name="image"
                placeholder="Image URL (optional)"
                value={formData.image}
                onChange={handleChange}
              />
            )}
            
            <textarea
              name="content"
              placeholder="Write your post content...\n\nTip: Use [IMAGE: url] to add images inline"
              value={formData.content}
              onChange={handleChange}
              onPaste={handlePaste}
              rows="15"
              required
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}
            />
          </div>
          
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
          />
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn">
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteBlog