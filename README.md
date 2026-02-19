# FindFix (Smart Lost Item Reporting Platform)

## 📋 Deskripsi Singkat Aplikasi

**FindFix** adalah aplikasi web yang memudahkan warga kampus Unikom untuk melaporkan barang hilang atau barang yang ditemukan di area kampus. Aplikasi ini menyediakan fitur pencarian barang, pelaporan dengan foto, manajemen hub penyimpanan barang, dan dashboard admin untuk verifikasi dan pencocokan laporan.

**Fitur Utama:**
- 🔍 Pencarian dan filter laporan barang (berdasarkan kategori, lokasi, status)
- 📝 Pelaporan barang hilang dan ditemukan dengan upload foto
- 🏆 Sistem badge/achievement untuk pengguna aktif
- 📊 Dashboard statistik untuk admin
- 📦 Manajemen hub penyimpanan barang
- 🔐 Autentikasi dan otorisasi (User & Admin)

**Tech Stack:**
- React.js 18
- Vite
- TailwindCSS
- React Router DOM
- Axios
- Recharts (untuk visualisasi data)

---

## 🛠️ Petunjuk Setup Environment

### Prerequisites

Pastikan sistem Anda telah terinstal:
- **Node.js** versi 18.x atau lebih baru
- **npm** versi 9.x atau lebih baru (sudah termasuk dalam instalasi Node.js)
- **Git** untuk clone repository

### Langkah-langkah Setup

#### 1. Clone Repository
```bash
git clone https://github.com/RyanHandhika/findfix-fe.git
cd findfix-fe
```

#### 2. Install Dependencies
```bash
npm install
```

## 🚀 Cara Menjalankan Aplikasi

### Development Mode

Untuk menjalankan aplikasi dalam mode development dengan hot-reload:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (port default Vite). Browser akan otomatis membuka atau Anda bisa mengaksesnya secara manual.

**Catatan:** Pastikan backend API sudah berjalan terlebih dahulu di `http://localhost:8000`.

## 👤 Akun Default untuk Testing

### Admin Account
- **Email:** admin@unikom.ac.id
- **Password:** admin123

### User Account
- **Email:** user@student.unikom.ac.id
- **Password:** user123

## 📝 Catatan Penting

- **Model AI/ML:** Project ini tidak mengimplementasikan model AI/ML.
- **Backend:** Aplikasi ini memerlukan backend API untuk berfungsi penuh. Repository backend terpisah.
- **Browser Support:** Disarankan menggunakan browser modern (Chrome, Firefox, Edge, Safari versi terbaru).
