"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope, Activity, Brain, Zap, BarChart, ShieldCheck, LogIn, History, LogOut, AlertCircle, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Check if admin to decide route, but for now mostly patients use this page
        supabase.from('Pengguna').select('role').eq('id', session.user.id).single().then(({ data }) => {
          if (data?.role === 'admin') router.push("/admin/dashboard");
          else router.push("/dashboard");
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <Navbar activePage="beranda" />

      <section className="hero">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '48px', padding: '60px 5%' }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div className="hero-badge animate-in" style={{ justifyContent: 'flex-start', margin: '0 0 24px 0' }}>
              <Activity size={14} />
              <span>Sistem Pakar · Penyakit Lambung</span>
            </div>
            <h1 className="animate-in delay-1" style={{ color: 'var(--primary)', textAlign: 'left' }}>Kenali Penyakit Lambung Anda</h1>
            <p className="animate-in delay-2" style={{ margin: '0 0 32px 0', textAlign: 'left' }}>
              Diagnosis dini penyakit lambung menggunakan teknologi sistem pakar. Pilih gejala yang Anda rasakan dan dapatkan analisis medis yang akurat dalam hitungan detik.
            </p>
            <div className="hero-buttons animate-in delay-3" style={{ justifyContent: 'flex-start' }}>
              <Link href="/diagnosa" className="btn btn-primary btn-lg">
                <Stethoscope size={18} />
                Mulai Diagnosa
              </Link>
              <a href="#fitur" className="btn btn-secondary btn-lg">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }} className="animate-in delay-4 hero-image-container">
            <img src="/dokter.png" alt="Ilustrasi Dokter" style={{ width: '100%', maxWidth: '450px', filter: 'drop-shadow(0 20px 13px rgba(0, 0, 0, 0.03)) drop-shadow(0 8px 5px rgba(0, 0, 0, 0.08))' }} />
          </div>
        </div>
      </section>

      <section id="fitur" className="container">
        <div className="animate-in delay-2" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2>Mengapa LambungKu?</h2>
          <p>Dirancang untuk memberikan pengalaman diagnosis yang mudah, cepat, dan akurat.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>

          <div className="card feature-card animate-in delay-1">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '14px', borderRadius: '16px', display: 'inline-flex', marginBottom: '20px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}><Brain size={28} /></div>
            <h3 style={{ marginBottom: '8px' }}>Forward Chaining</h3>
            <p style={{ fontSize: '0.875rem' }}>Menggunakan metode inferensi Forward Chaining yang terbukti akurat dalam mencocokkan gejala dengan penyakit.</p>
          </div>

          <div className="card feature-card animate-in delay-2">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '14px', borderRadius: '16px', display: 'inline-flex', marginBottom: '20px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}><Zap size={28} /></div>
            <h3 style={{ marginBottom: '8px' }}>Hasil Instan</h3>
            <p style={{ fontSize: '0.875rem' }}>Dapatkan hasil diagnosis lengkap beserta deskripsi penyakit, penyebab, dan solusi penanganan dalam hitungan detik.</p>
          </div>

          <div className="card feature-card animate-in delay-3">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '14px', borderRadius: '16px', display: 'inline-flex', marginBottom: '20px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}><BarChart size={28} /></div>
            <h3 style={{ marginBottom: '8px' }}>Persentase Akurasi</h3>
            <p style={{ fontSize: '0.875rem' }}>Setiap hasil diagnosis dilengkapi dengan persentase kecocokan untuk membantu Anda memahami tingkat keyakinan sistem.</p>
          </div>

          <div className="card feature-card animate-in delay-4">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '14px', borderRadius: '16px', display: 'inline-flex', marginBottom: '20px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}><History size={28} /></div>
            <h3 style={{ marginBottom: '8px' }}>Riwayat Diagnosa</h3>
            <p style={{ fontSize: '0.875rem' }}>Simpan dan pantau seluruh riwayat hasil diagnosis Anda sebelumnya untuk melihat perkembangan kesehatan lambung secara berkala.</p>
          </div>

        </div>
      </section>

      <section id="edukasi" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)', padding: '80px 5%', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="animate-in delay-1" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, background: '#D1FAE5', padding: '8px 20px', borderRadius: 'var(--radius-full)', marginBottom: '20px', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)' }}>
              <AlertCircle size={16} /> Info Kesehatan
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Pentingnya Menjaga Lambung</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.125rem' }}>Penyakit lambung seperti GERD, Maag, dan Asam Lambung sering diabaikan, padahal jika dibiarkan dapat menyebabkan komplikasi serius. Berikut cara mudah merawatnya:</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div className="card animate-in delay-2" style={{ border: 'none', borderRadius: '16px', overflow: 'hidden', padding: 0, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
              <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80" alt="Makan Teratur" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--primary)' }}>Makan Teratur</h3>
                <p style={{ fontSize: '0.95rem' }}>Jangan melewatkan waktu makan. Pola makan yang tidak teratur membuat lambung memproduksi asam berlebih yang dapat mengiritasi dinding lambung Anda.</p>
              </div>
            </div>

            <div className="card animate-in delay-3" style={{ border: 'none', borderRadius: '16px', overflow: 'hidden', padding: 0, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
              <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" alt="Hindari Stres" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--primary)' }}>Kelola Stres</h3>
                <p style={{ fontSize: '0.95rem' }}>Stres berlebihan dapat memicu peningkatan produksi asam lambung secara tiba-tiba, yang berujung pada rasa nyeri dan sensasi terbakar di area dada.</p>
              </div>
            </div>

            <div className="card animate-in delay-4" style={{ border: 'none', borderRadius: '16px', overflow: 'hidden', padding: 0, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
              <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" alt="Pilih Makanan yang Tepat" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--primary)' }}>Pilih Makanan Sehat</h3>
                <p style={{ fontSize: '0.95rem' }}>Kurangi konsumsi makanan terlalu pedas, asam, atau berlemak tinggi. Perbanyak minum air putih dan hindari minuman berkafein saat perut kosong.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="container" style={{ padding: '80px 5%' }}>
        <div className="animate-in delay-2" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2>Pertanyaan yang Sering Diajukan</h2>
          <p>Jawaban untuk beberapa pertanyaan umum terkait sistem pakar kami.</p>
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-in delay-3">
          {[
            { q: "Apakah hasil diagnosis ini 100% akurat?", a: "Sistem pakar kami menggunakan basis pengetahuan dari ahli medis dan metode Forward Chaining untuk mencocokkan gejala dengan tingkat akurasi yang tinggi. Namun, hasil ini BUKAN pengganti diagnosis medis dari dokter. Selalu konsultasikan keluhan Anda ke dokter spesialis untuk pemeriksaan lebih lanjut." },
            { q: "Bagaimana cara kerja sistem pakar ini?", a: "Anda cukup memilih gejala-gejala yang sedang dialami. Sistem akan memproses data tersebut menggunakan aturan logika (if-then) yang telah diprogram berdasarkan ilmu kedokteran untuk menemukan penyakit yang paling sesuai dengan gejala Anda." },
            { q: "Apakah data riwayat kesehatan saya aman?", a: "Tentu. Semua data riwayat diagnosis Anda disimpan secara aman di database yang dienkripsi dan hanya dapat diakses oleh Anda sendiri melalui akun pribadi." },
            { q: "Kapan saya harus segera pergi ke dokter?", a: "Jika Anda mengalami 'Red Flags' atau tanda bahaya seperti: muntah darah, feses berwarna hitam legam, nyeri perut yang tak tertahankan, atau kesulitan menelan, segeralah kunjungi IGD atau fasilitas kesehatan terdekat." }
          ].map((faq, idx) => (
            <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                {faq.q}
                <ChevronDown size={20} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--primary)', color: 'white', padding: '60px 5%', textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginBottom: '16px' }}>Siap untuk Memulai?</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 32px', color: 'rgba(255,255,255,0.9)' }}>
          Jangan tunda kesehatan Anda. Mulai diagnosis sekarang dan dapatkan wawasan tentang kondisi lambung Anda.
        </p>
        <Link href="/diagnosa" className="btn btn-secondary btn-lg" style={{ color: 'var(--primary)', border: 'none' }}>
          Mulai Diagnosis Gratis
        </Link>
      </section>

      <footer>
        <p>© 2025 <strong>LambungKu</strong> · Sistem Pakar Diagnosis Penyakit Lambung</p>
      </footer>
    </>
  );
}
