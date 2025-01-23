ToDoApp

Overview

ToDoApp is a web application built with Express.js, Sequelize, and SQLite, allowing users to register, log in, and manage their personal to-do lists. This application demonstrates CRUD operations, user authentication, and responsive design using Bootstrap.

Features

User Authentication: Register, log in, and log out using Passport.js.

Task Management: Create, read, update, and delete tasks.

Task Ownership: Each user can only manage their own tasks.

Responsive Design: User-friendly interface powered by Bootstrap.

Installation and Setup

Backend

Clone the repository and navigate to the backend directory:

git clone <repository-url>
cd ToDoApp/backend

Install dependencies:

npm install

Create a .env file in the backend directory with the following variables:

NODE_ENV=development
PORT=8000
SESSION_SECRET=your_secret_key

Start the server:

node server.js

The backend will run on http://localhost:8000.

Frontend

Navigate to the frontend directory:

cd ToDoApp/frontend

Install dependencies:

npm install

Start the frontend application:

npm start

The frontend will run on http://localhost:3000.

API Endpoints

User Routes

POST /users/register: Register a new user.

POST /users/login: Log in and retrieve a token.

GET /users/logout: Log out the current user.

Task Routes

GET /tasks: Retrieve all tasks for the authenticated user.

POST /tasks: Create a new task.

PUT /tasks/:id: Update an existing task.

DELETE /tasks/:id: Delete a task.

PATCH /tasks/:id/toggle: Toggle the completion status of a task.

Testing

Running Tests

Ensure the test database is configured in config/database.js.

Run the tests:

NODE_ENV=test npm test

Tests are written using Mocha and Chai and cover both models and routes.

Project Structure

ToDoApp/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── taskController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   ├── test/
│   │   ├── user.test.js
│   │   └── task.test.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md

Additional Notes

Ensure to replace your_secret_key in .env with a secure value.

Tasks are linked to users via a UserId foreign key.

Use hashed passwords in production for security.

License

This project is licensed under the ISC License.

