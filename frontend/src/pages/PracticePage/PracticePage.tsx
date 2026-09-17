import {useParams} from "react-router";

import type {
    Question,
    PracticeProgress,
    Choice,
    SubmitAnswerRequest,
    QuestionAnswer
} from "../../types.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {
    getPracticeQuestionState,
    submitQuestion
} from "../../api/practiceApi.ts";
import Modal from "../../components/Modal/Modal.tsx";
import {SessionAlreadyEndedError} from "../../api/practiceApiErrors.ts";

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

    const [question, setQuestion] = useState<Question | null>(null);
    const [progress, setProgress] = useState<PracticeProgress | null>(null);

    const [correctness, setCorrectness] = useState<boolean>(true);
    const [feedback, setFeedback] = useState<string>("");

    const [showFeedback, setShowFeedback] = useState<boolean>(false);
    const [showCompletion, setShowCompletion] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [numericAnswer, setNumericAnswer] = useState<string>("");
    const [choiceAnswer, setChoiceAnswer] = useState<string[]>([]);

    //update the selected choice
    function setSingleChoice(choice: Choice) {
        setChoiceAnswer([choice.id]);
    }

    // Update the selected multiple choice
    function setMultipleChoice(choice: Choice) {
        setChoiceAnswer(current => current.includes(choice.id)
            ? current.filter(item => item !== choice.id)
            : [...current, choice.id]
        )
    }

    // Build the answer required by backend
    function buildAnswer(): QuestionAnswer | null {
        if (!question) {
            return null;
        }
        switch (question.questionType) {
            case "numeric":
                if (numericAnswer === "") {
                    return null;
                }
                return {
                    type: "numeric",
                    value: Number(numericAnswer)
                };
            case "single-choice":
                const selectedChoiceId = choiceAnswer[0];
                if (!selectedChoiceId) {
                    return null;
                }
                return {
                    type: "single-choice",
                    selectedChoiceId: selectedChoiceId
                }
            case "multiple-choice":
                if (choiceAnswer.length === 0) {
                    return null;
                }
                return {
                    type: "multiple-choice",
                    selectedChoiceIds: choiceAnswer
                }
        }
    }

    // Load the current question.
    function handleQuestionLoad(question: Question, progress: PracticeProgress) {
        setQuestion(question);
        setProgress(progress);
    }

    // Load the feedback of previous question
    function handleFeedbackLoad(correctness: boolean, feedback: string) {
        setCorrectness(correctness);
        setFeedback(feedback);
    }

    // Submit the question and update the question if not completed.
    async function handleQuestionSubmit() {
        if (!sessionID || !question) {
            return;
        }
        const answer = buildAnswer();

        if (!answer) {
            console.error("An answer must be entered or selected");
            return;
            //     TODO: Implement empty answer behavior
        }
        try {
            setSubmitting(true);
            const request: SubmitAnswerRequest = {
                questionId: question.id,
                answer: answer
            }
            const result = await submitQuestion(sessionID, request)
            setNumericAnswer("");
            setChoiceAnswer([]);
            handleFeedbackLoad(result.correct, result.feedback);
            setShowFeedback(true);
            const status = result.status;
            if (status === "active") {
                handleQuestionLoad(result.question, result.progress);
            } else if (status === "ended") {
                setShowCompletion(true);
                setProgress(result.progress);
            }
        } catch (error) {
            handlePracticeError(error);
        } finally {
            setSubmitting(false);
        }
    }

    function handlePracticeError(error: unknown) {
        if (error instanceof SessionAlreadyEndedError) {
            console.log("Navigating")
            navigate(`/practice/${sessionID}/ended`, {
                replace: true,
                state: error.details
            });
            return;
        }
        console.error("Practice request failed: ", error);
    }

    // Load the current question on entering the page.
    useEffect(() => {
        if (!sessionID) {
            return;
        }

        async function loadQuestion(id: string) {
            try {
                const result = await getPracticeQuestionState(id);
                handleQuestionLoad(result.question, result.progress);
            } catch(error) {
                handlePracticeError(error)
            }
        }

        void loadQuestion(sessionID);
    }, [sessionID]);

    if (question === null || progress === null) {
        return <p>Loading Questions...</p>;
    }

    return (
        <>
            <div className="header">
                <h1 className="header-text">Practice</h1>
            </div>
            <main>
                {showCompletion
                    ? <div className="complete-section">
                        <h2>Congratulation! You have completed this practice session! Click the button below to return to the concept selection page.</h2>
                        <button
                            className="btn"
                            onClick={() => navigate("/concept-selection")}
                        >
                            Return
                        </button>
                    </div>
                    : <div className="question-section">
                        <h2 className="question-body">Question {progress.currentQuestion}/{progress.maximumQuestion}</h2>
                        <h3>{question.body}</h3>
                        {question.questionType === "numeric"
                            ? <div>
                                <input
                                    type="number"
                                    value={numericAnswer}
                                    onChange={(event) => {
                                        setNumericAnswer(event.target.value)
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
                        <button
                            className="btn"
                            onClick={handleQuestionSubmit}
                            disabled={submitting}
                        >
                            Submit
                        </button>
                    </div>

                }
                <Modal
                    open={showFeedback}
                    header={
                        <>
                            {correctness
                                ? <h2>Correct</h2>
                                : <h2>Incorrect</h2>
                            }
                        </>
                    }
                    onClose={() => setShowFeedback(false)}
                >
                    <span>{feedback}</span>
                </Modal>

            </main>
        </>
    )
}

export default PracticePage
