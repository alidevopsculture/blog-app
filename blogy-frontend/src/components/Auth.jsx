import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Auth = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showOTP, setShowOTP] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    otp: ''
  })
  const { login, signup } = useAuth()

  const sendOTP = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })
      if (response.ok) {
        setShowOTP(true)
        alert('OTP sent to your email!')
      } else {
        const error = await response.json()
        alert(error.message)
      }
    } catch (error) {
      alert('Error sending OTP')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLogin) {
      const result = await login(formData.email, formData.password)
      if (result) onClose()
    } else if (!showOTP) {
      sendOTP()
    } else {
      const result = await signup(formData.email, formData.password, formData.name, formData.otp)
      if (result) onClose()
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-modal">
      <div className="auth-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && showOTP && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          )}
          <button type="submit" className="btn">
            {isLogin ? 'Login' : showOTP ? 'Verify & Sign Up' : 'Send OTP'}
          </button>
        </form>
        
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            className="link-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Auth