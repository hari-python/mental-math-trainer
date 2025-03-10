# Mental Math Trainer

## Overview

The Mental Math Trainer is a web application designed to help users improve their mental arithmetic skills. It provides a timed challenge where users solve math problems of increasing difficulty. The application tracks correct answers and mistakes, adjusting the level accordingly.

## Features

-   **Dynamic Level Adjustment**: The game adjusts the difficulty level based on the user's performance. If the user answers enough questions correctly with few mistakes, the level increases. If the user struggles, the level decreases.
-   **Timed Challenges**: Each level presents a 60-second challenge to solve as many math problems as possible.
-   **Mixed Operations**: Problems include addition, subtraction, multiplication, and division to provide a comprehensive mental workout.
-   **Performance Tracking**: The game tracks the number of correct answers and mistakes to provide feedback and adjust the difficulty.
-   **Responsive Design**: The application is designed to work on various screen sizes, providing a consistent experience across devices.

## Technologies Used

-   **React**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that enhances code quality and maintainability.
-   **Vite**: A build tool that provides fast development and optimized builds.
-   **Tailwind CSS**: A utility-first CSS framework for styling the application.
-   **Lucide React**: A library of beautiful, consistent icons.

## Getting Started

### Prerequisites

-   Node.js and npm installed on your machine.

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

1.  Start the development server:

    ```bash
    npm run dev
    ```

2.  Open your browser and navigate to the address provided by Vite (usually `http://localhost:5173`).

## How to Play

1.  **Start a Level**: Click the "Start Level" button to begin a new challenge.
2.  **Solve Problems**: Enter your answer in the input field and click "Submit".
3.  **Track Progress**: Watch the timer and keep an eye on your correct answers and mistakes.
4.  **Level Completion**: If you meet the level requirements (minimum correct answers and maximum mistakes) before the time runs out, you advance to the next level. Otherwise, you can retry the level.

## Level Information

Each level has specific requirements:

-   **Mixed Operations**: Problems include addition, subtraction, multiplication, and division.
-   **Answer Range**: Answers will be between 0 and a target range that increases with the level.
-   **Time Limit**: 60 seconds.
-   **Minimum Correct Answers**: A minimum number of questions must be answered correctly to pass the level.
-   **Maximum Mistakes**: A maximum number of mistakes allowed to pass the level.

## Contributing

Contributions are welcome! If you have suggestions for new features or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
