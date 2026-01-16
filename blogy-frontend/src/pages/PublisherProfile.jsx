import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { topAuthors } from '../data/posts'

const PublisherProfile = () => {
  const { publisherId } = useParams()
  const [publisher, setPublisher] = useState(null)
  const [publisherPosts, setPublisherPosts] = useState([])

  useEffect(() => {
    // Get actual user data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userData = users.find(u => u.id === publisherId)
    
    // Get profile data if exists
    const profileData = JSON.parse(localStorage.getItem(`profile_${publisherId}`) || '{}')
    
    if (userData || profileData.name) {
      const mockPublisher = {
        id: publisherId,
        name: profileData.name || userData?.name || 'Anonymous User',
        avatar: profileData.avatar || userData?.avatar || '',
        bio: profileData.bio || 'Writer and content creator.',
        joinDate: userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
        totalPosts: 0,
        followers: 0
      }
      
      setPublisher(mockPublisher)
    } else {
      // Fallback for demo authors
      const authorData = topAuthors.find(author => author.id === publisherId)
      if (authorData) {
        setPublisher({
          id: publisherId,
          name: authorData.name,
          avatar: authorData.avatar,
          bio: 'Featured author on our platform.',
          joinDate: 'January 2024',
          totalPosts: authorData.postsCount || 0,
          followers: 0
        })
      }
    }
    
    // Get posts by this publisher
    const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    const posts = userPosts.filter(post => post.authorId?.toString() === publisherId)
    setPublisherPosts(posts)
    
    // Update total posts count
    if (publisher) {
      setPublisher(prev => ({ ...prev, totalPosts: posts.length }))
    }
  }, [publisherId])

  if (!publisher) return <div>Loading...</div>

  return (
    <div className="publisher-profile-page">
      <div className="container">
        <div className="publisher-header">
          {publisher.avatar ? (
            <img src={publisher.avatar} alt={publisher.name} className="publisher-avatar" />
          ) : (
            <div className="profile-avatar-placeholder" style={{width: '120px', height: '120px'}}>
              {publisher.name?.charAt(0) || 'U'}
            </div>
          )}
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