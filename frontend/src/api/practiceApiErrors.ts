import type {
    SessionAlreadyEndedErrorResponse,
    SessionEndReason
} from "../types.ts";

export class SessionAlreadyEndedError extends Error {
    readonly details: SessionAlreadyEndedErrorResponse;

    constructor(details: SessionAlreadyEndedErrorResponse) {
        super(details.message);
        this.name = "SessionALreadyEndedError";
        this.details = details
    }
}

function isSessionEndReason(value: unknown): value is SessionEndReason {
    return (
        value === "expired" ||
        value === "user_ended" ||
        value === "maximum_questions_reached"
    );
}

function isSessionAlreadyEndedResponse(value: unknown): value is SessionAlreadyEndedErrorResponse {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const response = value as Record<string, unknown>;

    return (
        response.code === "SESSION_ENDED" &&
        response.status === "ended" &&
        typeof response.message === "string" &&
        isSessionEndReason(response.endReason)
    );
}

export async function throwPracticeApiError(response: Response): Promise<never> {
    const body: unknown = await response.json().catch(() => null);

    if (isSessionAlreadyEndedResponse(body)) {
        throw new SessionAlreadyEndedError(body);
    }

    throw new Error(`Practice request failed with status ${response.status}`)
}
