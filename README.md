# Anime & TV Series Tracker

## A full-stack web application to track your favorite anime and TV series, connect with other fans, and discover new shows.

This application provides a seamless experience for managing your watchlist, participating in community discussions, and getting personalized recommendations.

## Features

*   **Watchlist Management:** Easily add, update, and track your progress for anime and TV series. Filter your watchlist by status: Watching, Completed, On-Hold, Dropped, or Plan to Watch.
*   **Community Clubs:** Create and join clubs based on your favorite shows or genres. Participate in discussions, share your thoughts, and connect with other fans.
*   **Interactive Polls:** Create and vote on polls within your clubs to gauge community opinions.
*   **Spoiler Protection:** Discuss the latest episodes without worrying about spoilers, thanks to our built-in spoiler-tagging feature.
*   **User-Friendly Interface:** A clean and responsive design that works on any device. Includes a dark/light mode theme toggle for your viewing comfort.
*   **Admin Panel:** A dedicated dashboard for administrators to manage users, clubs, and comments.
*   **Analytics Dashboard:** Visualize your watch time and user activity with interactive charts.

## Technologies Used

*   **Frontend:** HTML5, CSS3, JavaScript
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas with Mongoose
*   **Authentication:** JSON Web Tokens (JWT)
*   **Development:** [Gemini CLI](https://gemini.google.com/), [ChatGPT](https://openai.com/chatgpt)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your machine.
*   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd anime-tracker-app
    ```
2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add the following variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```
3.  **Frontend Setup:**
    No special setup is required for the frontend. Simply open the `home.html` file in your browser.

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```
2.  **Open the frontend:**
    Navigate to the `frontend` directory and open `home.html` in your web browser.


