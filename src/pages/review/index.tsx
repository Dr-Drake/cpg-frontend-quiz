import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from 'react';
import { fetchQuiz, useQuiz } from "../../services/quiz";
import styles from '../../styles/test.module.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { CipherResult, decrypt, encrypt } from "../../utility/encryption";


const Review: NextPage = ()=>{

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

    // First load answers
    React.useEffect(()=>{
        let encryptedData = router.query.cxs as string || '';
        let iv = router.query.var as string || '';
        let key = router.query.ky as string || '';

        let cipherResult: CipherResult = { encryptedData, iv, key };
        let unParsedAnswered: string = decrypt(cipherResult);
        let ans: string[] = JSON.parse(unParsedAnswered);
        setAnswers(ans);
    },[])


    // Handlers
    const handleCheck = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (answers[choiceStep]){
            let choices = [...answers];
            choices[choiceStep] = event.target.value;
            setAnswers(choices);
        }
        else if (choiceStep === 0)
        {
            setAnswers([event.target.value]);
        }
        else{
            let choices = [...answers] || [];
            choices.push(event.target.value);
            setAnswers(choices);
        }
    };

    const handleNextStep = async()=>{
        setStep(step + 1);
        setChoiceStep(choiceStep + 1);
    }

    const handlePrevStep = async()=>{
        setStep(step - 1);
        setChoiceStep(choiceStep - 1);
    }


    const processFinish = ()=>{
        router.push('/');
    }

    // Elements
    const choiceDisplay = (
        <div className={styles.choiceDisplay}>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="choices"
                value={answers[choiceStep] || ''}
                //onChange={handleCheck}
            >
            {
                data && data[step].choices.map((item)=>{
                    let style = styles.choice;

                    if (answers[choiceStep] === item.label) {
                        style += ` ${styles.wrong}`;
                    }

                    if (answers[choiceStep] === data[step].correctAnswer?.label) {
                        if (answers[choiceStep] === item.label) {
                            style = `${styles.choice} ${styles.correct}`;
                        }
                    }

                    if (item.label === data[step].correctAnswer?.label) {
                        style = `${styles.choice} ${styles.correct}`;
                    }

                    
                    return(
                        <div key={item.id} className={style}>
                            {item.label}
                            <FormControlLabel 
                            disabled value={item.label} control={<Radio />} label={item.text} 
                                sx={{ marginLeft: '5px' }}
                            />
                        </div>
                    )
                })
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
                { step === endIndex && <Button variant="contained" onClick={processFinish}>Finish</Button>}
            </div>
        </main>
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

export default Review;