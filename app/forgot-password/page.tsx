'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldQuestion } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Terjadi kesalahan saat memproses permintaan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card animate-in">
        
        {isSuccess ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', background: '#ECFDF5', color: '#10B981', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
              <CheckCircle2 size={48} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Cek Email Anda</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Kami telah mengirimkan instruksi untuk mengatur ulang kata sandi ke <strong>{email}</strong>.
            </p>
            <Link href="/login" className="btn btn-primary btn-full">
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
                <ShieldQuestion size={48} />
              </div>
              <h1>Lupa Kata Sandi</h1>
              <p>Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.</p>
            </div>
            
            {errorMsg && <div className="alert alert-error" style={{marginBottom:"16px"}}>{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Alamat Email</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className="form-input" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="anda@email.com" 
                    required 
                    style={{ paddingLeft: '40px' }}
                  />
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Mail size={18} />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-full" style={{marginTop:"8px"}} disabled={loading}>
                {loading ? <><Loader2 className="animate-spin" size={18} /> Mengirim Tautan...</> : "Kirim Tautan Reset"}
              </button>
            </form>
            
            <div className="auth-footer">
              <div style={{ marginTop: '24px' }}>
                <Link href="/login" style={{color:"var(--text-muted)", display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration:"none"}}>
                  <ArrowLeft size={14} /> Kembali ke Halaman Login
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
