# MasteryPath

MasteryPath is an adaptive learning platform designed to help students build genuine, measurable understanding. It presents targeted practice questions, observes how each student performs, and continuously estimates mastery at the topic and concept level.

Rather than relying only on overall accuracy, MasteryPath is intended to learn from signals such as question difficulty, recent performance, response time, repeated attempts, and hint usage. These signals allow the platform to identify areas of strength, expose knowledge gaps, and recommend a useful next question at the right level of difficulty.

## Project goals

- Deliver focused practice based on each student's current understanding.
- Track learning progress separately for individual topics and concepts.
- Provide immediate answer feedback and clear mastery insights.
- Build an interpretable mastery baseline before introducing more advanced models.
- Support an end-to-end machine-learning workflow from interaction data to model serving.
- Maintain a clean separation between the web client, application API, database, and ML pipeline.

## Planned technology stack

- **Frontend:** React and TypeScript
- **Backend:** Python with a REST API framework
- **Database:** PostgreSQL
- **Machine learning:** Python-based feature engineering, training, evaluation, and inference
- **Infrastructure:** Docker for consistent local development and deployment

## Initial product scope

The first release will focus on a complete learning loop: a student selects a topic, receives a question, submits an answer, sees feedback, and receives an updated mastery estimate. The initial estimator will remain simple and explainable while the platform collects the structured interaction data needed for a trained mastery model.

The repository currently contains the project foundation only. Application code, database migrations, tests, model training, and deployment configuration will be added in later development stages.
