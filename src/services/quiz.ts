import axios, { AxiosError, AxiosResponse } from 'axios';
import useSwr from 'swr';
import { Quiz } from '../types/quiz';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

export const useQuiz = () =>{
    const fetcher = (url: string) => 
    axios.get(baseUrl + url).then((response: AxiosResponse<Quiz[]>)=> response.data);

    const { data, error, mutate } = useSwr(`/quiz`, fetcher);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    }
}

interface FetchQuizResult{
    data?: Quiz[];
    error?: any;
}
export const fetchQuiz = ()=>{
    const willFetchQuiz = new Promise<FetchQuizResult>((resolve)=>{
        axios.get(baseUrl + '/quiz')
        .then((response: AxiosResponse<Quiz[]>)=>{
            resolve({ data: response.data});
        })
        .catch((err)=>{
            resolve({ error: err })
        })
    })

    return willFetchQuiz
}