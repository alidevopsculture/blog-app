import Hero from '../components/Hero'
import Featured from '../components/Featured'
import Recent from '../components/Recent'

const Home = ({ userPosts }) => {
  return (
    <main>
      <article>
        <Hero />
        <Featured userPosts={userPosts} />
        <Recent userPosts={userPosts} />
      </article>
    </main>
  )
}

export default Home