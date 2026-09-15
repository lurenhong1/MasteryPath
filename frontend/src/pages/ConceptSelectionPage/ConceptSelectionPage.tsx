import {useState} from "react";
import {useNavigate} from "react-router";
import './ConceptSelectionPage.css'

import type {Concept} from "../../types.ts";

function ConceptSelectionPage () {
    const [concepts, setConcepts] = useState<Concept[]>(
        [
            {
                id: '1',
                name: 'Algebra',
                description: 'Learn equations and variables',
            },
            {
                id: '2',
                name: 'Geometry',
                description: 'Learn shapes and measurements',
            },
        ]
    )

    const navigate = useNavigate();

    function handleSelectConcept(cid: string) {
        navigate(`/concept/${cid}`)
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
                            key={concept.id}
                            className="concept-card"
                            onClick={() => {handleSelectConcept(concept.id)}}
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
