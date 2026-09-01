"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { getAppData } from "@/lib/db";
import { forwardChaining } from "@/lib/engine";
import { History, ArrowLeft, Loader2, Calendar, Activity, ChevronRight, LogOut, Printer } from "lucide-react";

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printingId, setPrintingId] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from('Riwayat')
      .select('*')
      .eq('pengguna_id', session.user.id)
      .order('tanggal', { ascending: false });

    if (!error && data) {
      setRiwayat(data);
    }
    setLoading(false);
  };

  const handlePrint = async (r: any) => {
    setPrintingId(r.id);
    try {
      const data = await getAppData();
      // Extract symptom codes like "G01" from "G01 - Mual pada perut"
      const selectedSymptoms = r.gejala_dipilih.map((g: string) => g.split(" - ")[0]);
      
      const results = forwardChaining(selectedSymptoms, data);
      
      const dataToSave = {
        symptoms: data.symptoms,
        results: results,
      };
      sessionStorage.setItem("diagnosisResult", JSON.stringify(dataToSave));
      sessionStorage.setItem("fromRiwayat", "true");
      
      router.push("/hasil");
    } catch (e) {
      console.error(e);
      alert("Gagal memuat detail riwayat");
    } finally {
      setPrintingId(null);
    }
  };

  const formatDate = (isoString: string) => {
    // Supabase 'timestamp without time zone' returns without 'Z', causing JS to parse it as local time.
    // We append 'Z' so it correctly parses as UTC time before formatting to local time.
    const dateStr = isoString.endsWith('Z') ? isoString : isoString + 'Z';
    const date = new Date(dateStr);
    const tgl = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      timeZone: 'Asia/Jakarta'
    }).format(date);
    const jam = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    }).format(date).replace('.', ':');
    return { tgl, jam };
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 60%)', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar activePage="riwayat" />

      <div className="container" style={{ paddingTop: '40px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "6px" }}>
            Riwayat Diagnosa
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Rekam medis hasil diagnosa Anda sebelumnya.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <Loader2 size={32} className="animate-spin" /> Memuat riwayat...
          </div>
        ) : riwayat.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Activity size={48} />
            </div>
            <h2 style={{ fontWeight: 600, marginBottom: "12px" }}>Belum Ada Riwayat</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Anda belum pernah melakukan diagnosa penyakit lambung.</p>
            <Link href="/diagnosa" className="btn btn-primary">Mulai Diagnosa Sekarang</Link>
          </div>
        ) : (
          /* DESKTOP 2-COLUMN LAYOUT */
          <div className="riwayat-layout">
            {/* KOLOM KIRI - Ringkasan */}
            <div className="riwayat-sidebar">
              <div className="card" style={{ padding: "20px", marginBottom: "16px", background: "linear-gradient(135deg, var(--primary) 0%, #059669 100%)", color: "white", border: "none" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.85, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Diagnosa</div>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1 }}>{riwayat.length}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "4px" }}>pemeriksaan tercatat</div>
              </div>

              <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Diagnosis Terakhir</div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "4px" }}>{riwayat[0]?.hasil_penyakit || "-"}</div>
                {(() => { const { tgl } = formatDate(riwayat[0]?.tanggal); return <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{tgl}</div>; })()}
              </div>

              <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Keyakinan Rata-rata</div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                  {Math.round(riwayat.reduce((acc: number, r: any) => acc + r.persentase, 0) / riwayat.length)}%
                </div>
              </div>

              <Link href="/diagnosa" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                + Diagnosa Baru
              </Link>
            </div>

            {/* KOLOM KANAN - Daftar riwayat */}
            <div className="riwayat-list">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {riwayat.map((r) => {
              const { tgl, jam } = formatDate(r.tanggal);
              return (
                <div key={r.id} className="card riwayat-item-card" style={{ padding: "20px 24px" }}>
                  {/* Baris atas: nama + tanggal kiri | persen + tombol kanan */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "14px" }}>
                    {/* Kiri */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "5px" }}>
                        {r.hasil_penyakit}
                      </div>
                      {/* Desktop: 1 baris | Mobile: 2 baris */}
                      <div className="riwayat-date-desktop" style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={12} /> {tgl} · Pukul {jam} WIB
                      </div>
                      <div className="riwayat-date-mobile" style={{ display: "none" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{tgl}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Pukul {jam} WIB</div>
                      </div>
                    </div>
                    {/* Kanan: badge + tombol */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ background: "#ECFDF5", color: "var(--primary)", fontWeight: 700, fontSize: "1.1rem", padding: "5px 14px", borderRadius: "10px", lineHeight: 1 }}>
                          {r.persentase}%
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "3px" }}>Keyakinan</div>
                      </div>
                      <button 
                        onClick={() => handlePrint(r)} 
                        disabled={printingId === r.id}
                        className="btn btn-secondary riwayat-action-btn" 
                        style={{ fontSize: "0.82rem", padding: "7px 14px", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap" }}
                      >
                        {printingId === r.id ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                  
                  {/* Gejala */}
                  <div style={{ background: "#F9FAFB", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "7px" }}>Gejala yang dirasakan:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {r.gejala_dipilih.map((g: string, i: number) => {
                        const parts = g.split(" - ");
                        const nama = parts.length > 1 ? parts.slice(1).join(" - ") : g;
                        return (
                          <span key={i} className="tag tag-gray" style={{ fontSize: "0.75rem" }}>{nama}</span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
