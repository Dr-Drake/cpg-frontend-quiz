import { Choice } from "./quiz";

export interface UpdateQuizRequest{
    question: string;
    choices: Choice[];
    answer?: Choice;
}