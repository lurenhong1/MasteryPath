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

    const [question, setQuestion] = useState<Question>({});
    const [progress, setProgress] = useState<PracticeProgress>({});

    const [correctness, setCorrectness] = useState<boolean>(true);
    const [feedback, setFeedback] = useState<string>("");

    const [showFeedback, setShowFeedback] = useState<boolean>(false);
    const [showCompletion, setShowCompletion] = useState<boolean>(false);

    const [numericAnswer, setNumericAnswer] = useState<number | undefined>(undefined);
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
        switch (question.questionType) {
            case "numeric":
                if (numericAnswer === undefined) {
                    return null;
                }
                return {
                    type: "numeric",
                    value: numericAnswer
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
        if (!sessionID) {
            return;
        }
        const answer = buildAnswer();

        if (!answer) {
            console.error("An answer must be entered or selected");
            return;
            //     TODO: Implement empty answer behavior
        }
        const request: SubmitAnswerRequest = {
            questionId: question.id,
            answer: answer
        }
        const result = await submitQuestion(sessionID, request)
        setNumericAnswer(undefined);
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
                console.error("Failed to get question for session: ", error);
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
                    <h2 className="question-body">Question {progress.currentQuestion}/{progress.maximumQuestion}</h2>
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
                    <button className="btn" onClick={handleQuestionSubmit}>Submit</button>
                </div>
            </main>
        </>
    )
}

export default PracticePage
