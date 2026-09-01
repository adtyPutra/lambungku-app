"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Stethoscope, CheckCircle2, AlertTriangle, SearchX, ArrowLeft, Info, BookOpen, Activity, Zap, Printer, MapPin, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Disease {
  name: string;
  description: string;
  causes: string[];
  solution: string[];
  symptoms: string[];
  min_match: number;
}
interface DiagnosisResult {
  key: string;
  disease: Disease;
  matched: string[];
  score: number;
  percentage: number;
  isConfirmed?: boolean;
}
interface ResultData {
  results: DiagnosisResult[];
  symptoms: Record<string, string>;
}

export default function HasilPage() {
  const [data, setData] = useState<ResultData | null>(null);
  const [saved, setSaved] = useState(false);
  const [isHistoryView, setIsHistoryView] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("diagnosisResult");
    const fromHistory = sessionStorage.getItem("fromRiwayat") === "true";
    setIsHistoryView(fromHistory);

    if (raw) {
      const parsedData = JSON.parse(raw);
      setData(parsedData);
      if (!fromHistory) {
        saveToHistory(parsedData);
      } else {
        setTimeout(() => window.print(), 500);
      }
    }
  }, []);

  const saveToHistory = async (resultData: ResultData) => {
    if (saved) return;
    
    // Cegah double-save akibat React Strict Mode (Race Condition)
    // Set flag secara sinkron SEBELUM melakukan await apapun
    if (sessionStorage.getItem("diagnosisSaved") === "true") {
      setSaved(true);
      return;
    }
    sessionStorage.setItem("diagnosisSaved", "true");
    
    const { data: sessionData } = await supabase.auth.getSession();
    const confirmed = resultData.results.filter(r => r.isConfirmed);
    if (sessionData?.session && resultData.results.length > 0) {
      const bestMatch = confirmed.length > 0 ? confirmed[0] : resultData.results[0];
      const gejalaTeks = bestMatch.matched.map(g => `${g} - ${resultData.symptoms[g]}`);
      
      await supabase.from('Riwayat').insert({
        pengguna_id: sessionData.session.user.id,
        gejala_dipilih: gejalaTeks,
        hasil_penyakit: confirmed.length > 0 ? bestMatch.disease.name : "Diagnosis Tidak Pasti",
        persentase: bestMatch.percentage
      });
      setSaved(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!data) {
    return (
      <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"20px"}}>
        <p style={{color:"var(--text-muted)"}}>Memuat hasil...</p>
        <Link href="/diagnosa" className="btn btn-primary"><ArrowLeft size={16} /> Kembali ke Diagnosa</Link>
      </div>
    );
  }

  const normalizedResults = data.results.map(r => ({
    ...r,
    isConfirmed: r.isConfirmed !== undefined ? r.isConfirmed : r.matched.length >= r.disease.min_match
  }));
  const confirmed = normalizedResults.filter(r => r.isConfirmed);
  const partial = normalizedResults.filter(r => !r.isConfirmed);
  const top = confirmed.length > 0 ? confirmed[0] : null;
  const allOthers = confirmed.length > 0 ? [...confirmed.slice(1), ...partial] : partial;
  const others = allOthers.filter(o => o.percentage >= 50).slice(0, 3);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; color: black; }
          .container { max-width: 100% !important; padding: 20px !important; margin: 0 !important; }
          .card { border: none !important; box-shadow: none !important; padding: 0 !important; margin-bottom: 24px !important; background: transparent !important; }
          h1, h2, h3, p, span, div { color: black !important; }
          .tag { border: 1px solid #ccc !important; background: transparent !important; color: black !important; }
          .alert { border: 1px solid #000 !important; background: transparent !important; color: black !important; }
          svg { stroke: black !important; }
        }
      `}} />
      <nav className="navbar no-print">
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo">
            <img src="/logo.png" alt="Logo LambungKu" style={{ height: '32px' }} />
          </div>
          <div className="navbar-title">LambungKu</div>
        </Link>
        <div className="navbar-nav">
          {isHistoryView ? (
            <Link href="/riwayat" className="navbar-link" style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem'}}><ArrowLeft size={16} /> <span className="hide-on-mobile">Kembali ke </span>Riwayat</Link>
          ) : (
            <Link href="/diagnosa" className="navbar-link" style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem'}}><ArrowLeft size={16} /> <span className="hide-on-mobile">Ulangi </span>Diagnosa</Link>
          )}
        </div>
      </nav>

      <div className="container" style={{ paddingBottom: '60px' }}>
        {/* --- PRINT ONLY: FORMAL MEDICAL LETTER --- */}
        <div className="print-only">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', borderBottom: '3px solid black', paddingBottom: '16px', marginBottom: '24px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '50px', height: '50px', filter: 'grayscale(100%)' }} />
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>SISTEM PAKAR LAMBUNGKU</h1>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', textDecoration: 'underline', margin: '0 0 8px 0' }}>SURAT KETERANGAN HASIL DIAGNOSIS AWAL</h2>
            <p style={{ fontSize: '14px', margin: 0 }}>Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <p style={{ marginBottom: '16px', lineHeight: 1.6, fontSize: '14px' }}>
            Berdasarkan analisis gejala yang telah dilakukan melalui Sistem Pakar LambungKu, dengan ini diterangkan bahwa pasien mengeluhkan gejala-gejala berikut:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '24px', lineHeight: 1.6, fontSize: '14px' }}>
            {top ? top.matched.map(g => (
              <li key={g}>{data.symptoms[g]}</li>
            )) : data.results[0].matched.map(g => (
              <li key={g}>{data.symptoms[g]}</li>
            ))}
          </ul>

          <p style={{ marginBottom: '16px', lineHeight: 1.6, fontSize: '14px' }}>
            Dari gejala-gejala tersebut, hasil diagnosis awal menunjukkan:
          </p>

          <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', width: '200px', fontWeight: 'bold', verticalAlign: 'top' }}>Diagnosis Utama</td>
                <td style={{ padding: '8px 0', verticalAlign: 'top' }}>: {top ? top.disease.name : "Tidak Pasti (Gejala Tidak Mencukupi)"}</td>
              </tr>
              {top && (
                <>
                  <tr>
                    <td style={{ padding: '8px 0', fontWeight: 'bold', verticalAlign: 'top' }}>Tingkat Keyakinan</td>
                    <td style={{ padding: '8px 0', verticalAlign: 'top' }}>: {top.percentage}%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', fontWeight: 'bold', verticalAlign: 'top' }}>Deskripsi Penyakit</td>
                    <td style={{ padding: '8px 0', verticalAlign: 'top', lineHeight: 1.6 }}>: {top.disease.description}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {top && (
            <>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Kemungkinan Penyebab:</h3>
              <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse', fontSize: '14px' }}>
                <tbody>
                  {top.disease.causes.map((c, i) => (
                    <tr key={i}>
                      <td style={{ padding: '6px 8px', border: '1px solid #000', width: '30px', textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ padding: '6px 8px', border: '1px solid #000' }}>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Rekomendasi Penanganan Awal:</h3>
              <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse', fontSize: '14px' }}>
                <tbody>
                  {top.disease.solution.map((s, i) => (
                    <tr key={i}>
                      <td style={{ padding: '6px 8px', border: '1px solid #000', width: '30px', textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ padding: '6px 8px', border: '1px solid #000' }}>{s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {others.length > 0 && (
            <>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Diagnosis Banding (Kemungkinan Lain):</h3>
              <ul style={{ paddingLeft: '24px', marginBottom: '24px', lineHeight: 1.6, fontSize: '14px' }}>
                {others.map(o => (
                  <li key={o.key}>{o.disease.name} (Tingkat Keyakinan: {o.percentage}%)</li>
                ))}
              </ul>
            </>
          )}

          <p style={{ marginTop: '32px', marginBottom: '40px', lineHeight: 1.6, fontSize: '12px', fontStyle: 'italic' }}>
            Catatan: Surat keterangan ini dihasilkan oleh sistem pakar dan hanya bersifat sebagai informasi awal. Untuk diagnosis pasti dan penanganan medis yang tepat, harap berkonsultasi langsung dengan dokter spesialis.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
            <div style={{ textAlign: 'center', width: '250px' }}>
              <p style={{ marginBottom: '80px', fontSize: '14px' }}>Hormat Kami,</p>
              <p style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '14px', margin: 0 }}>Sistem Pakar LambungKu</p>
            </div>
          </div>
        </div>

        {/* --- SCREEN ONLY: INTERACTIVE UI --- */}
        <div className="screen-only no-print">
          {isHistoryView ? (
             <div className="card animate-in" style={{ textAlign: 'center', padding: '60px 20px', marginTop: '40px' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                  <Printer size={48} />
                </div>
                <h2 style={{fontWeight:700, marginBottom:"12px"}}>Mode Cetak Riwayat</h2>
                <p style={{color:"var(--text-secondary)", marginBottom:"28px"}}>Silakan gunakan dialog pencetakan yang muncul, atau tekan tombol di bawah ini untuk mencetak ulang.</p>
                <div style={{display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap"}}>
                  <button onClick={handlePrint} className="btn btn-primary btn-lg"><Printer size={18} /> Cetak Hasil PDF</button>
                  <Link href="/riwayat" className="btn btn-secondary btn-lg"><ArrowLeft size={18} /> Kembali ke Riwayat</Link>
                </div>
             </div>
          ) : (
            <>
              <div style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"#ECFDF5", color:"var(--primary)", padding:"6px 14px", borderRadius:"100px", fontWeight:600, fontSize:"0.8rem", marginBottom:"16px", marginTop: "40px"}}>
                <CheckCircle2 size={16} /> Langkah 2 dari 2 · Hasil Diagnosis
              </div>

          {data.results.length === 0 ? (
            <div className="card no-result animate-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <SearchX size={48} />
              </div>
              <h2 style={{fontWeight:700, marginBottom:"12px"}}>Tidak Ada Penyakit Terdeteksi</h2>
              <p style={{color:"var(--text-secondary)", marginBottom:"28px"}}>Gejala yang Anda pilih tidak mencukupi untuk mendiagnosis penyakit tertentu. Coba pilih lebih banyak gejala atau konsultasikan dengan dokter.</p>
              <Link href="/diagnosa" className="btn btn-primary no-print"><ArrowLeft size={16} /> Coba Lagi</Link>
            </div>
          ) : (
            <>
              <div className="animate-in no-print" style={{marginBottom:"28px"}}>
                <p style={{color:"var(--text-secondary)", fontSize:"0.95rem"}}>Berdasarkan gejala yang Anda rasakan, sistem mendeteksi kemungkinan penyakit berikut:</p>
              </div>

              {/* Primary Result or Warning */}
              {!top ? (
                <div className="card animate-in" style={{borderTop:"5px solid #F59E0B", marginBottom:"20px", background: '#FFFBEB'}}>
                  <div style={{display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"16px"}}>
                    <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '4px' }} />
                    <div>
                      <h2 style={{fontSize:"1.5rem", fontWeight:700, color:"#92400E", marginBottom:"8px"}}>Diagnosis Tidak Pasti</h2>
                      <p style={{color:"#B45309", fontSize:"0.95rem", lineHeight:1.6}}>
                        Gejala yang Anda pilih belum memenuhi kriteria minimum (rules) untuk diagnosis pasti penyakit lambung tertentu pada sistem kami. 
                        Namun, di bawah ini adalah beberapa kemungkinan penyakit yang memiliki kemiripan dengan gejala Anda.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card animate-in" style={{borderTop:"5px solid var(--primary)", marginBottom:"20px"}}>
                <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px", flexWrap:"wrap", marginBottom:"20px"}}>
                  <div>
                    <span className="tag tag-green" style={{marginBottom:"10px", display:"inline-flex", gap: '4px', alignItems: 'center'}}>
                      <CheckCircle2 size={14} /> Diagnosis Utama
                    </span>
                    <h1 style={{fontSize:"2rem", fontWeight:700, letterSpacing:"-0.025em"}}>{top.disease.name}</h1>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"2.5rem", fontWeight:700, color:"var(--primary)", lineHeight:1}}>{top.percentage}%</div>
                    <div style={{fontSize:"0.75rem", color:"var(--text-muted)", fontWeight:600}}>Tingkat Keyakinan</div>
                  </div>
                </div>
                
                <div className="no-print" style={{ background: '#F3F4F6', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <div style={{ background: 'var(--primary)', height: '100%', width: `${top.percentage}%`, transition: 'width 1s ease' }}></div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={18} /> Deskripsi</h3>
                  <p style={{color:"var(--text-secondary)", lineHeight:1.7, fontSize:"0.95rem"}}>{top.disease.description}</p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} /> Gejala yang Anda Rasakan</h3>
                  <div style={{display:"flex", flexWrap:"wrap", gap:"8px"}}>
                    {top.matched.map(g => (
                      <span key={g} className="tag tag-gray">{g} · {data.symptoms[g]}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={18} /> Kemungkinan Penyebab</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {top.disease.causes.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                        <Check size={18} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} /> Rekomendasi Penanganan</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {top.disease.solution.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#F0FDF4', padding: '12px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                        <CheckCircle2 size={18} style={{ color: '#16A34A', marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}

              {/* Emergency & Map Section */}
              <div className="card animate-in no-print" style={{ border: '1px solid #FCA5A5', background: '#FEF2F2', marginBottom: '20px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', marginBottom: '10px' }}>
                  <AlertTriangle size={18} />
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>Rekomendasi Fasilitas Kesehatan</h3>
                </div>
                <p style={{ color: '#991B1B', fontSize: '0.875rem', marginBottom: '14px', lineHeight: 1.5 }}>
                  Jika mengalami gejala darurat seperti <strong>muntah darah, kesulitan bernapas, atau nyeri dada hebat</strong>, segera kunjungi IGD atau klinik terdekat.
                </p>
                <a 
                  href="https://www.google.com/maps/search/Rumah+Sakit+atau+Klinik+Terdekat" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn" 
                  style={{ background: '#DC2626', color: 'white', display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', fontWeight: 600, fontSize: '0.875rem', borderRadius: '10px' }}
                >
                  <MapPin size={16} /> Cari Fasilitas Kesehatan
                </a>
              </div>

              {/* Other Results */}
              {others.length > 0 && (
                <div className="animate-in">
                  <h3 style={{fontWeight:600, marginBottom:"12px", fontSize: '1rem', color:"var(--text-secondary)"}}>Kemungkinan Lainnya</h3>
                  <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                    {others.map(r => (
                      <div key={r.key} className="card" style={{padding:"14px 16px"}}>
                        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap: '12px'}}>
                          <div style={{flex: 1, minWidth: 0}}>
                            <div style={{fontWeight:600, fontSize:"0.95rem", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{r.disease.name}</div>
                            <div style={{color:"var(--text-muted)", fontSize:"0.78rem", marginTop:"4px"}}>{r.matched.length} dari {r.disease.symptoms.length} gejala cocok</div>
                          </div>
                          <span style={{fontWeight:700, color:"var(--primary)", fontSize:"1.1rem", background:'#ECFDF5', padding:'4px 10px', borderRadius:'8px', flexShrink:0}}>{r.percentage}%</span>
                        </div>
                        <div className="no-print" style={{ background: '#F3F4F6', borderRadius: '4px', height: '5px', overflow: 'hidden', marginTop: '10px' }}>
                          <div style={{ background: 'var(--primary)', height: '100%', width: `${r.percentage}%`, opacity: 0.5 }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="alert alert-warning no-print" style={{marginTop:"32px"}}>
                <AlertTriangle size={18} />
                <span><strong>Disclaimer:</strong> Hasil ini hanya bersifat informatif dan bukan pengganti diagnosis medis profesional. Selalu konsultasikan kondisi Anda dengan dokter.</span>
              </div>

              <div className="no-print hasil-action-btns" style={{display:"flex", gap:"10px", marginTop:"24px", flexWrap:"wrap"}}>
              <button onClick={handlePrint} className="btn btn-primary"><Printer size={16} /> Cetak Hasil</button>
              {isHistoryView ? (
                <Link href="/riwayat" className="btn btn-secondary"><ArrowLeft size={16} /> Kembali</Link>
              ) : (
                <Link href="/diagnosa" className="btn btn-secondary"><ArrowLeft size={16} /> Ulangi Diagnosa</Link>
              )}
            </div>
            </>
          )}
          </>
          )}
        </div>
      </div>
    </>
  );
}
