import type {PracticeSessionResponse} from "../types.ts";

export async function createPracticeSession(conceptID: string): Promise<PracticeSessionResponse> {
    const response = await fetch(
        `/api/concepts/${conceptID}/practice-sessions`,
        {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create a practice session.");
    }

    return await response.json() as Promise<PracticeSessionResponse>;
}
