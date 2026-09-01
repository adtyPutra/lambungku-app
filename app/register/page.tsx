"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UserPlus, ArrowLeft, Loader2, User, Eye, EyeOff } from "lucide-react";

export default function RegisterPasien() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    const { data, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: dbError } = await supabase.from('Pengguna').insert({
        id: data.user.id,
        nama: nama,
        role: 'pasien'
      });

      if (dbError) {
        setError("Gagal menyimpan profil pengguna: " + dbError.message);
      } else {
        setMsg("Pendaftaran berhasil! Anda akan dialihkan ke halaman Login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card animate-in">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
            <UserPlus size={48} />
          </div>
          <h1>Daftar Akun Baru</h1>
          <p>Daftar untuk mengakses fitur lengkap diagnosis dan rekam medis Anda</p>
        </div>
        
        {error && <div className="alert alert-error" style={{marginBottom:"16px"}}>{error}</div>}
        {msg && <div className="alert alert-success" style={{marginBottom:"16px"}}>{msg}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input 
              className="form-input" 
              type="text" 
              value={nama} 
              onChange={e => setNama(e.target.value)} 
              placeholder="Masukkan nama lengkap" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              className="form-input" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="anda@email.com" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="form-input" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Minimal 6 karakter" 
                minLength={6}
                style={{ paddingRight: '40px' }}
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{marginTop:"8px"}} disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" size={18} /> Memproses...</> : "Daftar Sekarang"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Sudah punya akun? <Link href="/login">Login di sini</Link></p>
          <div style={{ marginTop: '24px' }}>
            <Link href="/" style={{color:"var(--text-muted)", display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration:"none"}}>
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
