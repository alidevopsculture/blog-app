import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const BlogPost = ({ post, onClose }) => {
  const { user } = useAuth()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(post.comments || [])

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
    
    // Update localStorage
    const savedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    const updatedPosts = savedPosts.map(p => 
      p.id === post.id ? { ...p, comments: updatedComments } : p
    )
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts))
    
    setComment('')
  }

  return (
    <div className="blog-post-modal">
      <div className="blog-post-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <article className="blog-post">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span>By {post.author || 'Anonymous'}</span>
            <span>{post.date}</span>
          </div>
          
          {post.image ? (
            <img src={post.image} alt={post.title} className="post-image" />
          ) : (
            <h2 className="post-heading">{post.title}</h2>
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

export default BlogPost