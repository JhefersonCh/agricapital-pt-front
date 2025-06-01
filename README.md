# Frontend AgriCapital (Prueba técnica)

AgriCapital is a modern web application for managing agricultural credit operations, built with React and TypeScript. This system handles the entire credit management lifecycle, from client registration and multi-step credit applications to final approval and ongoing management. 🌾💰

---

## ✨ Project Overview

This project serves as a technical demonstration for AgriCapital, a Colombian agricultural finance company. It's a comprehensive web application designed to streamline agricultural credit processes, providing a robust and user-friendly experience for clients, analysts, and administrators.

---

## 🚀 Key Features

* **Role-based Access Control:** Different user types (clients, analysts, administrators) with tailored permissions. 🔑
* **Multi-step Credit Application Workflow:** A three-step wizard for applications, including personal data, credit details, and review. 📝
* **Real-time Notifications:** WebSocket integration for live updates on application statuses and other critical information. 🔔
* **Sophisticated Risk Assessment System:** An automated scoring algorithm for credit evaluation, considering factors like agricultural experience, credit history, debt ratios, and insurance status. 📊
* **Comprehensive Credit Review Interface:** Dedicated tools for analysts to efficiently review, approve, or reject applications. ✅❌
* **Collateral Management:** Features for registering and valuing guarantees. 🏦
* **Currency and Date Formatting:** Localized formatting for Colombian Pesos (COP) and Colombian Spanish dates. 🇨🇴
* **Responsive Design:** An adaptive interface that looks great on various devices. 📱💻

---

## 🛠️ Technology Stack

### Frontend

* **React 18.2.0:** The core JavaScript library for building user interfaces. ⚛️
* **TypeScript 5.8.3:** Adds static type definitions to JavaScript, enhancing code quality. 💙
* **Vite 6.3.5:** A fast build tool and development server for modern web projects. ⚡

### Backend & Database

* **Supabase 2.49.8:** Our Backend as a Service (BaaS) provider, offering authentication, database, and real-time capabilities. 📡
* **FASTAPI Backend:** Our backend for requests, emails, notifications, and customer management is built on FastAPI. ⚡

### UI & Styling

* **Tailwind CSS 4.1.8:** A utility-first CSS framework for rapid UI development. 🎨
* **Radix UI:** Provides unstyled, accessible UI component primitives (Dialog, Select, Checkbox, etc.). 🧩
* **Headless UI 2.2.4:** Fully unstyled, accessible UI components. 👤
* **Heroicons 2.2.0 & Lucide React 0.511.0:** For beautiful and consistent iconography. ✨

### Form Management & Validation

* **React Hook Form 7.56.4:** A performance-optimized library for form handling. ✍️
* **Zod 3.25.34:** A schema declaration and validation library. ✅

### Navigation & HTTP

* **React Router DOM 6.30.1:** Declarative routing for React applications. 🗺️
* **Axios 1.9.0:** A promise-based HTTP client for making API requests. 🌐

### Utilities

* **Date-fns 3.6.0:** A comprehensive JavaScript date utility library. 🗓️
* **React Day Picker 8.10.1:** An accessible and customizable date picker component. 📅

---

## 🏗️ Application Architecture

The system follows a layered architecture, ensuring a clear separation between presentation, business logic, and data access layers. The main layout component handles authentication and role-based routing, providing a secure and organized flow.

### Project Structure

src/
├── auth/            # Authentication components and routing
│   ├── components/  # Auth-specific components
│   ├── pages/       # Module pages
│   └── services/    # Data services (Supabase)
├── credit/          # Credit management module (applications, reviews, services)
│   ├── components/  # Credit-specific components
│   ├── pages/       # Module pages
│   └── services/    # Data services (FASTAPI)
├── shared/          # Shared components, layouts, contexts, and utilities
│   └── layout/      # Main layout and navigation
└── user/            # User management features (Supabase)

## 👨‍💻 Development Tools

### 🧪 Testing
- **Vitest 3.1.4**: A fast unit test framework powered by Vite. ⚡️  
- **Testing Library**: Provides utilities for testing React components (React, Jest-DOM, User Event). 🎭  
- **jsdom 26.1.0**: A JavaScript implementation of the DOM, used for testing in a Node.js environment. 🌐  

### 🧼 Code Quality
- **ESLint 9.25.0**: A pluggable linter for identifying and reporting on patterns in JavaScript code. 🧐  
- **Husky 8.0.0**: Git hooks made easy, ensuring consistent code quality before commits. 🐶  
- **Lint-staged 16.1.0**: Runs linters against staged Git files, preventing bad code from being committed to staging. 📝  

---

## 🌍 Environment Configuration

The project requires the following environment variables to be set:

- `VITE_SUPABASE_URL`: Your Supabase project URL  
- `VITE_SUPABASE_ANON_KEY`: Your Supabase public anonymous key  
- `VITE_WEBSOCKET_URL`: The URL for real-time notifications via WebSockets  

> These are typically configured in a `.env` file at the root of the project.

---

## 🧪 Testing Strategy

The project includes **comprehensive unit and integration tests** using **Vitest** and **Testing Library**, ensuring the reliability and functionality of components like `UserList`.  
This strong testing coverage supports maintainability and confidence in code changes. ✅


### Design Patterns

* **Context API:** For global state management (Authentication, Roles). 🔄
* **Service Layer:** Separates business logic from UI components. 🚦
* **Component Composition:** Leverages Radix UI for highly reusable and accessible base components. 🧱
* **Form Management:** Utilizes React Hook Form with Zod for robust form handling and validation. ✍️✅

---
<details>
<summary>Project commands 💻</summary>


```bash
npm run dev       # Arranca el servidor de desarrollo
npm run build     # Construye el proyecto para producción
npm run preview   # Previsualiza la build de producción
npm run lint      # Corre ESLint para revisar calidad de código
npm run test      # Ejecuta los tests (Vitest)
npm run test:watch # Ejecuta tests en modo watch (se actualizan al guardar)
npm run prepare   # Instala los hooks de Husky (git hooks)
