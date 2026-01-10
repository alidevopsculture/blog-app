import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [userPosts, setUserPosts] = useState([])
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    const savedProfile = JSON.parse(localStorage.getItem(`profile_${user.id}`) || '{}')
    setProfileData({
      name: savedProfile.name || user.name,
      email: savedProfile.email || user.email,
      bio: savedProfile.bio || '',
      avatar: savedProfile.avatar || user.avatar
    })

    const allPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    const myPosts = allPosts.filter(post => post.authorId === user.id)
    setUserPosts(myPosts)
  }, [user, navigate])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newAvatar = e.target.result
        setProfileData({...profileData, avatar: newAvatar})
        updateUser({ avatar: newAvatar })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData))
    updateUser({ name: profileData.name, email: profileData.email, avatar: profileData.avatar })
    setIsEditing(false)
  }

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const allPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
      const updatedPosts = allPosts.filter(post => post.id !== postId)
      localStorage.setItem('userPosts', JSON.stringify(updatedPosts))
      setUserPosts(updatedPosts.filter(post => post.authorId === user.id))
    }
  }

  if (!user) return null

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="avatar-section">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt={profileData.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">{profileData.name?.charAt(0) || 'U'}</div>
            )}
            {isEditing && (
              <div className="avatar-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="avatar-input"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="btn btn-secondary">Change Photo</label>
              </div>
            )}
          </div>
          <div className="profile-info">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn">Save</button>
                </div>
              </form>
            ) : (
              <>
                <h1>{profileData.name}</h1>
                <p className="profile-email">{profileData.email}</p>
                {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
                <div className="profile-actions">
                  <button onClick={() => setIsEditing(true)} className="btn">Edit Profile</button>
                  <button onClick={() => navigate('/write')} className="btn">Write New Post</button>
                  <button onClick={() => navigator.share ? navigator.share({title: `${profileData.name}'s Profile`, url: window.location.href}) : navigator.clipboard.writeText(window.location.href)} className="btn-secondary">Share Profile</button>
                  <button onClick={logout} className="btn-secondary">Logout</button>
                </div>
              </>
            )}
          </div>
        </div>

        <section className="user-posts">
          <h2>My Posts ({userPosts.length})</h2>
          <div className="posts-grid">
            {userPosts.map(post => (
              <div key={post.id} className="post-card">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="post-card-image" />
                ) : (
                  <div className="post-card-heading">
                    <h3>{post.title}</h3>
                  </div>
                )}
                <div className="post-card-content">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="post-card-actions">
                    <button onClick={() => navigate(`/blog/${post.id}`)} className="btn-secondary">
                      View
                    </button>
                    <button onClick={() => handleDeletePost(post.id)} className="btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile