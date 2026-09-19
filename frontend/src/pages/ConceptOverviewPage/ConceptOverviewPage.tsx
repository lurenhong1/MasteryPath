import {useNavigate, useParams} from "react-router";
import {createPracticeSession} from "../../api/overviewApi.ts";

function ConceptOverviewPage() {
    const {conceptID} = useParams<{conceptID: string}>();

    const navigate = useNavigate();

    async function handleStartPractice() {
        if (!conceptID) {
            return;
        }
        try {
            const result = await createPracticeSession(conceptID);
            navigate(`/practice/${result.id}`);
        } catch(error) {
            console.error("Failed to start practice session: ", error)
        }
    }

    return (
        <>
            <div className="header">
                <h1 className="header-text">Concept Overview</h1>
            </div>
            <main>
                {/* A simple dashboard display that navigate to dashboard page on click */}
                {/* A discussion board or a todo list */}
                <button
                    onClick={handleStartPractice}
                >
                    Start Practice
                </button>
            </main>
        </>
    )
}

export default ConceptOverviewPage
