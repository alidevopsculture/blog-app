import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!isVisible) return null

  return (
    <div className="welcome-popup-overlay" onClick={() => setIsVisible(false)}>
      <div className="welcome-popup" onClick={(e) => e.stopPropagation()}>
        <button className="welcome-close-btn" onClick={() => setIsVisible(false)}>
          ×
        </button>
        <img src="/notfication-image.png" alt="Welcome" className="welcome-image" />
      </div>
    </div>
  )
}

export default WelcomePopup
