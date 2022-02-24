import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '../components/Footer'
import styles from '../styles/Index.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>CPG Practice Quiz</title>
        <meta name="description" content="Used in preparation for the CPG test" />
      </Head>

      <main>
        <div>
          <h3>CPG Practice Quiz</h3>
        </div>
        <div>
          <p>Select any of the quizzes below:</p>
        </div>
      </main>

      <Footer/>
      
    </div>
  )
}

export default Home
