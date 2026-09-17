import {Link, Route, Routes} from 'react-router'
import ConceptSelectionPage from './pages/ConceptSelectionPage/ConceptSelectionPage'
import ConceptOverviewPage from "./pages/ConceptOverviewPage/ConceptOverviewPage.tsx";
import PracticePage from "./pages/PracticePage/PracticePage.tsx";
import './App.css'
import SessionEndedPage from "./pages/SessionEndedPage/SessionEndedPage.tsx";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                <>
                    <div className="header">
                        <h1 className="header-text">Main page</h1>
                    </div>
                    <main>
                        <nav>
                            <Link to="/concept-selection">
                                Get Started
                            </Link>
                        </nav>
                    </main>
                </>
            }
            />
            <Route
                path="/concept-selection"
                element={<ConceptSelectionPage />}
            />
            <Route
                path="/concept/:conceptID"
                element={<ConceptOverviewPage />}
            />
            <Route
                path="/practice/:sessionID"
                element={<PracticePage />}
            />
            <Route
                path="/practice/:sessionID/ended"
                element={<SessionEndedPage />}
            />
            {/* TODO: Implement a session-not-found page for invalid or missing session IDs. */}
            {/* TODO: Implement a session-ended page for expired, user-ended, and completed sessions. */}

      </Routes>
  )
}

export default App
