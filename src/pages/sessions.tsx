import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import { fetchQuiz } from '../services/quiz'
import styles from '../styles/Index.module.css';
import { Quiz } from '../types/quiz';
import { SWRConfig } from 'swr'
import NavigationBar from '../components/NavigationBar'
import SessionQuizSet from '../components/SessionQuizSet'

interface SessionPageProps{
  fallback: { [index:string]: Quiz[] };
}

const SessionPage: NextPage<SessionPageProps> = ({ fallback }) => {

  return (
    <>
    <NavigationBar/>
    <div className={styles.container}>
      <main>
        <div>
          <h1>Ongoing sessions</h1>
        </div>
        <div>
          <p>Below are the quizzes you've already started: </p>

          <SWRConfig value={{ fallback }}>
            <SessionQuizSet />
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

export default SessionPage;
