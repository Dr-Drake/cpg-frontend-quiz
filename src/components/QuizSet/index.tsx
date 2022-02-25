import { useRouter } from 'next/router';
import React from 'react';
import { useQuiz } from '../../services/quiz';
import { Quiz } from '../../types/quiz';
import styles from './quizSet.module.css';

const QuizSet: React.FC<any> = ()=>{

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
        router.push({
            pathname: '/test',
            query:{ start, end }
        })
    }

    return(
        <div>
            {
                simpleArray.map((item, index)=>{
                    if (index === (parts - 1)) {
                        return(
                            <div key={index} className={styles.set}
                                onClick={()=> handleClick(
                                    (data ? data.length - remainder : 0), (data ? data.length : 0)
                                )}
                            >
                                {`${data && data.length - remainder} to ${data && data.length}`}
                            </div>
                        )
                    }

                    return(
                        <div key={index} className={styles.set} 
                            onClick={()=> handleClick(index * partition, (index + 1) * partition - 1)}
                        >
                            {`${index * partition + 1} to ${(index + 1) * partition}`}
                        </div>
                    )

                })
            }
        </div>
    )
}

export default QuizSet;