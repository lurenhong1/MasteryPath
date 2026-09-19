import type {
    ActiveQuestionState,
    SubmitAnswerRequest,
    SubmitAnswerResponse
} from "../types.ts";
import {throwPracticeApiError} from "./practiceApiErrors.ts";

export async function getPracticeQuestionState(sessionID: string): Promise<ActiveQuestionState> {
    const response = await fetch(
        `/api/practice-sessions/${sessionID}`,
        {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }
    )

    if (!response.ok) {
        await throwPracticeApiError(response);
    }

    return await response.json() as Promise<ActiveQuestionState>
}

export async function submitQuestion(sessionID: string, request: SubmitAnswerRequest) {
    const response = await fetch(
        `/api/practice-sessions/${sessionID}/submissions`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(request)
        }
    )

    if(!response.ok) {
        await throwPracticeApiError(response);
    }

    return await response.json() as Promise<SubmitAnswerResponse>
}
