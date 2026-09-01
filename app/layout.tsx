import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LambungKu - Sistem Pakar Diagnosis Penyakit Lambung',
  description: 'Sistem pakar berbasis Forward Chaining untuk mendiagnosis penyakit lambung. Pilih gejala yang Anda rasakan dan dapatkan hasil diagnosis secara instan.',
  keywords: ['sistem pakar', 'penyakit lambung', 'diagnosa', 'gastritis', 'GERD', 'tukak lambung'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='id'>
      <body>{children}</body>
    </html>
  );
}
