"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Stethoscope, ClipboardList, CheckCircle2, Search, Loader2, AlertTriangle, LogOut } from "lucide-react";

export default function DiagnosaPage() {
  const [symptoms, setSymptoms] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setCheckingAuth(false);
        supabase.from('Gejala').select('*')
          .then(({ data, error }) => {
            if (!error && data) {
              const map: Record<string, string> = {};
              data.forEach((s: any) => map[s.id] = s.nama);
              setSymptoms(map);
            }
            setFetching(false);
          });
      }
    });
  }, [router]);

  const toggle = (code: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0) return alert("Pilih minimal satu gejala!");
    setLoading(true);
    
    // Simulate AI scanning animation for better UX
    await new Promise(r => setTimeout(r, 2000));
    
    const res = await fetch("/api/diagnosa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: Array.from(selected) }),
    });
    const data = await res.json();
    sessionStorage.setItem("diagnosisResult", JSON.stringify(data));
    sessionStorage.removeItem("fromRiwayat");
    sessionStorage.removeItem("diagnosisSaved"); // Reset flag agar hasil yang baru bisa disimpan ke riwayat
    router.push("/hasil");
  };

  if (checkingAuth) {
    return (
      <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"20px"}}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p style={{color:"var(--text-muted)"}}>Memeriksa sesi...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar activePage="diagnosa" />

      <div className="container">
        <div className="animate-in" style={{marginBottom: "36px"}}>
          <div style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"#ECFDF5", color:"var(--primary)", padding:"6px 14px", borderRadius:"100px", fontWeight:600, fontSize:"0.8rem", marginBottom:"16px"}}>
            <ClipboardList size={16} /> Langkah 1 dari 2
          </div>
          <h1 style={{fontSize:"2.25rem", fontWeight:700, letterSpacing:"-0.025em", lineHeight:1.2, marginBottom:"12px"}}>
            Pilih Gejala yang<br /><span style={{color:"var(--primary)"}}>Anda Rasakan</span>
          </h1>
          <p style={{color:"var(--text-secondary)", fontSize:"1rem", lineHeight:1.6}}>
            Centang semua gejala yang sedang Anda alami. Semakin lengkap gejala yang dipilih, semakin akurat hasil diagnosis.
          </p>
        </div>

        <div className="alert alert-warning animate-in" style={{marginBottom:"24px"}}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span><strong>Perhatian:</strong> Sistem pakar ini dirancang untuk memberikan informasi awal berdasarkan keluhan yang Anda masukkan, dan <strong>bukan</strong> merupakan alat diagnosis pasti atau pengganti konsultasi dengan dokter spesialis.</span>
        </div>

        {selected.size > 0 && (
          <div className="selected-count animate-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {selected.size} gejala dipilih
          </div>
        )}

        {fetching ? (
          <div style={{textAlign:"center", padding:"60px 0", color:"var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px"}}>
            <Loader2 size={32} className="animate-spin" /> Memuat daftar gejala...
          </div>
        ) : (
          <div className="card" style={{marginBottom:"28px"}}>
            <div className="card-header">
              <h2>Daftar Gejala</h2>
              <p>Klik pada gejala untuk memilih atau membatalkan pilihan</p>
            </div>
            <div className="symptom-grid">
              {Object.entries(symptoms).map(([code, name]) => (
                <div
                  key={code}
                  className={`symptom-item ${selected.has(code) ? "selected" : ""}`}
                  onClick={() => toggle(code)}
                >
                  <div className="symptom-check"></div>
                  <span className="symptom-code">{code}</span>
                  <span className="symptom-name">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleSubmit}
          disabled={loading || fetching}
          style={{opacity: loading ? 0.7 : 1}}
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Menganalisis...</>
          ) : (
            <><Search size={18} /> Proses Diagnosis</>
          )}
        </button>
      </div>

      <footer>
        <p>© 2025 <strong>LambungKu</strong> · Sistem Pakar Diagnosis Penyakit Lambung</p>
      </footer>
    </div>
  );
}
