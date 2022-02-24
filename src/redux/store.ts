import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./slices/quiz.slice";

export const store = configureStore({
    reducer:{
        quiz: quizReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;