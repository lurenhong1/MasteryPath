import {http, HttpResponse} from "msw";
import type {PracticeSessionResponse} from "../types";

const activeQuestion = {
    status: "active",
    question: {
        id: "question-1",
        body: "What is 2 + 2?",
        questionType: "numeric",
        selections: null
    },
    progress: {
        currentQuestion: 1,
        maximumQuestion: 2
    }
};

export const handlers = [
    http.post(
        "/api/concepts/:conceptID/practice-sessions",
        ({params}) => {
            const sessionID =
                params.conceptID === "2"
                    ? "ended"
                    : "active";

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

            return HttpResponse.json(activeQuestion);
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
                feedback: "Correct."
            });
        }
    )
];
