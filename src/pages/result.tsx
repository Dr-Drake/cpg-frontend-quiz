import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '../components/Footer';
import { fetchQuiz } from '../services/quiz';
import styles from '../styles/Index.module.css';
import { Quiz } from '../types/quiz';
import { SWRConfig } from 'swr'
import QuizSet from '../components/QuizSet'
import NavigationBar from '../components/NavigationBar';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CipherResult, decrypt } from '../utility/encryption';
import Button from '@mui/material/Button';
import Layout from '../components/Layout';

interface ResultProps{
  errorCode?: number;
}

const Result: NextPage<ResultProps> = ({ errorCode }) => {

    if (errorCode) {
        return <Error statusCode={errorCode} />
    }

    // Hooks
    const router = useRouter();

    // Handlers
    const handleOnReview = ()=>{
        router.push({
            pathname: router.query.auto as string === 'true' ?  '/review' : '/review/manual',
            query: router.query
        })
    }

  return (
   <Layout>
       <main className={styles.container}>
            <div>
                <h1>Results</h1>
            </div>
            <div>
                {router.query.auto as string === 'true' && <p>You scored: {router.query.score || 0}</p>}
                {router.query.auto as string === 'false' && <p>The quiz needs to be marked manually</p>}
            
                <Button variant='contained' onClick={handleOnReview}>Review</Button>
            </div>
        </main>
   </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context)=>{

    if (context.query.auto === undefined){
        console.log('No auto found');
        return {
            props:{
                errorCode: 400
            }
        }
    }

    if (context.query.auto !== undefined){
        console.log('Auto found = ' +  context.query.auto);
        if (context.query.auto === 'true') {
            console.log('Checking other query params');
            if (
                !context.query.cxs || !context.query.var || !context.query.score ||
                !context.query.start || !context.query.end || !context.query.ky
                ) {
                    console.log(context.query.cxs);
                    console.log(context.query.var);
                    console.log(context.query.score);
                    console.log(context.query.start);
                    console.log(context.query.end);
                    console.log(context.query.ky);
                return {
                    props:{
                        errorCode: 400
                    }
                }
            }
        }
        else{
            if (!context.query.start || !context.query.end) {
                return {
                    props:{
                        errorCode: 400
                    }
                }
            }
            else{
                return{
                    props:{}
                }
            }
        }
    }

    return{
        props:{}
    }
}

export default Result;