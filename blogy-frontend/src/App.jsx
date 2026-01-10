import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer.jsx'
import Home from './pages/Home'
import WriteBlog from './pages/WriteBlog'
import BlogView from './pages/BlogView'
import Profile from './pages/Profile'
import PublisherProfile from './pages/PublisherProfile'

function App() {
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
    setUserPosts(savedPosts)
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home userPosts={userPosts} />} />
            <Route path="/write" element={<WriteBlog />} />
            <Route path="/blog/:id" element={<BlogView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/publisher/:publisherId" element={<PublisherProfile />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App