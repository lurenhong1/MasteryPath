import { useLocation, useNavigate } from "react-router";
import type { SessionEndReason, SessionAlreadyEndedErrorResponse } from "../../types";
import "./SessionEndedPage.css";

function SessionEndedPage() {
    const location = useLocation();
    const details = location.state as SessionAlreadyEndedErrorResponse | null;

    const endReasonTitles: Record<SessionEndReason, string> = {
        expired: "Session expired",
        user_ended: "Session ended",
        maximum_questions_reached: "Session complete"
    };
    const endReasonMessages: Record<SessionEndReason, string> = {
        expired: "This practice session expired before it was completed.",
        user_ended: "This practice session was ended manually.",
        maximum_questions_reached:
            "This practice session ended after reaching the maximum number of questions."
    };

    const title = details
        ? endReasonTitles[details.endReason]
        : "Session ended";
    const message = details
        ? endReasonMessages[details.endReason]
        : "This practice session is no longer available.";

    const navigate = useNavigate();

    return (
        <>
            <div className="header">
                <h1 className="header-text">{title}</h1>
            </div>
            <main className="session-ended-main">
                <h2>
                    {message}
                </h2>
                <button
                    className="btn"
                    style={{justifySelf: "center"}}
                    type="button"
                    onClick={() => navigate("/concept-selection")}
                >
                    Return to concept selection page
                </button>
            </main>
        </>
    )
}

export default SessionEndedPage;
