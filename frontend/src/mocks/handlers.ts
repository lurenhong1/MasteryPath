import {http, HttpResponse} from "msw";
import type {PracticeSessionResponse} from "../types";

const activeQuestionNumeric = {
    status: "active",
    question: {
        id: "question-numeric",
        body: "What is 2 + 2?",
        questionType: "numeric",
        selections: null
    },
    progress: {
        currentQuestion: 1,
        maximumQuestion: 2
    }
};

const activeQuestionSingleSelection = {
    status: "active",
    question: {
        id: "question-selection",
        body: "What is 2 + 2?",
        questionType: "single-choice",
        selections: [
            {id: "1", body: "2 + 2 = 1"},
            {id: "2", body: "2 + 2 = 2"},
            {id: "3", body: "2 + 2 = 3"},
            {id: "4", body: "2 + 2 = 4"},
        ]
    },
    progress: {
        currentQuestion: 1,
        maximumQuestion: 2
    }
};

const activeQuestionMultipleSelection = {
    status: "active",
    question: {
        id: "question-selection",
        body: "What is 2 + 2?",
        questionType: "multiple-choice",
        selections: [
            {id: "1", body: "2 + 2 = 1"},
            {id: "2", body: "2 + 2 = 2"},
            {id: "3", body: "2 + 2 = 3"},
            {id: "4", body: "2 + 2 = 4"},
        ]
    },
    progress: {
        currentQuestion: 1,
        maximumQuestion: 2
    }
};

const sessionIDByConceptID: Record<string, string> = {
    "1": "activeNumeric",
    "2": "activeSelection1",
    "3": "activeSelection2",
    "4": "complete",
    "5": "ended",
    "6": "submit-ended"
};

export const handlers = [
    http.post(
        "/api/concepts/:conceptID/practice-sessions",
        ({params}) => {
            const conceptID = String(params.conceptID);
            const sessionID = sessionIDByConceptID[conceptID] ?? "activeNumeric";

            const response = {
                id: sessionID,
                status: "active"
            } satisfies PracticeSessionResponse;

            return HttpResponse.json(response, {
                status: 201
            });
        }
    ),

    http.get(
        "/api/practice-sessions/:sessionID",
        ({params}) => {
            if (params.sessionID === "ended") {
                return HttpResponse.json(
                    {
                        code: "SESSION_ENDED",
                        status: "ended",
                        message: "This session has expired.",
                        endReason: "expired"
                    },
                    {status: 410}
                );
            }
            if (params.sessionID === "activeNumeric") {
                return HttpResponse.json(activeQuestionNumeric);
            }
            if (params.sessionID === "activeSelection1") {
                return HttpResponse.json(activeQuestionSingleSelection);
            }
            if (params.sessionID === "activeSelection2") {
                return HttpResponse.json(activeQuestionMultipleSelection);
            }

            return HttpResponse.json(activeQuestionNumeric);
        }
    ),

    http.post(
        "/api/practice-sessions/:sessionID/submissions",
        ({params}) => {
            if (params.sessionID === "submit-ended") {
                return HttpResponse.json(
                    {
                        code: "SESSION_ENDED",
                        status: "ended",
                        message: "This session has already ended.",
                        endReason: "user_ended"
                    },
                    {status: 410}
                );
            }

            if (params.sessionID === "complete") {
                return HttpResponse.json({
                    status: "ended",
                    progress: {
                        currentQuestion: 2,
                        maximumQuestion: 2
                    },
                    endReason: "maximum_questions_reached",
                    correct: true,
                    feedback: "Correct. You completed the session."
                });
            }

            return HttpResponse.json({
                status: "active",
                question: {
                    id: "question-2",
                    body: "What is 3 + 3?",
                    questionType: "numeric",
                    selections: null
                },
                progress: {
                    currentQuestion: 2,
                    maximumQuestion: 2
                },
                correct: true,
                feedback: "You correctly determined that 2 + 2 = 4, and " +
                    "showing your progress by identifying the two groups, " +
                    "combining them, and counting the total demonstrates " +
                    "that you understand how addition represents putting " +
                    "quantities together rather than simply memorizing the " +
                    "answer. \nYour reasoning is clear and accurate, and " +
                    "as you continue practicing, keep showing each step in " +
                    "this way because it makes your thinking easy to " +
                    "follow, helps you catch mistakes, and builds a strong " +
                    "foundation for solving more challenging addition problems."
            });
        }
    )
];
