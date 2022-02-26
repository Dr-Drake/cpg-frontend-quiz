import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from 'react';
import { fetchQuiz, updateQuiz, useQuiz } from "../../services/quiz";
import styles from '../../styles/preview.module.css';
import Button from '@mui/material/Button';
import Link from 'next/link'
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import Tooltip from "@mui/material/Tooltip";
import { Choice } from "../../types/quiz";
import isEmpty from "../../utility/isEmpty";
import DeleteIcon from '@mui/icons-material/Delete';
import ToastContext from "../../contexts/ToastContext";
import { UpdateQuizRequest } from "../../types/request";
import CircularProgress from '@mui/material/CircularProgress';


const Preview: NextPage = ()=>{

    // Context
    const { openError, openSuccess } = React.useContext(ToastContext);

    // Refs
    const keyInputRef = React.createRef<HTMLInputElement>();
    const textInputRef = React.createRef<HTMLInputElement>();

    // Hooks
    const router = useRouter();
    const { data, isLoading, isError, mutate } = useQuiz();

    let startIndex: number = parseInt(router.query.start as string);
    let endIndex: number = parseInt(router.query.end as string);

    // TODOS
    // Session using localstorage

    // State
    const [step, setStep] = React.useState<number>(startIndex);
    const [choiceStep, setChoiceStep] = React.useState<number>(0);
    const [question, setQuestion] = React.useState<string>('')
    const [choices, setChoices] = React.useState<Choice[]>([])
    const [answer, setAnswer] = React.useState<Choice>();
    const [ansKey, setAnsKey] = React.useState<string>('');
    const [ansText, setAnsText] = React.useState<string>('');
    const [correctChoice, setCorrectChoice] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    // Effect
    React.useEffect(()=>{
        if (data && data.length > 0) {
            setQuestion(data[step].question);
            setChoices(data[step].choices);
            setAnswer(data[step].correctAnswer);

            let correctAns = data[step].correctAnswer;
            setCorrectChoice(correctAns?.label || '');
        }
    },[data, step]);


    // Handlers
    const handleNextStep = ()=>{
        setStep(step + 1);
        setChoiceStep(choiceStep + 1);
    }
    const handlePrevStep = ()=>{
        setStep(step - 1);
        setChoiceStep(choiceStep - 1);
    }
    const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setAnsKey(event.target.value);
    }
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setAnsText(event.target.value);
    }
    const handleCorrectChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setCorrectChoice(event.target.value);
        setAnswer(choices.find((c)=> c.label === (event.target.value)));
    }
    const handleAddOption = ()=>{
        if (isEmpty(ansKey) || isEmpty(ansText)) {
        }
        else{
            let choice: Choice = {
                label: ansKey + '.',
                text: ansText
            }
            setChoices((prevChoices)=>([...prevChoices, choice]));
            if(keyInputRef.current) keyInputRef.current.value = '';
            if(textInputRef.current) textInputRef.current.value = '';
        }
    }
    const handleOptionDelete = (label: string) =>{
        let filteredChoices = choices.filter((c)=> c.label !== label);
        setChoices(filteredChoices);
    }
    const handleReset = ()=>{
        if (data && data.length > 0) {
            setQuestion(data[step].question);
            setChoices(data[step].choices);
            setAnswer(data[step].correctAnswer)
        }
    }
    const handleQuestionChange = (event: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setQuestion(event.target.value);
    }
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        let label = event.target.name;
        let text = event.target.value;
        let updatedChoices: Choice[] = choices.map((c)=>{
            if (c.label === label) {
                return {
                    label: c.label,
                    text: text
                }
            }
            return c
        })
        setChoices(updatedChoices);
    }
    const handleUpdate = async ()=>{
        if(data){
            let id: string = data[step].id;

            if (confirm('Are you sure you want to Update this quiz?')) {
                setLoading(true);
                let request: UpdateQuizRequest = {
                    question: question,
                    choices: choices,
                    answer: answer
                }
                console.log(request);
                const { data, error } = await updateQuiz(id, request);

                if (data) {
                    setLoading(false);
                    openSuccess('Quiz Updated successfully');
                    mutate();
                }
                if (error) {
                    setLoading(false);
                    openError('An error occured while updating the quiz');
                }
            }
        }
    }

    // Elements
    const choiceEditDisplay = (
        <div className={styles.choiceEditDisplay}>
            {
                choices.map((item)=>(
                    <div key={item.id} className={styles.choiceEdit}>
                        <Tooltip title={"Delete option"}>
                            <IconButton onClick={()=> handleOptionDelete(item.label)}>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                        <span>{item.label}</span>
                        <input type="text" value={item.text} 
                            name={item.label} onChange={handleOptionChange}
                        />
                    </div>
                ))
            }
        </div>
    )

    const answerDisplay = (
        <div className={styles.answerDisplay}>
            <span>Answer is</span><span>{' '}</span>
            <input type="text" value={correctChoice} onChange={handleCorrectChange} />
        </div>
    )

    const addOption = (
        <div className={styles.addOption}>
            {/** Key */}
            <div className={styles.key}>
                <span>Key:</span>
                <span>{' '}</span>
                <input ref={keyInputRef} type="text" maxLength={1} onChange={handleKeyChange}/>
            </div>

            {/** Value */}
            <div className={styles.text}>
                <span>Text:</span>
                <span>{' '}</span>
                <input ref={textInputRef} type="text" onChange={handleTextChange}/>
            </div>

            <Tooltip title={"Add new option"}>
                <IconButton onClick={handleAddOption}>
                    <AddIcon/>
                </IconButton>
            </Tooltip>
        </div>
    )


    return(
        <main className={styles.container}>
            {/** Home Button */}
            <div className={styles.homeLink}>
                <Link href="/edit">
                    <a className={styles.a}>Go Back to Edit</a>
                </Link>
            </div>

            {/** Question */}
            {
                <div className={styles.questionEdit}>
                    <textarea value={question} onChange={handleQuestionChange}>
                    </textarea>
                </div>
            }

            {/** Chioces */}
            { choiceEditDisplay }
            { answerDisplay }
            { addOption }

            {/** Actions */}
            <div className={styles.actions}>
                <Button variant="contained" disabled={step === startIndex} onClick={handlePrevStep}>PREV</Button>
                <Button color="success" 
                    variant="contained" 
                    onClick={handleUpdate}
                    disabled={loading}
                >
                    UPDATE
                </Button>
                {loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
                <Button color="error" variant="contained" onClick={handleReset}>RESET</Button>
                { step !== endIndex && <Button variant="contained" onClick={handleNextStep}>NEXT</Button>}
                
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
              destination: '/edit',
              permanent: false,
            },
        }
    }
    
    return {
        props: {}
    }
}

export default Preview;