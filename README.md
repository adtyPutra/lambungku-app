# LambungKu — Sistem Pakar Diagnosis Penyakit Lambung

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)

---

## Deskripsi

LambungKu adalah aplikasi web berbasis sistem pakar (*expert system*) yang dirancang untuk membantu pengguna melakukan deteksi dini terhadap penyakit lambung. Aplikasi ini menerapkan metode inferensi **Forward Chaining**, yaitu pendekatan penalaran yang dimulai dari kumpulan fakta berupa gejala yang dipilih pengguna, kemudian diproses melalui basis aturan untuk menghasilkan kesimpulan berupa kemungkinan diagnosis penyakit.

**Catatan Penting:** Aplikasi ini bersifat informatif dan tidak dapat menggantikan diagnosis medis dari dokter. Pengguna tetap disarankan untuk berkonsultasi dengan tenaga medis profesional apabila mengalami keluhan kesehatan.

---

## Fitur Aplikasi

| Fitur | Deskripsi |
|---|---|
| Diagnosis Sistem Pakar | Mesin inferensi Forward Chaining mencocokkan gejala yang dipilih pengguna dengan basis pengetahuan penyakit lambung yang tersimpan di database |
| Persentase Kecocokan | Setiap hasil diagnosis dilengkapi dengan persentase kecocokan gejala sebagai indikator tingkat keyakinan sistem |
| Riwayat Diagnosa | Seluruh hasil diagnosis tersimpan secara otomatis ke akun pengguna dan dapat ditinjau kapan saja |
| Portal Edukasi | Menyediakan 6 artikel medis interaktif tentang cara menjaga dan merawat kesehatan lambung |
| Autentikasi Pengguna | Sistem login, registrasi, lupa password, dan reset password menggunakan Supabase Auth |
| Manajemen Profil | Pengguna dapat melihat dan mengelola informasi akun pribadi |
| Panel Administrator | Dashboard khusus untuk admin dalam mengelola data penyakit dan gejala |
| Desain Responsif | Tampilan yang optimal di berbagai ukuran layar (mobile, tablet, dan desktop) |

---

## Teknologi yang Digunakan

| Kategori | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.3.3 |
| UI Library | React | 19 |
| Bahasa Pemrograman | TypeScript | 5 |
| Database & Autentikasi | Supabase (PostgreSQL) | 2.x |
| Library Ikon | Lucide React | 1.x |
| Styling | Vanilla CSS (Custom Design System) | — |

---

## Struktur Direktori

```
lambungku-nextjs/
├── app/
│   ├── page.tsx                 # Halaman beranda (landing page)
│   ├── layout.tsx               # Root layout aplikasi
│   ├── globals.css              # Global stylesheet dan design system
│   ├── api/
│   │   └── diagnosa/
│   │       └── route.ts         # REST API endpoint: POST /api/diagnosa
│   ├── login/
│   │   └── page.tsx             # Halaman login
│   ├── register/
│   │   └── page.tsx             # Halaman registrasi akun baru
│   ├── forgot-password/
│   │   └── page.tsx             # Halaman permintaan reset password
│   ├── reset-password/
│   │   └── page.tsx             # Halaman form reset password
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard utama pengguna
│   ├── diagnosa/
│   │   └── page.tsx             # Halaman pemilihan gejala
│   ├── hasil/
│   │   └── page.tsx             # Halaman tampilan hasil diagnosis
│   ├── riwayat/
│   │   └── page.tsx             # Halaman riwayat diagnosis
│   ├── edukasi/
│   │   └── page.tsx             # Halaman artikel edukasi kesehatan
│   └── profil/
│       └── page.tsx             # Halaman profil pengguna
├── components/
│   └── Navbar.tsx               # Komponen navigasi global
├── lib/
│   ├── supabase.ts              # Konfigurasi dan inisialisasi Supabase client
│   ├── db.ts                    # Fungsi query database (ambil data gejala dan penyakit)
│   └── engine.ts                # Implementasi mesin inferensi Forward Chaining
└── public/                      # Aset statis (gambar, ikon, dsb.)
```

---

## Cara Kerja Mesin Inferensi

Sistem menggunakan metode **Forward Chaining** (penalaran maju), yaitu strategi inferensi yang bekerja dari fakta menuju kesimpulan. Prosesnya adalah sebagai berikut:

```
Gejala yang dipilih pengguna (Fakta)
    → Dicocokkan dengan aturan IF-THEN pada basis pengetahuan
    → Menghasilkan diagnosis kemungkinan penyakit (Kesimpulan)
```

### Algoritma Scoring

Untuk setiap penyakit yang ada dalam basis pengetahuan, sistem menghitung:

```typescript
// lib/engine.ts
const matched    = selectedSymptoms.filter(s => disease.symptoms.includes(s));
const score      = matched.length / disease.symptoms.length;
const percentage = Math.round(score * 100);
const isConfirmed = matched.length >= disease.min_match;
```

| Variabel | Tipe | Keterangan |
|---|---|---|
| `matched` | `string[]` | Daftar gejala yang cocok antara input pengguna dan gejala penyakit |
| `score` | `number` | Rasio kecocokan gejala terhadap total gejala penyakit (0.0 – 1.0) |
| `percentage` | `number` | Persentase kecocokan yang ditampilkan kepada pengguna |
| `isConfirmed` | `boolean` | `true` apabila jumlah gejala yang cocok memenuhi ambang batas minimum (`min_match`) |

Hasil akhir diurutkan berdasarkan nilai `score` dari tertinggi ke terendah sebelum dikembalikan ke client.

