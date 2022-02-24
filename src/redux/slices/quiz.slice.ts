import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz } from "../../types/quiz";


export interface QuizState{
    quizzes: Quiz[][];
}

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {},
    reducers:{
        loadQuiz: (state, action: PayloadAction<Quiz[]>)=>{
            return{
                ...state,
                quiz: action.payload
            }
        }
    }
});

export const { loadQuiz }= quizSlice.actions;
 
const quizReducer = quizSlice.reducer
export default quizReducer;