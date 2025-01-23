ToDoApp: A To-Do List Application

This is a simple to-do list application built with Express.js and Sequelize. Users can sign up, log in, and manage their personal to-do lists.

Prerequisites

    Node.js 14+
    npm (Node Package Manager)

Installation

    Clone this repository.

    Navigate to the project root directory:
    Bash

cd ToDoApp

Install dependencies for both the backend and frontend:
Bash

    npm install

    This will install all the necessary packages for the application to run.

Running the Application

    Start the backend server:
    Bash

node server.js

This will start the Express.js server and listen for incoming requests.

Start the frontend development server:
Bash

    cd frontend
    npm start

    This will start the development server for the frontend application. By default, it will be accessible at http://localhost:3000/ in your web browser.

Project Structure

ToDoApp/
├── backend/
│   ├── controllers/   # Contains controllers for handling user and task routes
│   ├── models/        # Contains Sequelize models for users and tasks
│   ├── middleware/    # Contains middleware for user authentication and authorization
│   ├── routes/         # Contains routes for user and task management
│   └── server.js       # Main entry point for the backend server
├── frontend/
│   ├── public/        # Contains static assets like CSS and JavaScript files
│   ├── src/            # Contains the React components for the frontend application
│   ├── package.json    # Contains project dependencies and scripts
│   └── index.html     # Main HTML file for the frontend application
├── README.md         # This file (you are reading it now)

User Authentication and Authorization

All routes related to task management are protected. Users need to be logged in to access these routes. The application uses Passport.js for user authentication with a local strategy (username and password).

Features

    User registration and login
    Create, read, update, and delete tasks
    Mark tasks as completed
    View all tasks for the logged-in user

Testing

Basic tests for models and routes are written using Mocha and Chai. You can run the tests using the following command:
Bash

npm test

Additional Notes

    This is a basic implementation of a to-do list application. You can extend it with additional features like deadlines, categories, and priority levels.
    The application uses Bootstrap for a responsive and user-friendly interface.
