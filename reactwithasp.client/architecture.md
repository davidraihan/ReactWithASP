# System Architecture Documentation: ReactWithASP

## 1. Executive Summary & Overview

**ReactWithASP** is a full-stack web application built using a decoupled Single Page Application (SPA) architecture combined with a robust RESTful API backend.

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Zustand
- **Backend**: ASP.NET Core 9 + Entity Framework Core + ASP.NET Core Identity + JWT Bearer Authentication
- **Database**: Microsoft SQL Server (managed via Entity Framework Core Migrations)

---

## 2. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT (Browser)                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                        React SPA (reactwithasp.client)                      |  |
|  |                                                                             |  |
|  |  +-------------------+  +------------------------+  +--------------------+  |  |
|  |  |  Public Storefront|  | AuthPage (Login/Reg)   |  | Ecommerce Admin    |  |  |
|  |  +-------------------+  +------------------------+  +--------------------+  |  |
|  |                            \          |          /                          |  |
|  |                             +-------------------+                           |  |
|  |                             | Zustand Auth Store|                           |  |
|  |                             +-------------------+                           |  |
|  +---------------------------------------|-------------------------------------+  |
+------------------------------------------|----------------------------------------+
                                           | HTTP / REST (Fetch API / CORS)
                                           v
+-----------------------------------------------------------------------------------+
|                             SERVER (ReactWithASP.Server)                          |
|                                                                                   |
|  +-------------------+  +-----------------------+  +---------------------------+  |
|  | Auth Controllers  |  |  Main API Controllers |  | Swagger / OpenAPI Doc     |  |
|  +-------------------+  +-----------------------+  +---------------------------+  |
|            |                        |                                             |
|            v                        v                                             |
|  +-----------------------------------------------------------------------------+  |
|  |            Services & Middleware (JWT Bearer Auth, TokenService)            |  |
|  +-----------------------------------------------------------------------------+  |
|                                     |                                             |
|                                     v                                             |
|  +-----------------------------------------------------------------------------+  |
|  |               Data Layer (EF Core AppDbContext + ASP.NET Identity)          |  |
|  +-----------------------------------------------------------------------------+  |
+-------------------------------------|---------------------------------------------+
                                      | T-SQL / ADO.NET
                                      v
+-----------------------------------------------------------------------------------+
|                                SQL Server Database                                |
+-----------------------------------------------------------------------------------+
```

---

## 3. Frontend Architecture (`reactwithasp.client`)

### 3.1 Directory Structure & Organization
- `src/App.tsx`: Main entry view controller managing routing state (`viewMode`: `'public'` | `'admin'` | `'login'` | `'register'`).
- `src/components/`:
  - `AuthPage.tsx`: Primary authentication view with split-screen branding and tabbed forms.
  - `LoginForm.tsx` & `RegisterForm.tsx`: Dedicated form components with validation and fallback API logic.
  - `Dashboard.tsx`: Core dashboard widgets and analytics layout.
  - `ui/`: Reusable UI primitive components (buttons, dialogs, drop-downs, sonner toasts).
- `src/features/`: Modular feature domains:
  - `ecommerce/`: Includes `PublicStorefront` and `EcommerceAdminLayout`.
  - `dashboard/`, `tasks/`, `users/`, `chats/`, `settings/`: Domain-specific business logic and views.
- `src/stores/`: Global Zustand store (`auth-store.ts`) for persisting JWT tokens, active user profile, and authentication state.

### 3.2 Key Frontend Data Flow
1. User navigates to authentication view or store view.
2. `AuthPage.tsx` handles user inputs and submits requests to `/api/auth/login` or `/api/auth/register`.
3. Upon successful response, the JWT token and user profile are saved in `localStorage` and synchronized with `useAuthStore`.
4. Dependent components dynamically alter UI permissions based on `user.role` (e.g., `'admin'` or `'user'`).

---

## 4. Backend Architecture (`ReactWithASP.Server`)

### 4.1 Technology & Layering
- **Controller Layer (`Controllers/`)**:
  - `AuthController.cs`: Handles user registration, login, refresh token rotation, and sign-out.
  - `Main Controllers`: Domain endpoints for managing products, tasks, and system data.
- **Service Layer (`Auth/Services/`)**:
  - `ITokenService` & `TokenService`: Generates signed JWT access tokens with claim definitions.
  - `RefreshTokenService`: Generates, persists, and validates secure refresh tokens.
- **Data Access Layer (`Data/`, `Entities/`)**:
  - `AppDbContext.cs`: EF Core database context extending Identity tables.
  - `ApplicationUser.cs`: Extended Identity user schema.

### 4.2 Security & Authentication Pipeline
- **JWT Settings**: Injected via configuration & `JWT_SECRET_KEY` environment variable.
- **Role-Based Authorization**: ASP.NET Core Identity roles (`Admin`, `User`) seeded at server boot.
- **CORS Policy**: Enables development communication with `http://localhost:5173`.

---

## 5. Deployment & Integration Model

- **Development Mode**: Vite dev server (`reactwithasp.client`) communicates with `ReactWithASP.Server` over HTTP/HTTPS with CORS support.
- **Production Mode**: ASP.NET Core serves pre-compiled Vite static assets directly from `wwwroot` with fallback routing (`app.MapFallbackToFile("/index.html")`).
