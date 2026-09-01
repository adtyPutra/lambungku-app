"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LogIn, ArrowLeft, Loader2, User, Eye, EyeOff } from "lucide-react";

export default function LoginPasien() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah. Coba lagi.");
    } else if (data.user) {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card animate-in">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
            <User size={48} />
          </div>
          <h1>Masuk Akun</h1>
          <p>Masuk untuk melanjutkan diagnosis dan melihat rekam medis Anda</p>
        </div>
        
        {error && <div className="alert alert-error" style={{marginBottom:"16px"}}>{error}</div>}
        
        <form onSubmit={handleLogin}>
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
                placeholder="Masukkan password" 
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
              Lupa Password?
            </Link>
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{marginTop:"8px"}} disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" size={18} /> Memproses...</> : "Masuk"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Belum punya akun? <Link href="/register">Daftar di sini</Link></p>
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
