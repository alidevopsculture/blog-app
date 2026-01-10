import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { featuredPosts } from '../data/posts'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    const allPosts = [...userPosts, ...featuredPosts]
    const foundPost = allPosts.find(p => p.id.toString() === id)
    
    if (foundPost) {
      setPost(foundPost)
      setComments(foundPost.comments || [])
      setEditData({
        title: foundPost.title,
        content: foundPost.content,
        tags: foundPost.tags?.join(', ') || '',
        image: foundPost.image
      })
    }
  }, [id])

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!user || !comment.trim()) return

    const newComment = {
      id: Date.now(),
      text: comment,
      author: user.name,
      avatar: user.avatar,
      date: new Date().toLocaleDateString()
    }

    const updatedComments = [...comments, newComment]
    setComments(updatedComments)
    
    const savedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    const updatedPosts = savedPosts.map(p => 
      p.id.toString() === id ? { ...p, comments: updatedComments } : p
    )
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts))
    
    setComment('')
  }

  const handleEdit = (e) => {
    e.preventDefault()
    const updatedPost = {
      ...post,
      title: editData.title,
      content: editData.content,
      excerpt: editData.content.substring(0, 150) + '...',
      tags: editData.tags.split(',').map(tag => tag.trim()),
      image: editData.image
    }

    const savedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    const updatedPosts = savedPosts.map(p => 
      p.id.toString() === id ? updatedPost : p
    )
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts))
    
    setPost(updatedPost)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const savedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
      const updatedPosts = savedPosts.filter(p => p.id.toString() !== id)
      localStorage.setItem('userPosts', JSON.stringify(updatedPosts))
      navigate('/')
    }
  }

  if (!post) return <div>Loading...</div>

  const canEdit = user && post.authorId === user.id

  return (
    <div className="blog-view-page">
      <div className="container">
        {isEditing ? (
          <form onSubmit={handleEdit} className="edit-form">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              required
            />
            <input
              type="url"
              value={editData.image}
              onChange={(e) => setEditData({...editData, image: e.target.value})}
              placeholder="Image URL"
            />
            <input
              type="text"
              value={editData.tags}
              onChange={(e) => setEditData({...editData, tags: e.target.value})}
              placeholder="Tags (comma separated)"
            />
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({...editData, content: e.target.value})}
              rows="15"
              required
            />
            <div className="form-actions">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn">Save Changes</button>
            </div>
          </form>
        ) : (
          <article className="blog-post">
            <div className="post-header">
              <h1>{post.title}</h1>
              <div className="post-actions">
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({title: post.title, url: window.location.href})
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Link copied to clipboard!')
                    }
                  }} 
                  className="btn-secondary"
                >
                  Share
                </button>
                {canEdit && (
                  <>
                    <button onClick={() => setIsEditing(true)} className="btn-secondary">Edit</button>
                    <button onClick={handleDelete} className="btn-danger">Delete</button>
                  </>
                )}
              </div>
            </div>
            
            <div className="post-meta">
              <span>By {post.author || 'Anonymous'}</span>
              <span>{post.date}</span>
            </div>
            
            {post.image && (
              <img src={post.image} alt={post.title} className="post-image" />
            )}
            
            <div className="post-content">
              {post.content || post.excerpt}
            </div>
            
            <div className="post-tags">
              {post.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </article>
        )}

        <section className="comments-section">
          <h3>Comments ({comments.length})</h3>
          
          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
              />
              <button type="submit" className="btn">Post Comment</button>
            </form>
          )}

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <strong>{comment.author}</strong>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default BlogView