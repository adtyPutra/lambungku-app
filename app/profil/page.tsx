'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { User, Lock, Save, LogOut, ShieldCheck, Eye, EyeOff, Mail } from 'lucide-react';

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [msgName, setMsgName] = useState({ text: '', type: '' });
  const [msgPass, setMsgPass] = useState({ text: '', type: '' });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session.user);
      if (session.user.email) {
        setEmail(session.user.email);
      }
      
      // Get current name
      const { data } = await supabase
        .from('Pengguna')
        .select('nama')
        .eq('id', session.user.id)
        .single();
        
      if (data) {
        setNama(data.nama);
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    
    setSavingName(true);
    setMsgName({ text: '', type: '' });
    
    try {
      const { error } = await supabase
        .from('Pengguna')
        .update({ nama: nama })
        .eq('id', user.id);
        
      if (error) throw error;
      setMsgName({ text: 'Nama berhasil diperbarui!', type: 'success' });
      setTimeout(() => setMsgName({ text: '', type: '' }), 3000);
    } catch (error: any) {
      setMsgName({ text: error.message || 'Gagal memperbarui nama.', type: 'error' });
      setTimeout(() => setMsgName({ text: '', type: '' }), 3000);
    } finally {
      setSavingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setMsgPass({ text: 'Password minimal 6 karakter', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsgPass({ text: 'Konfirmasi password tidak cocok', type: 'error' });
      return;
    }
    
    setSavingPass(true);
    setMsgPass({ text: '', type: '' });
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
        
      if (error) throw error;
      setMsgPass({ text: 'Password berhasil diperbarui!', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMsgPass({ text: '', type: '' }), 3000);
    } catch (error: any) {
      setMsgPass({ text: error.message || 'Gagal memperbarui password.', type: 'error' });
      setTimeout(() => setMsgPass({ text: '', type: '' }), 3000);
    } finally {
      setSavingPass(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>Memuat halaman...</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(to bottom, #F8FAFC, #FAFAFA)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* NAVBAR */}
      <Navbar activePage="profil" />

      {/* CONTENT */}
      <div className="container">
        
        {/* HEADER */}
        <div className="animate-in delay-1" style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
            Pengaturan Profil
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.1rem' }}>Kelola data diri dan keamanan akun Anda.</p>
        </div>

        {/* FORMS GRID */}
        <div className="animate-in delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          
          {/* IDENTITAS DIRI */}
          <div className="card hover-scale" style={{ padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}><User size={20} /> Identitas Diri</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>Nama ini akan ditampilkan di halaman dashboard dan riwayat diagnosa Anda.</p>
            
            <form onSubmit={handleUpdateName} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Nama Lengkap</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={nama} 
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    required
                    style={{ padding: '14px 14px 14px 40px', borderRadius: '10px' }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '28px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Alamat Email</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={email} 
                    readOnly
                    style={{ padding: '14px 14px 14px 40px', borderRadius: '10px', background: '#F8FAFC', color: '#64748B' }}
                  />
                </div>
              </div>
              </div>

              <div style={{ position: 'relative' }}>
                {msgName.text && (
                  <div className="animate-in fade-in zoom-in-95 duration-200" style={{ position: 'absolute', bottom: '100%', left: 0, width: '100%', marginBottom: '16px', padding: '12px', borderRadius: '10px', background: msgName.type === 'success' ? '#ECFDF5' : '#FEF2F2', color: msgName.type === 'success' ? '#059669' : '#DC2626', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    {msgName.type === 'success' && <ShieldCheck size={18} />} {msgName.text}
                  </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={savingName} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', fontSize: '1rem', width: '100%', justifyContent: 'center' }}>
                  <Save size={18} /> {savingName ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>

          {/* GANTI PASSWORD */}
          <div className="card hover-scale" style={{ padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}><Lock size={20} /> Ubah Kata Sandi</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>Pastikan akun Anda tetap aman dengan kata sandi yang kuat.</p>
            
            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Kata Sandi Baru</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                    style={{ padding: '14px', borderRadius: '10px', paddingRight: '48px' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Konfirmasi Kata Sandi</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    className="form-input" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    required
                    minLength={6}
                    style={{ padding: '14px', borderRadius: '10px', paddingRight: '48px' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>
              
              </div>

              <div style={{ position: 'relative' }}>
                {msgPass.text && (
                  <div className="animate-in fade-in zoom-in-95 duration-200" style={{ position: 'absolute', bottom: '100%', left: 0, width: '100%', marginBottom: '16px', padding: '12px', borderRadius: '10px', background: msgPass.type === 'success' ? '#ECFDF5' : '#FEF2F2', color: msgPass.type === 'success' ? '#059669' : '#DC2626', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    {msgPass.type === 'success' && <ShieldCheck size={18} />} {msgPass.text}
                  </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={savingPass} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', fontSize: '1rem', width: '100%', justifyContent: 'center' }}>
                  <Save size={18} /> {savingPass ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
