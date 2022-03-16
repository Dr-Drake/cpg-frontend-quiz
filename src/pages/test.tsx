import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from 'react';
import { fetchQuiz, useQuiz } from "../services/quiz";
import styles from '../styles/test.module.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Link from 'next/link'
import { QuizSession } from "../types/quiz";
import { encrypt } from "../utility/encryption";
import LoadingButton from '@mui/lab/LoadingButton';


const Test: NextPage = ()=>{

    // Refs
    const score = React.useRef(0);

    // Hooks
    const router = useRouter();
    const { data, isLoading, isError } = useQuiz();

    let startIndex: number = parseInt(router.query.start as string);
    let endIndex: number = parseInt(router.query.end as string);

    // State
    const [answers, setAnswers] = React.useState<string[]>(['']);
    const [step, setStep] = React.useState<number>(startIndex);
    const [choiceStep, setChoiceStep] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);

    // First load session
    React.useEffect(()=>{
        let sessions = localStorage.getItem('cpg_sessions');

        if (sessions) {
            let parsedSessions: QuizSession = JSON.parse(sessions);
            let sessionKey = JSON.stringify(router.query);

            // To prevent error being thrown for null values
            if (parsedSessions[sessionKey]) {
                let { step, answers, choiceStep } = parsedSessions[sessionKey];

                setStep(step);
                setChoiceStep(choiceStep);
                setAnswers(answers);
            }
        }
    },[])


    // TODOS
    // Session using localstorage
    const saveSession = (currentStep: number, currentChoiceStep: number, currentAnswers: string[])=>{
        const willSaveSession = new Promise<void>(()=>{
            let sessionKey = JSON.stringify(router.query);
            let session: QuizSession = {
                [sessionKey]:{
                    step: currentStep,
                    choiceStep: currentChoiceStep,
                    answers: currentAnswers
                }
            }

            let activeSessions = localStorage.getItem('cpg_sessions');
            if (activeSessions) {
                console.log("UPDATE");
                let activeParsedSessions: QuizSession = JSON.parse(activeSessions);
                activeParsedSessions[sessionKey] = {
                    step: currentStep,
                    choiceStep: currentChoiceStep,
                    answers: currentAnswers
                }
                localStorage.setItem('cpg_sessions', JSON.stringify(activeParsedSessions));
            }
            else{
                console.log('FRESH');
                localStorage.setItem('cpg_sessions', JSON.stringify(session));
            }
        })
        return willSaveSession;
    }


    // Handlers
    const handleCheck = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (answers[choiceStep]){
            let choices = [...answers];
            choices[choiceStep] = event.target.value;
            setAnswers(choices);
            await saveSession(step, choiceStep, choices);
        }
        else if (choiceStep === 0)
        {
            setAnswers([event.target.value]);
            await saveSession(step, choiceStep, [event.target.value]);
        }
        else{
            let choices = [...answers] || [];
            choices.push(event.target.value);
            setAnswers(choices);
            await saveSession(step, choiceStep, choices);
        }
    };
    const handleNextStep = async()=>{
        setStep(step + 1);
        setChoiceStep(choiceStep + 1);
        await saveSession(step + 1, choiceStep + 1, answers);
    }
    const handlePrevStep = async()=>{
        setStep(step - 1);
        setChoiceStep(choiceStep - 1);
        await saveSession(step - 1, choiceStep - 1, answers);
    }

    const isAutomaticMarkingAvailable = (): boolean =>{
        if (data) {
            let currentQuiz = data.slice(startIndex, endIndex + 1);
            for (let i = 0; i < currentQuiz.length; i++) {
                const quiz = currentQuiz[i];

                if (!quiz.correctAnswer) {
                    return false;
                }
                
            }

            return true;
        }

        return false;
    }

    const markQuiz = ()=>{
        if (data) {
            let currentQuiz = data.slice(startIndex, endIndex + 1);
            for (let i = 0; i < currentQuiz.length; i++) {
                const quiz = currentQuiz[i];

                if (quiz.correctAnswer && quiz.correctAnswer.label === answers[i]) {
                    score.current += 1;
                }
                
            }
        }
    }

    const proceedToNextPage = ()=>{
        let cipherResult = encrypt(JSON.stringify(answers));
        let sessionKey = JSON.stringify(router.query);

        // Clear session from local storage
        let activeSessions = localStorage.getItem('cpg_sessions');
        if (activeSessions) {
            let activeParsedSessions: QuizSession = JSON.parse(activeSessions);
            delete activeParsedSessions[sessionKey];
            localStorage.setItem('cpg_sessions', JSON.stringify(activeParsedSessions));
        }

        router.push({
            pathname: '/result',
            query:{ 
                cxs: cipherResult.encryptedData,
                var: cipherResult.iv,
                ky: cipherResult.key,
                score: score.current,
                auto: true,
                start: router.query.start,
                end: router.query.end
            }
        })
    }

    const processFinish = ()=>{
        setLoading(true);

        // Check if automatic marking is available
        if (isAutomaticMarkingAvailable()) {
            markQuiz();
            proceedToNextPage();
        }
        else{
            let cipherResult = encrypt(JSON.stringify(answers));
            router.push({
                pathname: '/result',
                query:{ 
                    cxs: cipherResult.encryptedData,
                    var: cipherResult.iv,
                    ky: cipherResult.key,
                    auto: false,
                    start: router.query.start,
                    end: router.query.end
                }
            })
        }
    }

    // Elements
    const choiceDisplay = (
        <div className={styles.choiceDisplay}>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="choices"
                value={answers[choiceStep] || ''}
                onChange={handleCheck}
            >
            {
                data && data[step].choices.map((item)=>(
                    <div key={item.id} className={styles.choice}>
                        {item.label}
                        <FormControlLabel value={item.label} control={<Radio />} label={item.text} 
                            sx={{ marginLeft: '5px' }}
                        />
                    </div>
                ))
            }
            </RadioGroup>
        </div>
    )

    return(
        <main className={styles.container}>
            {/** Home Button */}
            <div className={styles.homeLink}>
                <Link href="/">
                    <a className={styles.a}>Go Home</a>
                </Link>
            </div>

            {/** Question */}
            <div className={styles.question}>
                <p>{data && data[step].question}</p>
            </div>

            {/** Chioces */}
            { choiceDisplay }

            {/** Actions */}
            <div className={styles.actions}>
                <Button variant="contained" disabled={step === startIndex} onClick={handlePrevStep}>PREV</Button>
                { step !== endIndex && <Button variant="contained" onClick={handleNextStep}>NEXT</Button>}
                { 
                    step === endIndex && 
                    <LoadingButton 
                        loading={loading}
                        variant="contained" 
                        onClick={processFinish} 
                    >
                        Finish
                    </LoadingButton>
                }
            </div>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps = async (context)=>{

    if (!context.query.start || !context.query.end){
        return {
            redirect: {
              destination: '/',
              permanent: false,
            },
        }
    }

    let startIndex: number = parseInt(context.query.start as string);
    let endIndex: number = parseInt(context.query.end as string);
    const response = await fetchQuiz();
    if (response.data && (startIndex >= response.data.length || endIndex >= response.data.length)) {
        return {
            redirect: {
              destination: '/',
              permanent: false,
            },
        }
    }
    
    return {
        props: {}
    }
}

export default Test;