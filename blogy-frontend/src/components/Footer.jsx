const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: 'logo-facebook' },
    { name: 'Twitter', icon: 'logo-twitter' },
    { name: 'Pinterest', icon: 'logo-pinterest' },
    { name: 'Vimeo', icon: 'logo-vimeo' }
  ]

  const aboutLinks = ['Style Guide', 'Features', 'Contact', '404', 'Privacy Policy']
  const featureLinks = ['Upcoming Events', 'Blog & News', 'Features', 'FAQ Question', 'Testimonial']
  const membershipLinks = ['Account', 'Membership', 'Subscribe', 'Tags', 'Authors']

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top section">
          <div className="footer-brand">
            <a href="#" className="logo">
              <img src="/logo.svg" width="129" height="40" alt="Blogy logo" />
            </a>
            <p className="footer-text">
              A minimal, functional theme for running a paid-membership publication on Ghost.
            </p>
          </div>

          <ul className="footer-list">
            <li>
              <p className="h5">Social</p>
            </li>
            {socialLinks.map(link => (
              <li key={link.name} className="footer-list-item">
                <ion-icon name={link.icon}></ion-icon>
                <a href="#" className="footer-link hover:underline">{link.name}</a>
              </li>
            ))}
          </ul>

          <ul className="footer-list">
            <li>
              <p className="h5">About</p>
            </li>
            {aboutLinks.map(link => (
              <li key={link}>
                <a href="#" className="footer-link hover:underline">{link}</a>
              </li>
            ))}
          </ul>

          <ul className="footer-list">
            <li>
              <p className="h5">Features</p>
            </li>
            {featureLinks.map(link => (
              <li key={link}>
                <a href="#" className="footer-link hover:underline">{link}</a>
              </li>
            ))}
          </ul>

          <ul className="footer-list">
            <li>
              <p className="h5">Membership</p>
            </li>
            {membershipLinks.map(link => (
              <li key={link}>
                <a href="#" className="footer-link hover:underline">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="section footer-bottom">
          <p className="copyright">
            &copy; Blogy 2025. Published by <a href="#" className="copyright-link hover:underline">Ali Murtaza</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer