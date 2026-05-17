# Student Freelance Hub

A full-stack platform where students can create profiles, showcase skills, and get freelance work from clients.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT
- **Database**: MongoDB

## Folder Structure
```
Student Freelance Hub/
├── backend/
│   ├── src/
│   │   ├── config/ (db.js)
│   │   ├── controllers/ (auth, jobs)
│   │   ├── middleware/ (authMiddleware.js)
│   │   ├── models/ (User, Job, Application)
│   │   └── routes/ (auth, jobs)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/ (Navbar, ProtectedRoute)
    │   ├── context/ (AuthContext.jsx)
    │   ├── pages/ (Home, Login, Signup, StudentDashboard, ClientDashboard, Jobs)
    │   ├── services/ (api.js)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    └── package.json
```

## Step-by-Step Setup Instructions

### Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB installed locally or a MongoDB Atlas account

### 1. Database Setup
Ensure you have MongoDB running locally on `mongodb://localhost:27017` or create a cluster on MongoDB Atlas.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Update MONGODB_URI if using Atlas)*
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Sample Workflow
1. Go to `http://localhost:5173/signup`.
2. Create an account and select "Client" as your role.
3. Once in the Client Dashboard, click "Post New Job" and fill out the details.
4. Log out, then go back to signup and create a new account, this time selecting "Student".
5. Go to the "Jobs" tab, find the job you just posted, and click "Apply Now".
6. Fill out a cover letter. 
7. Go to the Student Dashboard to see the application status.
