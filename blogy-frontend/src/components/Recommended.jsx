import { recommendedPosts } from '../data/posts'

const Recommended = () => {
  return (
    <section className="section recommended">
      <div className="container">
        <p className="section-subtitle">
          <strong className="strong">Recommended</strong>
        </p>

        <ul className="grid-list">
          {recommendedPosts.map(post => (
            <li key={post.id}>
              <div className="blog-card">
                {post.image ? (
                  <figure className="card-banner img-holder" style={{'--width': 300, '--height': 360}}>
                    <img 
                      src={post.image} 
                      width="300" 
                      height="360" 
                      loading="lazy"
                      alt={post.title} 
                      className="img-cover" 
                    />

                    {post.authors && (
                      <ul className="avatar-list absolute">
                        {post.authors.map((author, index) => (
                          <li key={index} className="avatar-item">
                            <a href="#" className="avatar img-holder" style={{'--width': 100, '--height': 100}}>
                              <img 
                                src={author} 
                                width="100" 
                                height="100" 
                                loading="lazy" 
                                alt="Author"
                                className="img-cover" 
                              />
                            </a>
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
                  <h3 className="h5">
                    <a href="#" className="card-title hover:underline">
                      {post.title}
                    </a>
                  </h3>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Recommended