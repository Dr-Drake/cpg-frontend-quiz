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
import { Choice } from "../types/quiz";


const Test: NextPage = ()=>{

    // Hooks
    const router = useRouter();
    const { data, isLoading, isError } = useQuiz();

    let startIndex: number = parseInt(router.query.start as string);
    let endIndex: number = parseInt(router.query.end as string);

    // TODOS
    // Session using localstorage

    // State
    const [answers, setAnswers] = React.useState<string[]>(['']);
    const [step, setStep] = React.useState<number>(startIndex);
    const [choiceStep, setChoiceStep] = React.useState<number>(0);


    // Handlers
    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (answers[choiceStep]){
            let choices = [...answers];
            choices[choiceStep] = event.target.value;
            setAnswers(choices);
        }
        else{
            let choices = [...answers];
            choices.push(event.target.value);
            setAnswers(choices);
        }
    };
    const handleNextStep = ()=>{
        setStep(step + 1);
        setChoiceStep(choiceStep + 1);
    }
    const handlePrevStep = ()=>{
        setStep(step - 1);
        setChoiceStep(choiceStep - 1);
    }

    // Elements
    const choiceDisplay = (
        <div className={styles.choiceDisplay}>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="choices"
                value={answers[choiceStep]}
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
                { step === endIndex && <Button variant="contained" >Finish</Button>}
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