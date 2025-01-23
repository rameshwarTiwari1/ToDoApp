# ToDoApp

## Description

ToDoApp is a simple and efficient web application built using Express.js and Sequelize. It allows users to register, log in, and manage their personal to-do lists. Each user can create, update, delete, and toggle the completion status of their tasks in a secure and user-friendly environment.

## Installation and Setup

### Backend

1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com/rameshwarTiwari1/ToDoApp.git
   cd ToDoApp/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following content:
   ```env
   NODE_ENV=development
   PORT=8000
   SESSION_SECRET=your_secret_key
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   The backend will run on `http://localhost:8000`.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ToDoApp/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

## Environment Variables

Ensure the `.env` file contains the following variables:

```env
NODE_ENV=development
PORT=8000
SESSION_SECRET=your_secret_key
```

## How to Run

1. Start the backend server:
   ```bash
   node server.js
   ```
2. Start the frontend application:
   ```bash
   npm start
   ```
3. Access the application at `http://localhost:3000` in your browser.

## Features

- User registration and login with secure authentication.
- CRUD operations for managing personal to-do tasks.
- Tasks linked to individual users for secure access.
- Responsive and user-friendly design using Bootstrap.

## License

This project is licensed under the GNU License.



