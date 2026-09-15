import {useParams} from "react-router";

import type {Question, PracticeProgress, Choice} from "../../types.ts";
import {useEffect, useState} from "react";

// POST /api/concepts/{conceptId}/practice-sessions
//     → creates the session
//
// GET  /api/practice-sessions/{sessionId}
//     → get the first question
//
// POST /api/practice-sessions/{sessionId}/submissions
//     → records answer
//     → grades and analyzes it
//     → returns feedback and next question
//
// POST /api/practice-sessions/{sessionId}/complete
//     → ends the session without submit

function PracticePage() {
    const {conceptID} = useParams();

    const [question, setQuestion] = useState<Question>(
        {
            id: "1",
            body: "What is the result of 1 + 1?",
            questionType: "single-choice",
            selections: [
                {
                    id: '1',
                    body: '2'
                },
                {
                    id: '2',
                    body: '4'
                }
                ]

        }
    );
    const [progress, setProgress] = useState<PracticeProgress>(
        {
            currentQuestion: '1',
            maximumQuestion: '20'
        }
    )
    const [selected, setSelected] = useState<string[]>([])

    function setSingleChoice(choice: Choice) {
        setSelected([choice.id]);
    }

    function setMultipleChoice(choice: Choice) {
        setSelected(current => current.includes(choice.id)
            ? current.filter(item => item !== choice.id)
            : [...current, choice.id]
        )
    }

    useEffect(() => {
        console.log(selected);
    }, [selected]);

    return (
        <>
            <div className="header">
                <h1 className="header-text">Practice</h1>
            </div>
            <main>
                <div className="question-section">
                    <h2 className="question-body">Question {progress.currentQuestion}</h2>
                    <h3>{question.body}</h3>
                    {/* display different options depend on question type */}
                    {question.questionType === "numeric"
                        ? <div>
                            <input
                                type="number"
                            />
                        </div>
                        : <div>
                            {question.selections && question.selections.map(choice => (
                                <div key={choice.id}>
                                    <input
                                        type={question.questionType === "single-choice"
                                            ? "radio"
                                            : "checkbox"
                                        }
                                        name={`question-${question.id}`}
                                        value={choice.id}
                                        checked={selected.includes(choice.id)}
                                        onChange={() => {
                                            if (question.questionType === "single-choice") {
                                                setSingleChoice(choice);
                                            } else {
                                                setMultipleChoice(choice);
                                            }
                                        }}
                                    />
                                    <span>{choice.body}</span>
                                </div>
                                )
                            )}
                        </div>
                    }
                </div>
            </main>
        </>
    )
}

export default PracticePage
