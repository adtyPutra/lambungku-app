'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Menu, X, LogOut, LogIn, Activity, History, Info, User, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activePage?: 'beranda' | 'dashboard' | 'diagnosa' | 'riwayat' | 'edukasi' | 'profil';
}

export default function Navbar({ activePage }: NavbarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserName(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserName(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Close profile menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef]);

  const fetchUserName = async (userId: string) => {
    const { data } = await supabase.from('Pengguna').select('nama').eq('id', userId).single();
    if (data && data.nama) {
      setUserName(data.nama);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getLinkStyle = (page: string) => {
    const isActive = activePage === page;
    return {
      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
      fontWeight: isActive ? 700 : 500,
    };
  };

  const initial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <nav className="navbar">
        {/* LOGO — kiri */}
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo">
            <img src="/logo.png" alt="Logo LambungKu" style={{ height: '32px' }} />
          </div>
          <div>
            <div className="navbar-title">LambungKu</div>
          </div>
        </Link>
        
        {/* NAV MENU */}
        <div className="navbar-nav">
          <Link href={session ? "/dashboard" : "/"} className="navbar-link hide-on-mobile" style={getLinkStyle('beranda')}>
            Beranda
          </Link>
          <Link href="/diagnosa" className="navbar-link hide-on-mobile" style={getLinkStyle('diagnosa')}>
            Mulai Diagnosa
          </Link>
          {session && (
            <>
              <Link href="/riwayat" className="navbar-link hide-on-mobile" style={getLinkStyle('riwayat')}>
                Riwayat
              </Link>
              <Link href="/edukasi" className="navbar-link hide-on-mobile" style={getLinkStyle('edukasi')}>
                Edukasi
              </Link>
            </>
          )}
          {session ? (
            <>
              {/* DESKTOP VIEW */}
              <Link href="/profil" className="navbar-link hide-on-mobile" style={getLinkStyle('profil')}>
                Profil
              </Link>
              <button onClick={handleLogout} className="navbar-link hide-on-mobile" style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogOut size={16} /> Keluar
              </button>

              {/* MOBILE VIEW: Avatar + Hamburger di kanan */}
              <div className="mobile-only-flex" style={{ alignItems: 'center', gap: '8px' }}>
                {/* AVATAR */}
                <div style={{ position: 'relative' }} ref={profileMenuRef}>
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', 
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {initial}
                  </button>

                  {/* DROPDOWN MENU */}
                  {isProfileMenuOpen && (
                    <div style={{ 
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', 
                      borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px',
                      width: '180px', zIndex: 100, border: '1px solid var(--border)'
                    }}>
                      <Link href="/profil" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', borderRadius: '8px', marginBottom: '4px' }} onClick={() => setIsProfileMenuOpen(false)}>
                        <User size={16} /> Profil Saya
                      </Link>
                      <button onClick={handleLogout} className="navbar-link" style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '8px', color: '#DC2626' }}>
                        <LogOut size={16} color="#DC2626" /> Keluar
                      </button>
                    </div>
                  )}
                </div>

                {/* HAMBURGER — di sebelah kanan avatar */}
                <button 
                  className="mobile-menu-btn" 
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Buka menu"
                  style={{ display: 'flex' }}
                >
                  <Menu size={24} color="var(--text-primary)" />
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LogIn size={18} strokeWidth={2.5} /> Masuk
            </Link>
          )}
        </div>
      </nav>

      {/* MOBILE SIDEBAR OVERLAY */}
      {session && (
        <>
          <div 
            className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={closeMobileMenu}
          />

          {/* MOBILE SIDEBAR DRAWER — dari kanan */}
          <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="mobile-drawer-header">
              <Link href="/" className="navbar-brand" onClick={closeMobileMenu}>
                <div className="navbar-logo">
                  <img src="/logo.png" alt="Logo LambungKu" style={{ height: '28px' }} />
                </div>
                <div className="navbar-title">LambungKu</div>
              </Link>
              <button 
                className="mobile-close-btn" 
                onClick={closeMobileMenu}
                aria-label="Tutup menu"
              >
                <X size={24} color="var(--text-secondary)" />
              </button>
            </div>

            <div className="mobile-drawer-content">
              <div className="mobile-nav-group">
                <Link href="/dashboard" className={`mobile-nav-link ${activePage === 'beranda' || activePage === 'dashboard' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Beranda
                </Link>
                <Link href="/diagnosa" className={`mobile-nav-link ${activePage === 'diagnosa' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Diagnosa
                </Link>
                <Link href="/riwayat" className={`mobile-nav-link ${activePage === 'riwayat' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Riwayat
                </Link>
                <Link href="/edukasi" className={`mobile-nav-link ${activePage === 'edukasi' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Edukasi
                </Link>
                <Link href="/profil" className={`mobile-nav-link ${activePage === 'profil' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Profil Saya
                </Link>
                <button
                  onClick={() => { handleLogout(); closeMobileMenu(); }}
                  className="mobile-nav-link"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#DC2626', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <LogOut size={18} color="#DC2626" /> Keluar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
