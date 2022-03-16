import { useRouter } from 'next/router';
import React from 'react';
import { useQuiz } from '../../services/quiz';
import { Quiz } from '../../types/quiz';
import styles from './quizSet.module.css';

export interface QuizSetProps{
    mode?: 'edit' | 'test';
}

const QuizSet: React.FC<QuizSetProps> = ({ mode = 'test' })=>{

    // Hooks
    const { data, isLoading, isError } = useQuiz();
    const router = useRouter();

    let partition = 20;
    let remainder = 0;
    let parts = 0;

    if (data) {
        remainder = data.length % partition;
        parts = (data.length - remainder) / partition;
    }

    // Generate array
    let simpleArray = [];
    for (let i = 0; i < parts; i++) {
        simpleArray.push(i);
    }

    // Handlers
    const handleClick = (start: number, end: number)=>{
        if (mode === 'test') {
            router.push({
                pathname: '/test',
                query:{ start, end }
            })
        }
        else{
            router.push({
                pathname: '/edit/preview',
                query:{ start, end }
            })
        }
    }

    return(
        <div>
            {
                simpleArray.map((item, index)=>{
                    
                    return(
                        <div key={index} className={styles.set} 
                            onClick={()=> handleClick(index * partition, (index + 1) * partition - 1)}
                        >
                            {`${index * partition + 1} to ${(index + 1) * partition}`}
                        </div>
                    )

                })
            }
            {
                remainder > 0 &&
                <div className={styles.set}
                    onClick={()=> handleClick(
                        (data ? (data.length - remainder - 1) : 0), (data ? data.length - 1 : 0)
                    )}
                >
                    {`${data && data.length - remainder} to ${data && data.length}`}
                </div>
            }
        </div>
    )
}

export default QuizSet;