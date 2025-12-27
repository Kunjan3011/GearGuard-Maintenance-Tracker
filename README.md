# GearGuard - Maintenance Management System

GearGuard is a modern, full-stack maintenance tracking application designed to streamline equipment maintenance, work orders, and team management. It features a responsive React frontend and a robust FastAPI backend with Role-Based Access Control (RBAC).

## 🚀 Features

*   **Maintenance Pipeline (Kanban)**: Visual drag-and-drop board to track requests from "New" to "Repaired" or "Scrap".
*   **Equipment Management**: Track assets, serial numbers, warranties, and link them to maintenance history.
*   **Work Centers**: Manage production lines and machine centers.
*   **Team & Technician Management**: Assign technicians to teams and track their workload availability.
*   **RBAC Authentication**: Secure login with roles (Admin, Manager, Technician, Employee) restricting access to sensitive actions.
*   **Calendar View**: Visual schedule of upcoming and past maintenance tasks.
*   **Reporting**: Dashboard for high-level metrics and insights.
*   **Responsive Design**: Built with a premium, modern UI using CSS variables and flexbox/grid layouts.

## 🛠️ Tech Stack

### Frontend
*   **React 19**: Modern UI library with Hooks.
*   **Vite**: Next-generation frontend tooling.
*   **React Router v7**: Client-side routing.
*   **Lucide React**: Beautiful & consistent icons.
*   **Context API**: State management for Auth and Data.

### Backend
*   **FastAPI**: High-performance Python web framework.
*   **SQLModel**: Modern SQL ORM based on Python type hints.
*   **PostgreSQL / SQLite**: Database support (Default: SQLite for dev, PostgreSQL ready).
*   **Uvicorn**: ASGI server implementation.

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)

### 1. Backend Setup

```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlmodel

# Run the server
uvicorn main:app --reload --port 8001
```
The API will be available at `http://localhost:8001/docs`.

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The application will run at `http://localhost:5173`.

## 👥 Contributors

*   [Kunjan3011](https://github.com/Kunjan3011) - Core Architecture, API, Auth
*   [pratickchittroda-cpu](https://github.com/pratickchittroda-cpu) - Management Modules, RBAC Scripts
*   [MeghaGhadiya](https://github.com/MeghaGhadiya) - UI Components, Reporting, Testing

## 📄 License

This project is licensed under the MIT License.
