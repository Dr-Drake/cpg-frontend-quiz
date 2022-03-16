export interface Choice{
    id?: string;
    label: string;
    text: string;
}

export interface Quiz{
    id: string;
    question: string;
    choices: Choice[];
    correctAnswer?: Choice;
}

export interface QuizSession{
    [index: string]:{
        step: number;
        choiceStep: number;
        answers: string[];
    }
}
