# Digital Notice Board System

A complete web application for managing digital notices with role-based access control.

## Features

- **Role-based Authentication**: Faculty/Admin and Student roles
- **Notice Management**: Create, edit, delete notices (Faculty only)
- **Filtered Viewing**: Students can view notices by Department & Year
- **Auto-expiry**: Notices automatically disappear after expiry date
- **Real-time Updates**: Firebase integration for live updates

## Tech Stack

### Frontend
- React 18
- TailwindCSS
- Firebase SDK

### Backend
- Node.js
- Express.js
- Firebase Admin SDK

### Database
- Firebase Firestore

### Authentication
- Firebase Authentication

### Testing
- Jest (Backend)
- Selenium (Frontend)

### CI/CD
- GitHub Actions

### Deployment
- Frontend: Vercel
- Backend: Render/Firebase Functions

## Project Structure

```
digital-notice-board/
├── backend/           # Node.js + Express API
├── frontend/          # React + TailwindCSS
├── .github/           # GitHub Actions workflows
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up Firebase configuration
5. Run the development servers

### Notes
- For local dev you can use mock tokens when Firebase not configured: set Authorization: Bearer mock-faculty or mock-student
- Provide Firebase credentials in backend/.env to enable real Firestore and Auth

## Architecture

The project follows MVC (Model-View-Controller) pattern and SOLID principles:

- **Models**: Firebase Firestore collections
- **Views**: React components
- **Controllers**: Express.js route handlers

## License

MIT
