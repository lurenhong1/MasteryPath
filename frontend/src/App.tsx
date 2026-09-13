import {Link, Route, Routes} from 'react-router'
import ConceptSelectionPage from './pages/ConceptSelectionPage/ConceptSelectionPage'
import './App.css'

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
      </Routes>
  )
}

export default App
