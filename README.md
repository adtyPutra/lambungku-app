<h1 align="center">LambungKu 🩺</h1>

<p align="center">
  <strong>Sistem Pakar Diagnosis Penyakit Lambung Berbasis Web</strong><br/>
  Menggunakan metode inferensi <em>Forward Chaining</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.3-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase"/>
</p>

---

## 📋 Deskripsi Proyek

**LambungKu** adalah aplikasi web sistem pakar (*expert system*) yang dirancang untuk membantu pengguna melakukan deteksi dini penyakit lambung. Pengguna cukup memilih gejala-gejala yang dirasakan, kemudian sistem akan menganalisis dan menghasilkan diagnosis menggunakan metode **Forward Chaining**.

> ⚠️ **Disclaimer:** Aplikasi ini bersifat informatif dan **bukan pengganti** diagnosis medis dari dokter. Selalu konsultasikan keluhan Anda ke tenaga medis profesional.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🔬 **Diagnosis Cerdas** | Mesin inferensi *Forward Chaining* mencocokkan gejala dengan basis pengetahuan penyakit lambung |
| 📊 **Persentase Akurasi** | Setiap hasil diagnosis disertai persentase kecocokan gejala |
| 📜 **Riwayat Diagnosa** | Semua hasil diagnosis tersimpan otomatis di akun pengguna |
| 📚 **Pojok Edukasi** | 6 artikel medis interaktif tentang cara menjaga kesehatan lambung |
| 🔐 **Autentikasi Aman** | Login, Register, Lupa Password, dan Reset Password |
| 👤 **Manajemen Profil** | Pengguna dapat melihat dan mengelola data akun |
| 🛡️ **Panel Admin** | Dashboard khusus admin untuk manajemen data penyakit dan gejala |
| 📱 **Responsif** | Tampilan optimal di semua ukuran layar (mobile, tablet, desktop) |

---

## 🏗️ Arsitektur & Struktur Proyek

```
lambungku-nextjs/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Halaman Beranda (Landing Page)
│   ├── layout.tsx              # Root Layout
│   ├── globals.css             # Global Styles & Design System
│   ├── api/
│   │   └── diagnosa/
│   │       └── route.ts        # API Endpoint: POST /api/diagnosa
│   ├── login/                  # Halaman Login
│   ├── register/               # Halaman Registrasi
│   ├── forgot-password/        # Halaman Lupa Password
│   ├── reset-password/         # Halaman Reset Password
│   ├── dashboard/              # Dashboard Pengguna
│   ├── diagnosa/               # Halaman Pemilihan Gejala
│   ├── hasil/                  # Halaman Hasil Diagnosis
│   ├── riwayat/                # Halaman Riwayat Diagnosa
│   ├── edukasi/                # Halaman Artikel Edukasi
│   └── profil/                 # Halaman Profil Pengguna
├── components/
│   └── Navbar.tsx              # Komponen Navigasi Global
├── lib/
│   ├── supabase.ts             # Konfigurasi Supabase Client
│   ├── db.ts                   # Fungsi Query Database (Gejala & Penyakit)
│   └── engine.ts               # Mesin Inferensi Forward Chaining
└── public/                     # Aset Statis (Gambar, Ikon)
```

---

## 🧰 Stack Teknologi

| Kategori | Teknologi |
|---|---|
| **Framework** | Next.js 16.3.3 (App Router) |
| **UI Library** | React 19 |
| **Bahasa** | TypeScript 5 |
| **Database & Auth** | Supabase (PostgreSQL) |
| **Icons** | Lucide React |
| **Styling** | Vanilla CSS (Custom Design System) |

---

## 🧠 Cara Kerja Mesin Inferensi

Sistem menggunakan metode **Forward Chaining** (penalaran maju) — sebuah strategi inferensi yang memulai dari fakta (gejala yang dipilih pengguna) untuk mencapai kesimpulan (penyakit yang terdeteksi).

```
Gejala Dipilih (Fakta) → Aturan IF-THEN (Basis Pengetahuan) → Diagnosis (Kesimpulan)
```

**Algoritma scoring** (`lib/engine.ts`):

```typescript
// Untuk setiap penyakit dalam basis pengetahuan:
const matched   = gejalaDipilih.filter(g => penyakit.symptoms.includes(g));
const score     = matched.length / penyakit.symptoms.length;
const persen    = Math.round(score * 100);
const confirmed = matched.length >= penyakit.min_match;
```

| Variabel | Penjelasan |
|---|---|
| `matched` | Daftar gejala yang cocok antara input pengguna dan gejala penyakit |
| `score` | Rasio gejala cocok dibanding total gejala penyakit (0.0 – 1.0) |
| `percentage` | Persentase kecocokan yang ditampilkan ke pengguna |
| `isConfirmed` | `true` jika gejala yang cocok ≥ `min_match` (ambang batas konfirmasi) |

