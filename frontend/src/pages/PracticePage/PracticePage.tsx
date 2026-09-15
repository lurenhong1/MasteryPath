import {useParams} from "react-router";

import type {
    Question,
    PracticeProgress,
    Choice,
    GetQuestionResponse
} from "../../types.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {getPracticeQuestionState} from "../../api/practiceApi.ts";

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
    const {sessionID} = useParams<{sessionID: string}>();
    const navigate = useNavigate();

    const [question, setQuestion] = useState<Question>(
        {
            id: "1",
            body: "What is the result of 1 + 1?",
            questionType: "numeric",
            selections: [
                {
                    id: "1",
                    body: '2'
                },
                {
                    id: "2",
                    body: '4'
                }
            ]
        }
    );
    const [progress, setProgress] = useState<PracticeProgress>(
        {
            currentQuestion: 1,
            maximumQuestion: 20
        }
    )
    const [numericAnswer, setNumericAnswer] = useState<number | undefined>(undefined);
    const [choiceAnswer, setChoiceAnswer] = useState<string[]>([]);

    function setSingleChoice(choice: Choice) {
        setChoiceAnswer([choice.id]);
    }

    function setMultipleChoice(choice: Choice) {
        setChoiceAnswer(current => current.includes(choice.id)
            ? current.filter(item => item !== choice.id)
            : [...current, choice.id]
        )
    }

    function handleLoadQuestion(result: GetQuestionResponse) {
        if (result.status === "ended") {
            navigate("/practice/session-ended", {
                replace: true,
                state: {
                    progress: result.progress,
                    reason: result.endReason
                }
            });
            return;
        }
        setQuestion(result.question);
        setProgress(result.progress);
    }

    useEffect(() => {
        if (!sessionID) {
            return;
        }

        async function loadQuestion(id: string) {
            try {
                const result = await getPracticeQuestionState(id);
                handleLoadQuestion(result);
            } catch(error) {
                console.log("Failed to get question for session: ", error);
            }
        }

        void loadQuestion(sessionID);
    }, [sessionID]);

    return (
        <>
            <div className="header">
                <h1 className="header-text">Practice</h1>
            </div>
            <main>
                <div className="question-section">
                    <h2 className="question-body">Question {progress.currentQuestion}</h2>
                    <h3>{question.body}</h3>
                    {question.questionType === "numeric"
                        ? <div>
                            <input
                                type="number"
                                value={numericAnswer}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setNumericAnswer(value === "" ? undefined : Number(value))
                                }}
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
                                        checked={choiceAnswer.includes(choice.id)}
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
