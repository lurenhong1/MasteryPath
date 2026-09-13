import {useState} from "react";
import './ConceptSelectionPage.css'

type Concept = {
    cid: string
    name: string
    description: string
}

function ConceptSelectionPage () {
    const [concepts, setConcepts] = useState<Concept[]>(
        [
            {
                cid: '1',
                name: 'Algebra',
                description: 'Learn equations and variables',
            },
            {
                cid: '2',
                name: 'Geometry',
                description: 'Learn shapes and measurements',
            },
        ]
    )

    function handleSelectConcept(cid: string) {
        console.log(`Selected Concept: ${cid}`)
    }

    return (
        <>
            <div className="header">
                <h1 className="header-text">Select Concepts</h1>
            </div>
            <main>
                <div className="concept-card-container">
                    {concepts.map((concept) => (
                        <button
                            type="button"
                            key={concept.cid}
                            className="concept-card"
                            onClick={() => {handleSelectConcept(concept.cid)}}
                        >
                            <span className="concept-card-name">{concept.name}</span>
                            <span className="concept-card-description">{concept.description}</span>
                        </button>
                    ))}
                </div>

            </main>
        </>
    )
}

export default ConceptSelectionPage
