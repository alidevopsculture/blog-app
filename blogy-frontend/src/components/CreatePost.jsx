import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const CreatePost = ({ onPostCreated, onClose }) => {
  const { user } = useAuth()
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
      date: new Date().toLocaleDateString(),
      comments: []
    }
    
    const existingPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    existingPosts.unshift(newPost)
    localStorage.setItem('userPosts', JSON.stringify(existingPosts))
    
    onPostCreated(newPost)
    onClose()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="create-post-modal">
      <div className="create-post-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Create New Post</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="image"
            placeholder="Image URL (optional)"
            value={formData.image}
            onChange={handleChange}
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Write your post content..."
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
          />
          <button type="submit" className="btn">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost