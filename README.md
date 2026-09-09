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

*Seluruh hak cipta dimiliki oleh pengembang. Dilarang menggunakan, menyalin, atau mendistribusikan ulang tanpa izin tertulis dari pemilik.*
