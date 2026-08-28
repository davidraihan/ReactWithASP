# ReactWithASP Client (Frontend SPA)

Aplikasi frontend E-Commerce Single Page Application (SPA) berbasis **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Shadcn UI**, **Zustand**, dan **TanStack Router/Query**.

---

## 🛠️ Tech Stack & Modul Utama

- **Framework & Build Tool**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4, Lucide Icons, Shadcn UI
- **State Management**: Zustand (`useAuthStore` untuk token & user session)
- **Routing**: TanStack Router dengan navigasi dinamis SPA (History API)
- **Form & Validasi**: React Hook Form + Zod
- **Data Fetching & Toast**: TanStack React Query + Sonner Toast
- **Testing**: Vitest + Vitest Browser Context

---

## 🚀 Perintah Pengembangan (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server lokal Vite HMR di `http://localhost:5173` |
| `npm run build` | Menghasilkan rute, kompilasi TypeScript (`tsc`), dan bundle Vite produksi di `dist/` |
| `npm run preview` | Menjalankan preview server lokal dari hasil build `dist/` |
| `npm run test` | Menjalankan unit test dengan Vitest |
| `npm run generate-routes` | Menghasilkan file rute `src/routeTree.gen.ts` secara otomatis |

---

## 🔐 Alur Autentikasi & Navigasi Peran (*Role-Based Routing*)

- **Admin Login**: Membuka dashboard manajemen e-commerce ([EcommerceAdminLayout](file:///c:/Users/Dvid/WebProject/ASP.NET/ReactWithASP/reactwithasp.client/src/features/ecommerce/ecommerce-admin-layout.tsx)).
- **User Login / Guest**: Membuka halaman toko publik ([PublicStorefront](file:///c:/Users/Dvid/WebProject/ASP.NET/ReactWithASP/reactwithasp.client/src/features/ecommerce/public-storefront.tsx)).
- **Kredensial Default Admin**: `admin@tokoserbaada.id` / `Admin123!`

---

## 🌐 Integrasi Proxy Vite Backend
Vite telah dikonfigurasi pada `vite.config.ts` untuk memproksi request `/api` secara otomatis ke server ASP.NET Core di `https://localhost:7055`.
