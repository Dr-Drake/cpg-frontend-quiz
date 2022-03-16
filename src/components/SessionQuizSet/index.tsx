import { useRouter } from 'next/router';
import React from 'react';
import { QuizSession } from '../../types/quiz';
import styles from './sessionQuizSet.module.css';

const SessionQuizSet: React.FC<any> = ()=>{

    // Hooks
    const router = useRouter();

    // Handlers
    const handleClick = (start: number, end: number)=>{
        router.push({
            pathname: '/test',
            query:{ start, end }
        })
    }


    // State
    const [activeSession, setActiveSession] = React.useState<QuizSession>();

    // First load session
    React.useEffect(()=>{
        let sessions = localStorage.getItem('cpg_sessions');

        if (sessions) {
            let parsedSessions: QuizSession = JSON.parse(sessions);
            setActiveSession(parsedSessions);
        }
    },[])

    return(
        <div>
            {
                activeSession &&
                Object.keys(activeSession).map((key, index)=>{
                    let query: { start: string; end: string; } = JSON.parse(key);
                    let startIndex: number = parseInt(query.start);
                    let endIndex: number = parseInt(query.end);

                    return(
                        <div key={index} className={styles.set} 
                            onClick={()=> handleClick(startIndex, endIndex)}
                        >
                            {`${startIndex + 1} to ${endIndex + 1}`}
                        </div>
                    )

                })
            }
        </div>
    )
}

export default SessionQuizSet;