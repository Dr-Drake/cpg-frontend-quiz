import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '../components/Footer'
import { fetchQuiz } from '../services/quiz'
import styles from '../styles/Index.module.css';
import { Quiz } from '../types/quiz';
import { SWRConfig } from 'swr'
import QuizSet from '../components/QuizSet'
import NavigationBar from '../components/NavigationBar'

interface HomeProps{
  fallback: { [index:string]: Quiz[] };
}

const Home: NextPage<HomeProps> = ({ fallback }) => {

  return (
    <>
    <NavigationBar/>
    <div className={styles.container}>
      <Head>
        <title>CPG Practice Quiz</title>
        <meta name="description" content="Used in preparation for the CPG test" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <main>
        <div>
          <h1>CPG Practice Quiz</h1>
        </div>
        <div>
          <p>Select any of the quizzes below:</p>

          <SWRConfig value={{ fallback }}>
            <QuizSet />
          </SWRConfig>
        </div>
      </main>

      <Footer/>
      
    </div>
    </>
  )
}

export async function getStaticProps () {
  // `getStaticProps` is executed on the server side.
  const response = await fetchQuiz();

  if (response.error) {
    return { notFound: true };
  }

  return {
    props: {
      fallback: {
        '/quiz': response.data
      },
    }
  }
}

export default Home;
