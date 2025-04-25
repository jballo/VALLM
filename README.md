# VALLM - Vision Assisted Large Language Model

## Overview

VALLM (Vision Assisted Large Language Model) is a web application that helps users determine the most suitable Large Language Model (LLM) for their website or platform needs. Users can input URLs, provide test cases, and evaluate the responses from different LLMs to make informed decisions. The application aims to streamline the LLM selection process, saving developers time and resources.

![image](https://gw3qhbh6tl.ufs.sh/f/Q48fIVJi2U4uBGbfPyQILryJKSD3OdXv0UQio5Eaezxjcbhl)

## Features

-   **LLM Comparison:** Allows users to compare the performance of different LLMs on the same input data.
-   **URL Input:** Accepts URLs as input for testing LLM performance on real-world web content.
-   **Test Case Management:** Enables users to define and manage test cases for consistent evaluation.
-   **Response Evaluation:** Provides a user-friendly interface for judging and comparing LLM responses.

## Tech Stack

-   **Frontend:** Next.js, Typescript, TailwindCSS
-   **Backend:** Flask (Python)
-   **Database:** PostgreSQL
-   **APIs:** Groq, OpenAI
-   **Deployment:** Vercel (Frontend), [Choose your own adventure for backend - e.g., Render, AWS, GCP]

## Setup Instructions

1.  **Clone the Repository**

    ```sh
    git clone <repository_url>
    cd VALLM
    ```

2.  **Install Dependencies**

    ```sh
    npm install  # Install frontend dependencies
    cd backend
    pip install -r requirements.txt # Install backend dependencies
    ```

3.  **Environment Variables Setup**

    *   These environment variables are for local development. For deployment, additional variables may be required depending on the hosting provider and services used.
    *   Create a `.env.local` file in the root directory with:

        ```
        NEXT_PUBLIC_API_ENDPOINT=your_api_endpoint
        NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
        NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
        SCRAPE_ENDPOINT=your_scrape_endpoint
        CREATE_EMBEDDING_ENDPOINT=your_create_embedding_endpoint
        RAG_RETRIEVAL_ENDPOINT=your_rag_retrieval_endpoint
        ```

    *   Create a `.env` file in the `backend` directory with:

        ```
        API_KEY=your_api_key
        DATABASE_URL=your_database_url
        PINECONE_API_KEY=your_pinecone_api_key
        GROQ_API_KEY=your_groq_api_key
        OPENAI_API_KEY=your_openai_api_key
        BRIGHT_DATA_AUTH=your_bright_data_auth
        ```

    **Important Notes:**

    *   Replace `your_api_endpoint`, `your_api_key`, `your_database_url`, `your_pinecone_api_key`, `your_groq_api_key`, `your_openai_api_key`, and `your_bright_data_auth` with your actual credentials.
    *   The `API_KEY` in both `.env.local` and `.env` should be the same for authentication purposes.

4.  **Run the Application**

    *   Start the Backend:

        ```sh
        cd backend
        python main.py
        ```

    *   Start the Frontend:

        ```sh
        npm run dev
        ```

5.  **Access the Application**

    Open [http://localhost:3000](http://localhost:3000) in your web browser.

## Development Considerations

*   **API Integration:** Implement a robust and well-documented API layer for communication between the frontend and backend. Ensure proper error handling and data validation.
*   **State Management:** For complex state management, consider using Zustand or Redux Toolkit. However, start simple and only introduce state management when necessary.
*   **Testing:** Implement unit and integration tests to ensure code quality and prevent regressions. Use Jest and React Testing Library for testing React components and pytest for backend testing.


## Future Enhancements

*   **CI/CD:** Set up a CI/CD pipeline for automated testing and deployment using tools like GitHub Actions, GitLab CI, or CircleCI.
*   **Rate Limiting:** Implement rate limiting on your API endpoints to prevent abuse.
*   **Caching:** Implement caching to improve performance and reduce the load on your LLM APIs.

## Troubleshooting

*   **API Key Errors:** Verify that your API keys in the `.env` files are correct and that you have sufficient credits to use the LLM APIs.
*   **Database Connection Errors:** Verify that your PostgreSQL credentials in the `.env` file are correct and that your database is running.
*   **Dependency Issues:** Ensure that all dependencies are installed correctly by running `npm install` in the frontend and `pip install -r requirements.txt` in the backend.

## Additional Notes

*   This setup is for local development. For production deployments, you'll need to use a proper hosting provider and configure your environment variables and webhooks accordingly.
*   Make sure your API keys are valid and that you have sufficient credits to use the LLM APIs.