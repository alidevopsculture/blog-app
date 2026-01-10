import { latestPosts } from '../data/posts'
import { useNavigate } from 'react-router-dom'

const Latest = ({ userPosts = [] }) => {
  const navigate = useNavigate()
  const allPosts = [...userPosts, ...latestPosts]
  
  const handleAuthorClick = (authorId) => {
    navigate(`/publisher/${authorId || 'demo'}`)
  }
  
  const handleShare = (post, e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/blog/${post.id}`
    if (navigator.share) {
      navigator.share({title: post.title, url})
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }
  
  return (
    <section className="section latest">
      <div className="container">
        <h2 className="h2 section-title">See what we've written lately</h2>
        <p className="section-subtitle">
          Discover our <strong className="strong">newest content</strong>
        </p>

        <ul className="grid-list">
          {allPosts.map(post => (
            <li key={post.id}>
              <div className="blog-card">
                {post.image ? (
                  <figure className="card-banner img-holder" style={{'--width': 280, '--height': 200}}>
                    <img 
                      src={post.image} 
                      width="280" 
                      height="200" 
                      loading="lazy"
                      alt={post.title} 
                      className="img-cover" 
                    />

                    {post.authors && (
                      <ul className="avatar-list absolute">
                        {post.authors.map((author, index) => (
                          <li key={index} className="avatar-item">
                            <button 
                              className="avatar img-holder" 
                              style={{'--width': 100, '--height': 100}}
                              onClick={() => handleAuthorClick(post.authorId || index)}
                            >
                              {author ? (
                                <img 
                                  src={author} 
                                  width="100" 
                                  height="100" 
                                  loading="lazy" 
                                  alt="Author"
                                  className="img-cover" 
                                />
                              ) : (
                                <div className="avatar-placeholder">A</div>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </figure>
                ) : (
                  <div className="card-heading">
                    <h3 className="h3">{post.title}</h3>
                  </div>
                )}

                <div className="card-content">
                  <ul className="card-meta-list">
                    {post.tags.map(tag => (
                      <li key={tag}>
                        <a href="#" className="card-tag">{tag}</a>
                      </li>
                    ))}
                  </ul>

                  <h3 className="h4">
                    <button 
                      className="card-title hover:underline"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      {post.title}
                    </button>
                  </h3>

                  <p className="card-text">
                    {post.excerpt}
                  </p>
                  
                  <div className="card-actions">
                    <div className="card-meta">
                      <span className="author-name">{post.author}</span>
                      <span className="post-date">{post.date}</span>
                    </div>
                    <button 
                      className="share-btn"
                      onClick={(e) => handleShare(post, e)}
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Latest