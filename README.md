# Toko Serba Ada - E-Commerce Platform (React 19 + ASP.NET Core 10)

![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.1-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-cyan?logo=tailwindcss)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-10.0-purple?logo=dotnet)
![Entity Framework](https://img.shields.io/badge/EF_Core-10.0-blue?logo=microsoft)
![SQL Server](https://img.shields.io/badge/SQL_Server-Identity-red?logo=microsoftsqlserver)

Aplikasi E-Commerce Single Page Application (SPA) modern yang dibangun menggunakan **React 19**, **TypeScript**, **Tailwind CSS v4**, **Shadcn UI**, **Zustand**, dan **TanStack Router/Query** pada sisi frontend, serta terintegrasi dengan backend **ASP.NET Core 10 Web API** dan database **Microsoft SQL Server**.

---

## Fitur Utama

### 🛒 1. Public Storefront (Pengunjung & Pelanggan)
- **Katalog Produk Dinamis**: Pencarian produk instan, pencarian kata kunci, serta filter kategori (Pakaian & Fashion, Elektronik & Gadget, Sepatu & Aksesoris, Kecantikan & Masker).
- **Keranjang Belanja (*Shopping Cart Sheet*)**: Penambahan barang ke keranjang, pengaturan kuantitas, kalkulasi total biaya otomatis, dan *simulasi checkout*.
- **Voucher Promo & Diskon**: Banner promosi serta kode diskon spesial pengguna baru.

### 2. Admin E-Commerce Dashboard (Admin)
- **Overview Analytics**: Grafik statistik pendapatan bulanan, jumlah pesanan, produk terjual, serta peringatan stok produk kritis.
- **Katalog & Stok Produk**: Manajemen daftar produk, penambahan produk baru, dan pembaruan stok.
- **Manajemen Pesanan (*Orders*)**: Monitoring status pembayaran (*paid, pending, failed*) dan alur pengiriman (*processing, shipped, delivered, cancelled*).
- **Data Pelanggan & Kupon**: Pengelolaan basis data pelanggan dan pembuatan kode kupon promo.

### 3. Autentikasi & Otorisasi Berbasis Peran (*Role-Based Auth*)
- **Login & Registrasi Pengguna**: Form masuk & daftar akun terintegrasi dengan endpoint `/api/auth/login` dan `/api/auth/register`.
- **Pengalihan Peran Otomatis**:
  - Akun **Admin** (`role: ['admin']`): Otomatis masuk ke **Dashboard Admin E-Commerce**.
  - Akun **User** (`role: ['user']`): Otomatis masuk ke **Public Storefront**.
- **Keamanan Token JWT**: Autentikasi berbasis JWT Bearer Token dengan rotasi Refresh Token otomatis dan penyimpanan aman.
- **Route Protection**: Perlindungan rute admin agar tidak bisa diakses oleh pelanggan biasa atau tamu tanpa izin.

### 4. Navigasi Dinamis SPA (Zero Page Reload)
- Perpindahan antarhalaman dan rute menggunakan **HTML5 History API** (`pushState`) dan **TanStack Router**, sehingga pengguna dapat berpindah tampilan secara instan tanpa memuat ulang (*refresh*) browser.
- Mendukung sinkronisasi parameter URL (`?view=admin`, `?view=public`, `?tab=products`) sehingga fitur *Back/Forward* browser berfungsi dengan sempurna.

---

## Struktur Proyek

```text
ReactWithASP/
├── reactwithasp.client/                 # Frontend SPA (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/                 # Komponen UI Reusable (LoginForm, RegisterForm, Sidebar, UI)
│   │   ├── context/                    # Context Providers (Theme, Font, Layout)
│   │   ├── features/
│   │   │   ├── auth/                   # Fitur Autentikasi (Sign In, Sign Up, OTP, Forgot Password)
│   │   │   └── ecommerce/              # Fitur E-Commerce (Public Storefront & Admin Dashboard)
│   │   │       ├── customers/          # Halaman Manajemen Pelanggan
│   │   │       ├── dashboard/          # Halaman Analytics Dashboard
│   │   │       ├── discounts/          # Halaman Manajemen Kupon Diskon
│   │   │       ├── orders/             # Halaman Manajemen Pesanan
│   │   │       ├── products/           # Halaman Katalog Produk Admin
│   │   │       ├── settings/           # Halaman Pengaturan Toko
│   │   │       ├── ecommerce-admin-layout.tsx # Layout Utama Admin
│   │   │       └── public-storefront.tsx      # Layout Utama Toko Publik
│   │   ├── lib/                        # Utility & API Client (apiFetch, cookies)
│   │   ├── routes/                     # Rute TanStack Router
│   │   ├── stores/                     # State Management Zustand (auth-store)
│   │   ├── App.tsx                     # Entry Point Router & Role Guards
│   │   └── main.tsx                    # React Entrypoint
│   ├── package.json
│   └── vite.config.ts
│
└── ReactWithASP.Server/                 # Backend Web API (ASP.NET Core 10)
    ├── Controllers/
    │   ├── Auth/                       # AuthController (Login, Register, Refresh, Logout)
    │   └── Main/                       # ProductsController, TasksController, UploadController
    ├── Data/
    │   ├── DbContext.cs                # AppDbContext (EF Core + ASP.NET Identity)
    │   └── seed-admin.sql              # T-SQL Script Seeding Admin User
    ├── Entities/
    │   └── Auth/                       # ApplicationUser & RefreshToken
    ├── Models/                         # Model Entity Database
    ├── Program.cs                      # Service Config, JWT & Auto-Seeding Startup
    └── appsettings.json
```

---

## Kredensial Default Admin

Gunakan akun berikut untuk menguji login sebagai **Admin**:

- **Email**: `admin@tokoserbaada.id`
- **Password**: `Admin123!`
- **Role**: `Admin`

*Pengguna baru juga dapat mendaftar langsung melalui tombol **Daftar** di halaman publik.*

---

## 🛠️ Persyaratan Sistem (Prerequisites)

Sebelum menjalankan proyek ini, pastikan sistem Anda telah terinstal:
- **Node.js**: `v18.0.0` atau yang lebih baru
- **npm**: `v9.0.0` atau yang lebih baru
- **.NET SDK**: `.NET 10.0 SDK`
- **Database**: Microsoft SQL Server / LocalDB

---

## Panduan Memulai & Cara Jalankan

### 1. Menjalankan Backend (ASP.NET Core API)

1. Buka terminal di direktori server:
   ```bash
   cd ReactWithASP.Server
   ```
2. Jalankan migrasi Entity Framework untuk membuat tabel database SQL Server:
   ```bash
   dotnet ef database update
   ```
   *(Secara otomatis, aplikasi akan melakukan seeding Role dan User Admin pada saat startup pertama).*

3. Jalankan server backend:
   ```bash
   dotnet run
   ```
   Backend akan berjalan di `https://localhost:7055` dan dokumentasi Swagger tersedia di `https://localhost:7055/swagger`.

---

### 2. Menjalankan Frontend (React + Vite)

1. Buka terminal baru di direktori client:
   ```bash
   cd reactwithasp.client
   ```
2. Instal semua dependensi modul NPM:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
4. Buka aplikasi di browser pada alamat:
   ```text
   http://localhost:5173
   ```

---

## Perintah Build & Testing

### Build Produksi Frontend
Untuk melakukan verifikasi tipe TypeScript dan kompilasi bundle Vite:
```bash
cd reactwithasp.client
npm run build
```

### Jalankan Pengujian Unit (Vitest)
```bash
cd reactwithasp.client
npm run test
```

### Build Backend C#
```bash
cd ReactWithASP.Server
dotnet build
```

---

## 📄 Lisensi
MIT

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
