import type {GetQuestionResponse} from "../types.ts";

export async function getPracticeQuestionState(sessionID: string): Promise<GetQuestionResponse> {
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
        throw new Error("Failed to get question.");
    }

    return await response.json() as Promise<GetQuestionResponse>
}
