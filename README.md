# MoveIn Match — Roommate Compatibility Calculator

MoveIn Match is a roommate compatibility application designed to help college students find compatible roommates based on their lifestyle and housing preferences. Users can enter information for two potential roommates, compare their preferences, and receive a compatibility score showing how well they match.

This project was developed as an individual research application for **CSCE 490 — Capstone** at the University of South Carolina. It explores the technologies being considered for the BinaryBandits team's MoveIn Match project.

## Built With

- **React** — Frontend user interface and interactive forms
- **Vite** — Frontend development server and build tool
- **JavaScript** — Frontend and backend programming language
- **Node.js** — Backend JavaScript runtime
- **Express.js** — Backend API and request handling
- **CSS** — Application styling and responsive layout
- **npm** — Package management
- **Git/GitHub** — Version control and project hosting

## Features

- Compare two roommates based on their lifestyle preferences.
- Enter housing budgets, sleep schedules, cleanliness, smoking, and pet preferences.
- Calculate a compatibility score from 0–100%.
- View matching and different preferences.
- Reset the forms to compare new roommates.

## Run the Project

To run the application locally, make sure you have **Node.js** and **npm** installed on your computer.

### 1. Clone the Repository

Download the project from GitHub and navigate into the folder:

```bash
git clone https://github.com/MehulB234/roommate-compatibility-research.git
cd roommate-compatibility-research
```

### 2. Start the Frontend

Open a terminal in VS Code and run:

```bash
cd client
npm install
npm run dev
```

This will start the React application using Vite. The terminal should display a local URL:

**http://localhost:5173/**

### 3. Start the Backend

Open a second terminal in VS Code and navigate to the server folder from the main project directory:

```bash
cd server
npm install
node index.js
```

The Node.js and Express backend will start at:

**http://localhost:3001/**

### 4. Open the Application

With both servers running, open **http://localhost:5173/** in your browser.

You can now enter two roommates' preferences and calculate their compatibility score.

**Note:** Both terminals must remain running while using the application. The frontend runs on port 5173, while the backend runs on port 3001.

## How Matching Works

The app compares five categories: cleanliness, sleep schedule, smoking, pets, and housing budget.

Each matching category is worth 20 points. Housing budgets are considered a match if they are within 20% of the larger budget.

For example, matching in 4 out of 5 categories gives a compatibility score of **80%**.

## What I Learned

This project helped me learn how to build a React frontend, create a Node.js backend using Express, connect them through an API, and manage my code using npm and GitHub.

## Future Improvements

- User accounts and saved profiles
- More lifestyle preferences
- Matching with multiple roommates
- Messaging between users

## Author

**Mehul Bellukutty**

CSCE 490 — Research Milestone

University of South Carolina