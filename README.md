# Tenex Engineering Take-Home: Calendar Assistant

This project is a high-performance, AI-powered Calendar Assistant built for the Tenex Engineering Take-Home Assignment. It features a modern web interface for managing Google Calendar data and interacting with an intelligent calendar agent.

## 🚀 Overview
Tenex Calendar AI helps users regain control of their time. By combining GSuite authentication with a chat-based LLM agent, users can automate scheduling, draft outreach emails, and analyze their time spent in meetings.

## ✨ Core Features
- **GSuite Integration**: Authenticate with Google to pull and display real-time calendar information.
- **Intelligent Chat Interface**: A simple, powerful interface to chat with your calendar.
    - *Scheduling*: "Block my mornings for workouts and draft emails for Joe, Dan, and Sally."
    - *Analytics*: "How much of my time am I spending in meetings? How can I decrease that?"
- **Premium Dashboard**: A dedicated, non-collapsible professional workspace built with a focused, minimal aesthetic.
- **Clean & Scalable Architecture**: Built using Next.js 16 and shadcn/ui for maximum flexibility and performance.

## 🛠 Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🏃 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Access the Application**:
    - **Landing Page**: `http://localhost:3000`
    - **Dashboard**: `http://localhost:3000/app`

## 📂 Project Structure
- `src/app/app`: Dashboard-specific layouts and pages.
- `src/components/app`: Application logic (Sidebar, Main Calendar, AI Components).
- `src/components/landing_page`: Marketing components for the root page.
- `src/components/ui`: shadcn/ui primitive design system.
- `src/lib`: Shared utility functions and common logic.

## 🎥 Submission Requirements
- **Video Demo**: Walkthrough of features, tech choices, and business impact.
- **Live Link**: Link to the deployed application.
- **Codebase**: This repository.
