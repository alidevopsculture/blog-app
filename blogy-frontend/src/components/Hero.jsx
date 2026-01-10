import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Auth from './Auth'

const Hero = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)

  const handleStartWriting = () => {
    if (user) {
      navigate('/write')
    } else {
      setShowAuth(true)
    }
  }

  return (
    <section className="section hero">
      <div className="container">
        <h1 className="h1 hero-title">
          <strong className="strong">Hey, we are Zerofour.</strong> See our thoughts, stories and ideas.
        </h1>

        <div className="wrapper">
          <button className="btn start-writing-btn" onClick={handleStartWriting}>
            Start Writing..
          </button>

          <p className="newsletter-text">
            Share your thoughts and ideas with the world. Join our community of writers.
          </p>
        </div>
      </div>
      
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </section>
  )
}

export default Hero