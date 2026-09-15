import {useNavigate, useParams} from "react-router";

function ConceptOverviewPage() {
    const {conceptID} = useParams();

    const navigate = useNavigate();

    return (
        <>
            <div className="header">
                <h1 className="header-text">Concept Overview</h1>
            </div>
            <main>
                {/* A simple dashboard display that navigate to dashboard page on click */}
                {/* A discussion board or a todo list */}
                <button
                    onClick={() => navigate(`/concept/${conceptID}/practice`)}
                >
                    Start Practice
                </button>
            </main>
        </>
    )
}

export default ConceptOverviewPage
