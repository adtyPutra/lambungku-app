'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { ArrowLeft, BookOpen, LogOut, History, User, X } from 'lucide-react';

export default function EdukasiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>Memuat halaman...</div>
      </div>
    );
  }

  const articles = [
    {
      id: 1,
      title: "Pentingnya Makan Teratur",
      desc: "Menjaga jadwal makan yang konsisten membantu menstabilkan produksi asam lambung dan mencegah iritasi dinding lambung.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
      fullContent: "Menjaga jadwal makan yang teratur adalah langkah paling mendasar namun sering diabaikan dalam menjaga kesehatan lambung. Lambung kita memiliki jam biologisnya sendiri dalam memproduksi asam lambung (HCl) untuk mencerna makanan.\n\nJika Anda terbiasa makan pada jam 12 siang, lambung akan bersiap dan mulai memproduksi asam menjelang jam tersebut. Bila perut kosong karena Anda menunda makan, asam lambung yang berlebih akan mengiritasi lapisan mukosa lambung, memicu perih, kembung, hingga radang lambung (gastritis).\n\nOleh karena itu, biasakan makan dalam porsi kecil namun sering (5-6 kali sehari) dibandingkan makan porsi besar 3 kali sehari. Hindari menunda lapar, dan selalu sediakan camilan sehat seperti biskuit gandum atau buah pisang untuk mengganjal perut."
    },
    {
      id: 2,
      title: "Manajemen Stres",
      desc: "Stres psikologis adalah salah satu pemicu utama dispepsia dan GERD. Lakukan relaksasi atau meditasi harian.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
      fullContent: "Terdapat hubungan yang sangat kuat antara otak dan saluran pencernaan, yang sering disebut sebagai 'Gut-Brain Axis'. Saat Anda mengalami stres, cemas, atau depresi, otak mengirimkan sinyal yang dapat merangsang produksi asam lambung berlebih dan memperlambat proses pengosongan lambung.\n\nKondisi ini menjelaskan mengapa saat sedang banyak pikiran, Anda sering merasa mual, perut kembung, atau asam lambung naik ke kerongkongan (GERD). Manajemen stres bukan sekadar saran klise, melainkan terapi medis yang nyata untuk penderita penyakit lambung.\n\nLuangkan waktu 10-15 menit setiap hari untuk melakukan teknik pernapasan dalam (deep breathing), yoga, atau sekadar berjalan kaki di alam terbuka. Tidur yang cukup juga sangat krusial dalam meregenerasi sel-sel pencernaan yang rusak."
    },
    {
      id: 3,
      title: "Pantangan Makanan",
      desc: "Hindari makanan yang terlalu pedas, asam, atau tinggi lemak jenuh karena dapat melemahkan katup esofagus bawah.",
      image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=800&auto=format&fit=crop",
      fullContent: "Pemilihan makanan memainkan peran vital dalam proses penyembuhan lambung. Ada beberapa jenis makanan yang secara langsung dapat melukai dinding lambung atau melemahkan sfingter esofagus bagian bawah (otot penahan asam lambung agar tidak naik).\n\nSecara medis, pasien dengan gangguan lambung disarankan untuk menghindari:\n1. Makanan Pedas (Cabai, merica, sambal) yang mengiritasi langsung dinding lambung.\n2. Makanan Asam (Jeruk sitrus, tomat, cuka) yang menambah kadar keasaman.\n3. Makanan Berlemak Tinggi (Gorengan, jeroan, susu *full cream*) yang memperlama makanan berdiam di lambung sehingga memicu produksi asam ekstra.\n4. Cokelat, mint, dan bawang mentah yang dapat melemahkan otot sfingter.\n\nGantilah dengan protein mudah cerna seperti ikan rebus, ayam tanpa kulit, sayuran berdaun hijau gelap, dan karbohidrat kompleks seperti *oatmeal*."
    },
    {
      id: 4,
      title: "Pola Tidur yang Baik",
      desc: "Tidur minimal 7 jam dan hindari berbaring tepat setelah makan (beri jeda 2-3 jam) untuk mencegah refluks asam.",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop",
      fullContent: "Masalah lambung seringkali memburuk di malam hari, mengganggu kualitas tidur Anda. Hal ini biasanya terjadi karena gaya gravitasi tidak lagi membantu menahan asam lambung tetap di perut saat Anda berbaring.\n\nAturan emas bagi penderita penyakit lambung adalah: **Jangan pernah berbaring atau tidur setidaknya 2-3 jam setelah makan.** Waktu ini dibutuhkan oleh lambung untuk memproses makanan dan mengosongkannya ke usus halus.\n\nJika Anda sering mengalami GERD di malam hari, cobalah tidur dengan posisi bantal atau kepala tempat tidur ditinggikan sekitar 15-20 sentimeter. Selain itu, tidur miring menghadap ke sebelah kiri secara anatomis terbukti mencegah asam lambung naik kembali ke esofagus."
    },
    {
      id: 5,
      title: "Olahraga Ringan",
      desc: "Aktivitas fisik ringan seperti jalan kaki atau yoga membantu pencernaan berjalan lancar. Hindari olahraga berat usai makan.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
      fullContent: "Olahraga rutin sangat disarankan untuk menjaga berat badan ideal dan memperlancar metabolisme pencernaan. Namun, bagi penderita dispepsia atau GERD, jenis dan waktu olahraga perlu diperhatikan dengan saksama.\n\nHindari olahraga dengan intensitas tinggi (seperti lari cepat, angkat beban berat, atau aerobik melompat) tepat setelah makan. Guncangan kuat pada perut dapat memicu refluks dan kram lambung. Olahraga yang melibatkan posisi kepala di bawah perut (seperti beberapa pose yoga) juga sebaiknya dibatasi jika Anda sedang mengalami gejala aktif.\n\nPilihan olahraga terbaik adalah jalan cepat, bersepeda santai, atau berenang yang dilakukan pada pagi hari sebelum sarapan besar atau sore hari dengan perut yang tidak terlalu penuh."
    },
    {
      id: 6,
      title: "Batasi Kafein & Alkohol",
      desc: "Kopi, teh kental, dan minuman bersoda merangsang produksi asam berlebih. Gantilah dengan air hangat atau teh chamomile.",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop",
      fullContent: "Minuman sehari-hari kita bisa menjadi musuh tersembunyi bagi lambung. Kafein yang terdapat dalam kopi, teh kental, minuman berenergi, serta minuman bersoda (karbonasi) memiliki efek ganda yang merusak:\n\nPertama, kafein secara langsung menstimulasi sel-sel parietal di lambung untuk memproduksi asam lebih banyak dari biasanya. Kedua, minuman berkafein dan beralkohol merelaksasi katup yang memisahkan lambung dan kerongkongan, sehingga mempermudah terjadinya refluks (GERD).\n\nBila Anda penggemar kopi, cobalah beralih ke kopi *decaf* atau secara perlahan menggantinya dengan teh herbal yang menenangkan lambung, seperti teh *chamomile*, rebusan jahe ringan, atau cukup air putih hangat yang melimpah."
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(to bottom, #F0FDF4, #FAFAFA)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* NAVBAR */}
      <Navbar activePage="edukasi" />

      {/* CONTENT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 5%' }}>

        {/* HEADER */}
        <div className="animate-in delay-1" style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>
            Pojok Edukasi Medis
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '1rem' }}>Artikel informatif untuk menjaga kesehatan lambung Anda.</p>
        </div>

        {/* ARTICLES GRID */}
        <div className="animate-in delay-2 edukasi-grid">
          {articles.map((article) => (
            <div key={article.id} className="card edukasi-card hover-scale" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
              <div className="edukasi-img-wrap" style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  className="article-img"
                />
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{article.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '16px', flex: 1 }}>
                  {article.desc}
                </p>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
                >
                  <BookOpen size={16} fill="white" color="white" /> Baca Selengkapnya
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedArticle(null)}>
          <div
            style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            onClick={(e) => e.stopPropagation()}
            className="animate-in"
          >
            <button onClick={() => setSelectedArticle(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <X size={20} color="var(--text-primary)" />
            </button>

            <div style={{ height: '300px', width: '100%', overflow: 'hidden' }}>
              <img src={selectedArticle.image} alt={selectedArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ background: '#ECFDF5', color: 'var(--primary)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', marginBottom: '16px' }}>
                Artikel Medis
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: 'var(--text-primary)' }}>{selectedArticle.title}</h2>

              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                {selectedArticle.fullContent.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} style={{ marginBottom: '16px' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <button onClick={() => setSelectedArticle(null)} className="btn btn-outline" style={{ padding: '10px 32px' }}>Tutup Artikel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .article-img:hover {
          transform: scale(1.05);
        }
        body {
          overflow: ${selectedArticle ? 'hidden' : 'auto'};
        }
      `}} />
    </div>
  );
}
