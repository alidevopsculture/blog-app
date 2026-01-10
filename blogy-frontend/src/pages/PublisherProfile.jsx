import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { topAuthors } from '../data/posts'

const PublisherProfile = () => {
  const { publisherId } = useParams()
  const [publisher, setPublisher] = useState(null)
  const [publisherPosts, setPublisherPosts] = useState([])

  useEffect(() => {
    // Get publisher data from topAuthors or create fallback
    const authorData = topAuthors.find(author => author.id === publisherId)
    
    // If no author data found, create a proper name from the ID
    let publisherName = authorData?.name
    if (!publisherName) {
      // Convert numeric ID to a proper name
      const names = ['Alex Johnson', 'Sarah Wilson', 'Mike Chen', 'Emma Davis', 'John Smith']
      const index = parseInt(publisherId) % names.length
      publisherName = names[index] || `User ${publisherId}`
    }
    
    const mockPublisher = {
      id: publisherId,
      name: publisherName,
      avatar: authorData?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      bio: 'Passionate writer sharing thoughts and ideas with the world.',
      joinDate: 'January 2024',
      totalPosts: authorData?.postsCount || 12,
      followers: 156
    }
    
    setPublisher(mockPublisher)
    
    // Get posts by this publisher
    const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    const posts = userPosts.filter(post => post.authorId?.toString() === publisherId)
    setPublisherPosts(posts)
  }, [publisherId])

  if (!publisher) return <div>Loading...</div>

  return (
    <div className="publisher-profile-page">
      <div className="container">
        <div className="publisher-header">
          <img src={publisher.avatar} alt={publisher.name} className="publisher-avatar" />
          <div className="publisher-info">
            <h1>{publisher.name}</h1>
            <p className="publisher-bio">{publisher.bio}</p>
            <div className="publisher-stats">
              <span>{publisher.totalPosts} Posts</span>
              <span>{publisher.followers} Followers</span>
              <span>Joined {publisher.joinDate}</span>
            </div>
          </div>
        </div>

        <section className="publisher-posts">
          <h2>Posts by {publisher.name}</h2>
          {publisherPosts.length > 0 ? (
            <div className="posts-grid">
              {publisherPosts.map(post => (
                <div key={post.id} className="post-card">
                  <img src={post.image} alt={post.title} className="post-card-image" />
                  <div className="post-card-content">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="post-date">{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No posts yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default PublisherProfile