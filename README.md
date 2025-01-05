# LLM Evaluation Back-end

This is a back-end that allows you to evaluate LLM's output easily. It allows to be able to send request to mutliple LLMS and compare and contrast the output. It is a robust implementation that handles accordingly request limits for API's on the LLMs, and also the failures with retries, and backoffs. It also includes Queue implementation to have a robust implementation.


## Installation

Before proceeding with the installation, ensure you have the following requirements:

- Docker installed on your machine. You can download and install Docker from [here](https://www.docker.com/get-started).
- Node.js and npm installed on your machine. You can download and install Node.js from [here](https://nodejs.org/).

Follow these steps for the initial setup:

1. **Navigate to the Backend directory:**

    If you're not already in the Backend directory, navigate to it using the `cd` command:

    ```bash
    cd back-end
    ```

2. **Install dependencies by running:**

    ```bash
    npm install
    ```

3. **Populate the parameters in the `.env` file by copying the sample and filling in the fields:**

    ```bash
    cp .env.sample .env
    ```

    Then, fill in the variables with your desired values.

4. **Finally, start the application using Docker Compose:**

    ```bash
    docker-compose up
    ```

    sometimes you might need to rebuild it to do so use the following command
    ```bash
    docker-compose up --build
    ```


## Usage

Once the setup is complete, use the following command to start the application, which will be hosted on localhost port 8081:

Also, find the Swagger documentation at the route `/api`, for example, `http://localhost:3002/api/`.



## Future Improvements

- Make it handle more accuracy analyzing methods like partial match, llm evaluation, json schema validation, function calling
- Add more llm options in addition to groq, like openai, gemini, and claude
- Add more customization to how we call the API, like temprature, system roles, and even simulate a chat (automatically across different llms)


## Contributing

Contributions are welcome! Please adhere to the guidelines outlined in the main README.md file. Feel free to submit pull requests and contribute to the improvement of the project. Thank you for your support!