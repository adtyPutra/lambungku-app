"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Stethoscope, History, LogOut, Loader2, Activity, Calendar, ChevronRight } from "lucide-react";

export default function PatientDashboard() {
  const [session, setSession] = useState<any>(null);
  const [nama, setNama] = useState<string>("Pasien");
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);

      // Fetch user profile
      const { data: userProfile } = await supabase
        .from('Pengguna')
        .select('nama')
        .eq('id', session.user.id)
        .single();

      if (userProfile) setNama(userProfile.nama);

      // Fetch history
      const { data: historyData } = await supabase
        .from('Riwayat')
        .select('*')
        .eq('pengguna_id', session.user.id)
        .order('tanggal', { ascending: false })
        .limit(3);

      if (historyData) setRiwayat(historyData);

      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p style={{ color: "var(--text-muted)" }}>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar activePage="dashboard" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 5%' }}>

        {/* WELCOME BANNER */}
        <div className="animate-in delay-1 dashboard-welcome-card" style={{
          background: 'linear-gradient(135deg, #10B981, #059669)',
          borderRadius: '24px',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.3), 0 10px 10px -5px rgba(16, 185, 129, 0.2)',
          marginBottom: '32px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div className="dashboard-welcome-content" style={{ flex: 1, padding: '40px 0', zIndex: 2 }}>
            <div className="dashboard-welcome-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', backdropFilter: 'blur(4px)' }}>
              <Activity size={14} /> Portal Pasien
            </div>
            <h1 className="dashboard-welcome-h1" style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'white', letterSpacing: '-0.025em' }}>Halo, {nama}</h1>
            <p className="dashboard-welcome-p" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '400px', lineHeight: 1.5 }}>
              Selamat datang di pusat kesehatan lambung Anda. Lakukan deteksi dini dan pantau riwayat kesehatan Anda di sini.
            </p>
          </div>
          <div className="dashboard-hero-img" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '100%', position: 'relative' }}>
            {/* Menggunakan gambar dokter.png */}
            <img src="/dokter.png" alt="Dokter" style={{ height: '280px', objectFit: 'contain', filter: 'drop-shadow(-10px 10px 20px rgba(0,0,0,0.2))', transform: 'translateY(20px)' }} />
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="animate-in delay-2 stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>

          <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', height: '100%' }}>
            <div style={{ background: '#10B981', padding: '12px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>{riwayat.length}</div>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Diagnosa</div>
            </div>
          </div>
          <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', height: '100%' }}>
            <div style={{ background: '#EF4444', padding: '12px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>
                {riwayat.length > 0 ? riwayat[0].hasil_penyakit : "-"}
              </div>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Status Terakhir</div>
            </div>
          </div>
          <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', height: '100%' }}>
            <div style={{ background: '#3B82F6', padding: '12px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>
                {riwayat.length > 0 ? new Date(riwayat[0].tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
              </div>
              <div className="stat-label" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Diagnosa Terakhir</div>
            </div>
          </div>
        </div>

        {/* MAIN ACTIONS & HISTORY */}
        <div className="animate-in delay-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div className="card hover-scale" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #ECFDF5 0%, #ffffff 100%)', border: '1px solid #D1FAE5', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onClick={() => router.push('/diagnosa')}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '50%', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)', color: 'var(--primary)', marginBottom: '24px', transform: 'scale(1.1)' }}>
              <Stethoscope size={40} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Cek Kesehatan Baru</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '1rem', maxWidth: '80%' }}>Jangan tunda kesehatan Anda. Lakukan deteksi dini hanya dalam hitungan detik.</p>
            <Link href="/diagnosa" className="btn btn-primary btn-lg" style={{ width: '100%', maxWidth: '300px', boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.6)' }}>
              Mulai Sekarang
            </Link>
          </div>

          <div className="card riwayat-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', margin: 0 }}>
                <History size={18} style={{ color: 'var(--primary)' }} /> Riwayat Terakhir
              </h3>
              <Link href="/riwayat" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px', background: '#ECFDF5', padding: '5px 10px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                Lihat Semua <ChevronRight size={14} />
              </Link>
            </div>

            {riwayat.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '40px 20px', background: '#F9FAFB', borderRadius: '16px', border: '2px dashed #E5E7EB' }}>
                <Activity size={48} style={{ marginBottom: '16px', color: '#D1D5DB' }} />
                <p style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Belum ada riwayat medis.</p>
                <p style={{ fontSize: '0.9rem' }}>Mulai diagnosa pertama Anda hari ini!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {riwayat.map((item) => {
                  const tgl = new Date(item.tanggal);
                  const tanggalStr = tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                  const jamStr = tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', gap: '12px' }}>
                      {/* Kiri: nama + tanggal (2 baris) */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '4px' }}>{item.hasil_penyakit}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tanggalStr}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pukul {jamStr}</div>
                      </div>
                      {/* Kanan: badge persen */}
                      <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem', background: '#ECFDF5', padding: '6px 12px', borderRadius: '8px', flexShrink: 0 }}>{item.persentase}%</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
