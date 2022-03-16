import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from 'react';
import { addQuiz, fetchQuiz, updateQuiz, useQuiz } from "../services/quiz";
import styles from '../styles/preview.module.css';
import Button from '@mui/material/Button';
import Link from 'next/link'
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import Tooltip from "@mui/material/Tooltip";
import { Choice } from "../types/quiz";
import isEmpty from "../utility/isEmpty";
import DeleteIcon from '@mui/icons-material/Delete';
import ToastContext from "../contexts/ToastContext";
import { UpdateQuizRequest } from "../types/request";
import CircularProgress from '@mui/material/CircularProgress';


const Add: NextPage = ()=>{

    // Context
    const { openError, openSuccess } = React.useContext(ToastContext);

    // Refs
    const keyInputRef = React.createRef<HTMLInputElement>();
    const textInputRef = React.createRef<HTMLInputElement>();

    // Hooks
    const router = useRouter();
    const { mutate } = useQuiz();

    // TODOS
    // Session using localstorage

    // State
    const [question, setQuestion] = React.useState<string>('')
    const [choices, setChoices] = React.useState<Choice[]>([])
    const [answer, setAnswer] = React.useState<Choice>();
    const [ansKey, setAnsKey] = React.useState<string>('');
    const [ansText, setAnsText] = React.useState<string>('');
    const [correctChoice, setCorrectChoice] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);



    // Handlers
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
        setQuestion('');
        setChoices([]);
        setAnswer(undefined)
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
        if (confirm('Are you sure you want to Add this quiz?')) {
            setLoading(true);
            let request: UpdateQuizRequest = {
                question: question,
                choices: choices,
                answer: answer
            }
            console.log(request);
            const { data, error } = await addQuiz(request);

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
                <Link href="/">
                    <a className={styles.a}>Go Back</a>
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
            </div>
        </main>
    )
}

export default Add;