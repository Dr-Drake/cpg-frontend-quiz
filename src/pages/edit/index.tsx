import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '../../components/Footer'
import { fetchQuiz } from '../../services/quiz'
import styles from '../../styles/Index.module.css';
import { Quiz } from '../../types/quiz';
import { SWRConfig } from 'swr'
import QuizSet from '../../components/QuizSet'
import NavigationBar from '../../components/NavigationBar';

interface HomeProps{
  fallback: { [index:string]: Quiz[] };
}

const Edit: NextPage<HomeProps> = ({ fallback }) => {

  return (
    <>
    <NavigationBar/>
    <div className={styles.container}>
      <main>
        <div>
          <h1>Edit Quiz</h1>
        </div>
        <div>
          <p>Select any of the quizzes below:</p>

          <SWRConfig value={{ fallback }}>
            <QuizSet mode='edit' />
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

export default Edit;