Hasil diurutkan dari yang memiliki skor tertinggi ke terendah.

---

## 🗄️ Skema Database (Supabase)

```sql
-- Tabel Gejala
Gejala (
  id      TEXT PRIMARY KEY,   -- Kode gejala (contoh: G01)
  nama    TEXT NOT NULL        -- Nama gejala (contoh: "Nyeri ulu hati")
)

-- Tabel Penyakit
Penyakit (
  id          TEXT PRIMARY KEY,
  nama        TEXT NOT NULL,
  deskripsi   TEXT,
  penyebab    TEXT[],          -- Array penyebab
  solusi      TEXT[],          -- Array solusi
  min_cocok   INTEGER          -- Minimum gejala cocok untuk konfirmasi
)

-- Tabel Relasi Many-to-Many
PenyakitGejala (
  penyakit_id TEXT REFERENCES Penyakit(id),
  gejala_id   TEXT REFERENCES Gejala(id)
)

-- Tabel Pengguna (dikelola oleh Supabase Auth)
Pengguna (
  id    UUID PRIMARY KEY,
  role  TEXT DEFAULT 'user'    -- 'user' atau 'admin'
)
```

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat

- **Node.js** versi 18 atau lebih baru
- **npm** (sudah terpasang bersama Node.js)
- Akun **Supabase** (gratis di [supabase.com](https://supabase.com))

### Langkah Instalasi

**1. Clone Repository**

```bash
git clone https://github.com/adtyPutra/lambungku-app.git
cd lambungku-app
```

**2. Install Dependensi**

```bash
npm install
```

**3. Konfigurasi Environment Variables**

Buat file `.env.local` di root proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

> Dapatkan nilai ini dari: **Supabase Dashboard → Project Settings → API**

**4. Setup Database**

Buat tabel-tabel sesuai skema di atas melalui Supabase SQL Editor, lalu isi data gejala dan penyakit lambung.

**5. Jalankan Development Server**

```bash
npm run dev
```

Buka browser dan akses **[http://localhost:3000](http://localhost:3000)**

---

## 📜 Daftar Perintah

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Menjalankan server development |
| `npm run build` | Mem-build aplikasi untuk production |
| `npm run start` | Menjalankan server production (setelah build) |
| `npm run lint` | Menjalankan ESLint untuk cek kualitas kode |

---

## 🔌 API Reference

### `POST /api/diagnosa`

Endpoint untuk memproses diagnosis berdasarkan gejala yang dipilih pengguna.

**Request Body:**
```json
{
  "symptoms": ["G01", "G03", "G07"]
}
```

**Response Sukses (200 OK):**
```json
{
  "results": [
    {
      "key": "P01",
      "disease": {
        "name": "Gastritis (Radang Lambung)",
        "description": "Peradangan pada dinding lambung...",
        "causes": ["Infeksi bakteri H. pylori", "Konsumsi alkohol"],
        "solution": ["Konsultasi ke dokter", "Hindari makanan pedas"],
        "symptoms": ["G01", "G03", "G07"],
        "min_match": 3
      },
      "matched": ["G01", "G03", "G07"],
      "score": 1.0,
      "percentage": 100,
      "isConfirmed": true
    }
  ],
  "symptoms": {
    "G01": "Nyeri ulu hati",
    "G03": "Mual",
    "G07": "Perut kembung"
  }
}
```

**Response Error (400):**
```json
{ "error": "Invalid input" }
```

---

## 🗺️ Alur Pengguna

```
[Beranda] → [Login/Register] → [Dashboard]
                                    │
              ┌─────────────────────┼─────────────────────┐
              ↓                     ↓                     ↓
         [Diagnosa]            [Riwayat]             [Edukasi]
              │
              ↓
     [Pilih Gejala]
              │
              ↓
     [Proses via API]
              │
              ↓
     [Halaman Hasil]
              │
              ↓
     [Tersimpan ke Riwayat]
```

---

## 👨‍💻 Pengembang

**Putra Aditya Hartanto**  
NIM: 11123039 | Kelas: 3KA25  
Universitas Gunadarma  

**Mata Kuliah:** Sistem Pakar  
**Tahun Akademik:** 2025/2026

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan tugas akademik. Seluruh hak cipta dimiliki oleh pengembang.

---

<p align="center">
  Dibuat dengan ❤️ menggunakan <strong>Next.js</strong> & <strong>Supabase</strong><br/>
  © 2025 <strong>LambungKu</strong> · Sistem Pakar Diagnosis Penyakit Lambung
</p>
