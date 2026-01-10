import { useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <section className="section newsletter">
      <h2 className="h2 section-title">
        Subscribe to <strong className="strong">new posts</strong>
      </h2>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email_address" 
          placeholder="Your email address" 
          required 
          className="email-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn">Subscribe</button>
      </form>
    </section>
  )
}

export default Newsletter