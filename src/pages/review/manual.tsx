import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from 'react';
import { fetchQuiz, updateQuiz, useQuiz } from "../../services/quiz";
import styles from '../../styles/test.module.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { CipherResult, decrypt } from "../../utility/encryption";
import { UpdateQuizRequest } from "../../types/request";
import { Choice } from "../../types/quiz";
import ToastContext from "../../contexts/ToastContext";
import FormGroup from '@mui/material/FormGroup';
import Checkbox from "@mui/material/Checkbox";
import LoadingButton from '@mui/lab/LoadingButton';


const Manual: NextPage = ()=>{

    // Context
    const { openError, openSuccess } = React.useContext(ToastContext);

    // Hooks
    const router = useRouter();
    const { data, mutate } = useQuiz();

    let startIndex: number = parseInt(router.query.start as string);
    let endIndex: number = parseInt(router.query.end as string);

    // State
    const [answers, setAnswers] = React.useState<string[]>(['']);
    const [correctAnswers, setCorrectAnswers] = React.useState<string[]>(['']);
    const [step, setStep] = React.useState<number>(startIndex);
    const [choiceStep, setChoiceStep] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);

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
    const handleUpdate = async ()=>{
        if(data){
            let id: string = data[step].id;

            if (confirm('Are you sure you want to Update this quiz?')) {
                setLoading(true);
                let correctAnswer = data[step].choices.find((c)=> c.label === correctAnswers[choiceStep])
                let request: UpdateQuizRequest = {
                    question: data[step].question ,
                    choices: data[step].choices,
                    answer: correctAnswer
                }
                console.log(request);
                const updateResult = await updateQuiz(id, request);

                if (updateResult.data) {
                    setLoading(false);
                    openSuccess('Quiz Updated successfully');
                    mutate();
                }
                if (updateResult.error) {
                    setLoading(false);
                    openError('An error occured while updating the quiz');
                }
            }
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        if (correctAnswers[choiceStep]){
            let choices = [...correctAnswers];
            choices[choiceStep] = e.target.value;
            setCorrectAnswers(choices);
        }
        else if (choiceStep === 0)
        {
            setCorrectAnswers([e.target.value]);
        }
        else{
            let choices = [...correctAnswers] || [];
            choices.push(e.target.value);
            setCorrectAnswers(choices);
        }
    }
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

                    if ((answers[choiceStep] === item.label) && correctAnswers[choiceStep]) {
                        style += ` ${styles.wrong}`;
                    }

                    if (answers[choiceStep] === correctAnswers[choiceStep]) {
                        if (answers[choiceStep] === item.label) {
                            style = `${styles.choice} ${styles.correct}`;
                        }
                    }

                    if (item.label === correctAnswers[choiceStep]) {
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

    const answerSelection = (
        <FormGroup row >
            {
                data && data[step].choices.map((item)=>(
                    <FormControlLabel
                        control={
                            <Checkbox checked={correctAnswers[choiceStep] === item.label} value={item.label} onChange={handleChange} />
                        }
                        label={item.label}
                    />
                ))
            }
        </FormGroup>
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

            {/** Mark correct answer */}
            { answerSelection }

            {/** Actions */}
            <div className={styles.actions}>
                <Button variant="contained" disabled={step === startIndex} onClick={handlePrevStep}>PREV</Button>
                <LoadingButton color="success" 
                    variant="contained" 
                    onClick={handleUpdate}
                    loading={loading}
                >
                    Mark
                </LoadingButton>
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
        if (context.query.auto === 'false') {
            console.log('Checking other query params');
            if (
                !context.query.cxs || !context.query.var || !context.query.start || 
                !context.query.end || !context.query.ky
                ) {
                    console.log(context.query.cxs);
                    console.log(context.query.var);
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

export default Manual;