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
    <div className="modern-blog-view">
      <div className="blog-view-container">
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
          <>
            <article className="modern-article">
              <h1 className="article-title">{post.title}</h1>
              
              <div className="article-meta">
                <div className="author-info">
                  <button 
                    className="author-avatar-btn"
                    onClick={() => navigate(`/publisher/${post.authorId}`)}
                  >
                    {post.authors?.[0] ? (
                      <img src={post.authors[0]} alt={post.author} />
                    ) : (
                      <div className="avatar-placeholder-small">{post.author?.charAt(0) || 'A'}</div>
                    )}
                  </button>
                  <div>
                    <button 
                      className="author-name-btn"
                      onClick={() => navigate(`/publisher/${post.authorId}`)}
                    >
                      {post.author || 'Anonymous'}
                    </button>
                    <div className="meta-details">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{Math.ceil(post.content?.length / 1000) || 5} min read</span>
                    </div>
                  </div>
                </div>
                
                <div className="article-actions">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({title: post.title, url: window.location.href})
                      } else {
                        navigator.clipboard.writeText(window.location.href)
                        alert('Link copied!')
                      }
                    }} 
                    className="action-btn"
                    title="Share"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                  {canEdit && (
                    <>
                      <button onClick={() => setIsEditing(true)} className="action-btn" title="Edit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={handleDelete} className="action-btn delete-btn" title="Delete">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {post.image && (
                <img src={post.image} alt={post.title} className="article-image" />
              )}
              
              <div className="article-content">
                {post.content?.split('\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim()
                  if (!trimmed) return <br key={index} />
                  
                  // Detect bullet points
                  if (trimmed.match(/^[-•*]\s/)) {
                    return <li key={index} className="content-list-item">{trimmed.replace(/^[-•*]\s/, '')}</li>
                  }
                  
                  // Detect headings (lines that are short and end without punctuation)
                  const isHeading = trimmed.length < 60 && !trimmed.match(/[.!?,;:]$/)
                  const isSubheading = trimmed.length < 80 && trimmed.length > 60 && !trimmed.match(/[.!?,;:]$/)
                  
                  if (isHeading) {
                    return <h2 key={index} className="content-heading">{trimmed}</h2>
                  }
                  if (isSubheading) {
                    return <h3 key={index} className="content-subheading">{trimmed}</h3>
                  }
                  return <p key={index} className="content-paragraph">{trimmed}</p>
                }) || post.excerpt}
              </div>
              
              {post.tags?.length > 0 && (
                <div className="article-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="article-tag">{tag}</span>
                  ))}
                </div>
              )}
            </article>

            <section className="modern-comments">
              <h2>Responses ({comments.length})</h2>
              
              {user ? (
                <form onSubmit={handleAddComment} className="modern-comment-form">
                  <img src={user.avatar} alt={user.name} className="comment-user-avatar" />
                  <div className="comment-input-wrapper">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What are your thoughts?"
                      rows="3"
                    />
                    <button type="submit" className="btn-respond" disabled={!comment.trim()}>
                      Respond
                    </button>
                  </div>
                </form>
              ) : (
                <p className="login-prompt">Please login to leave a comment</p>
              )}

              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="modern-comment">
                    <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                    <div className="comment-body">
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
          </>
        )}
      </div>
    </div>
  )
}

export default BlogView