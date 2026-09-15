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
    currentQuestion: string
    maximumQuestion: string
}
