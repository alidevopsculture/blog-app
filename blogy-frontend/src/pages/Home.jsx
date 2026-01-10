import Hero from '../components/Hero'
import Featured from '../components/Featured'
import Recent from '../components/Recent'
import Latest from '../components/Latest'

const Home = ({ userPosts }) => {
  return (
    <main>
      <article>
        <Hero />
        <Featured userPosts={userPosts} />
        <Recent userPosts={userPosts} />
        <Latest userPosts={userPosts} />
      </article>
    </main>
  )
}

export default Home