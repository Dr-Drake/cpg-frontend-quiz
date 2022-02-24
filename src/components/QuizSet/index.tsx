import React from 'react';
import { useQuiz } from '../../services/quiz';
import { Quiz } from '../../types/quiz';
import styles from './quizSet.module.css';

const QuizSet: React.FC<any> = ()=>{

    const { data, isLoading, isError } = useQuiz();

    let remainder = 0;
    let parts = 0;

    if (data) {
        remainder = data.length % 50;
        parts = (data.length - remainder) / 50;
    }

    // Generate array
    let simpleArray = [];
    for (let i = 0; i < parts; i++) {
        simpleArray.push(i);
    }

    return(
        <div>
            {
                simpleArray.map((item, index)=>{
                    if (index === (parts - 1)) {
                        return(
                            <div className={styles.set}>
                                {`${data && data.length - remainder} to ${data && data.length}`}
                            </div>
                        )
                    }

                    return(
                        <div className={styles.set}>
                            {`${index * 50 + 1} to ${(index + 1) * 50}`}
                        </div>
                    )

                })
            }
        </div>
    )
}

export default QuizSet;