---

## Skema Database

Aplikasi terhubung ke **Supabase** (PostgreSQL) dengan struktur tabel sebagai berikut:

```sql
-- Menyimpan daftar gejala yang tersedia dalam sistem
CREATE TABLE Gejala (
    id    TEXT PRIMARY KEY,  -- Kode unik gejala, contoh: 'G01'
    nama  TEXT NOT NULL      -- Deskripsi gejala, contoh: 'Nyeri ulu hati'
);

-- Menyimpan data penyakit beserta informasi medisnya
CREATE TABLE Penyakit (
    id          TEXT PRIMARY KEY,
    nama        TEXT NOT NULL,
    deskripsi   TEXT,
    penyebab    TEXT[],     -- Array berisi daftar penyebab penyakit
    solusi      TEXT[],     -- Array berisi daftar saran penanganan
    min_cocok   INTEGER     -- Jumlah minimum gejala cocok untuk konfirmasi diagnosis
);

-- Tabel relasi many-to-many antara Penyakit dan Gejala
CREATE TABLE PenyakitGejala (
    penyakit_id  TEXT REFERENCES Penyakit(id),
    gejala_id    TEXT REFERENCES Gejala(id),
    PRIMARY KEY (penyakit_id, gejala_id)
);

-- Data pengguna (dikelola bersama Supabase Auth)
CREATE TABLE Pengguna (
    id    UUID PRIMARY KEY,  -- Mengacu pada auth.users.id dari Supabase
    role  TEXT DEFAULT 'user'  -- Nilai: 'user' atau 'admin'
);
```

---

## Instalasi dan Menjalankan Secara Lokal

### Prasyarat

- Node.js versi 18 atau lebih baru
- npm (disertakan dalam instalasi Node.js)
- Akun Supabase aktif (tersedia gratis di [supabase.com](https://supabase.com))

### Langkah-langkah

**1. Clone repository**

```bash
git clone https://github.com/adtyPutra/lambungku-app.git
cd lambungku-app
```

**2. Install dependensi**

```bash
npm install
```

**3. Konfigurasi environment variables**

Buat file `.env.local` di root direktori proyek dengan isi berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Nilai `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dapat diperoleh dari:
**Supabase Dashboard > Project Settings > API**

**4. Setup database**

Jalankan skrip SQL skema di atas melalui Supabase SQL Editor, kemudian isi data gejala dan penyakit sesuai kebutuhan.

**5. Jalankan server development**

```bash
npm run dev
```

Aplikasi dapat diakses di `http://localhost:3000`.

---

## Perintah yang Tersedia

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Menjalankan server development dengan hot-reload |
| `npm run build` | Mem-build aplikasi untuk lingkungan production |
| `npm run start` | Menjalankan server production (wajib build terlebih dahulu) |
| `npm run lint` | Menjalankan ESLint untuk pemeriksaan kualitas kode |

---

## API Reference

### POST `/api/diagnosa`

Endpoint untuk memproses diagnosis berdasarkan gejala yang dikirimkan oleh client.

**Request**

```
Method  : POST
URL     : /api/diagnosa
Headers : Content-Type: application/json
```

**Request Body**

```json
{
  "symptoms": ["G01", "G03", "G07"]
}
```

| Field | Tipe | Keterangan |
|---|---|---|
| `symptoms` | `string[]` | Array kode gejala yang dipilih pengguna |

**Response — 200 OK**

```json
{
  "results": [
    {
      "key": "P01",
      "disease": {
        "name": "Gastritis (Radang Lambung)",
        "description": "Peradangan pada lapisan dinding lambung yang dapat bersifat akut maupun kronis.",
        "causes": ["Infeksi bakteri Helicobacter pylori", "Konsumsi obat antiinflamasi nonsteroid (OAINS)", "Konsumsi alkohol berlebihan"],
        "solution": ["Konsultasi dengan dokter spesialis penyakit dalam", "Konsumsi antasida sesuai anjuran dokter", "Hindari makanan pedas dan asam"],
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

**Response — 400 Bad Request**

```json
{
  "error": "Invalid input"
}
```

Dikembalikan apabila nilai `symptoms` bukan bertipe array.

**Response — 500 Internal Server Error**

```json
{
  "error": "Server error"
}
```

Dikembalikan apabila terjadi kesalahan saat mengambil data dari database atau proses inferensi.

---

## Alur Penggunaan Aplikasi

```
Beranda
  └── Belum login  → Halaman Login / Registrasi
  └── Sudah login  → Redirect otomatis ke Dashboard

Dashboard
  ├── Mulai Diagnosa
  │     └── Pilih Gejala → Proses via POST /api/diagnosa → Halaman Hasil
  │                                                              └── Tersimpan ke Riwayat
  ├── Riwayat Diagnosa
  │     └── Lihat detail hasil diagnosis sebelumnya
  ├── Pojok Edukasi
  │     └── Baca artikel kesehatan lambung
  └── Profil
        └── Kelola informasi akun
```

---

## Informasi Pengembang

| Keterangan | Detail |
|---|---|
| Nama | Putra Aditya Hartanto |
| NIM | 11123039 |
| Kelas | 3KA25 |
| Institusi | Universitas Gunadarma |
| Mata Kuliah | Sistem Pakar |
| Tahun Akademik | 2025/2026 |

---

*Proyek ini dikembangkan untuk memenuhi tugas akhir mata kuliah Sistem Pakar. Seluruh hak cipta dimiliki oleh pengembang.*

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
