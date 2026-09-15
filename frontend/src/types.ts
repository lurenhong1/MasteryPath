export type Concept = {
    id: string
    name: string
    description: string
}

export type Question = {
    id: string
    body: string
    questionType: "numeric" | "multiple-choice" | "single-choice"
    selections: Choice[] | null
}

export type Choice = {
    id: string
    body: string
}

export type PracticeProgress = {
    currentQuestion: number
    maximumQuestion: number
}

export type PracticeSessionResponse = {
    id: string
    status: "active" | "ended"
}

export type GetQuestionResponse =
    | {
        status: "active";
        question: Question;
        progress: PracticeProgress;
    }
    | {
        status: "ended";
        question: null;
        progress: PracticeProgress;
        endReason:
            | "expired"
            | "user_ended"
            | "maximum_questions_reached";
};
