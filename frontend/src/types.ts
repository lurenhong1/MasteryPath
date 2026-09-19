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

export type SessionStatus = "active" | "ended";

export type SessionEndReason =
    | "expired"
    | "user_ended"
    | "maximum_questions_reached";

export type AnswerEvaluation = {
    correct: boolean;
    feedback: string;
};

export type ActiveQuestionState = {
    status: "active";
    question: Question;
    progress: PracticeProgress;
};

export type CompletedPracticeState = {
    status: "ended";
    progress: PracticeProgress;
    endReason: "maximum_questions_reached";
};

export type QuestionAnswer =
    | {
        type: "numeric";
        value: number;
    }
        | {
        type: "single-choice";
        selectedChoiceId: string;
    }
        | {
        type: "multiple-choice";
        selectedChoiceIds: string[];
    };

export type SubmitAnswerRequest = {
    questionId: string;
    answer: QuestionAnswer;
};

export type SubmitAnswerResponse =
    | (ActiveQuestionState & AnswerEvaluation)
    | (CompletedPracticeState & AnswerEvaluation);

export type SessionAlreadyEndedErrorResponse = {
    code: "SESSION_ENDED";
    status: "ended";
    message: string;
    endReason: SessionEndReason;
};
