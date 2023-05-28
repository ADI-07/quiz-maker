export interface QuizQuestionsResponse {
    response_code: number;
    results: QuizQuestions[];
}

export interface QuizQuestions {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    answers: string[];
    selected_answer: string;
}