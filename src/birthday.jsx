import React, { useState, useEffect, useRef } from 'react';
import { Heart, Gift, Cake, Sparkles, Star, Trophy, Zap, Camera } from 'lucide-react';

export default function BirthdayWebsite() {
  const [showMessage, setShowMessage] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [particles, setParticles] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [showWishForm, setShowWishForm] = useState(false);
  const [newWish, setNewWish] = useState({ name: '', message: '', relation: 'Teman' });
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef(null);

  // GANTI INI dengan URL Worker API lo nanti
  const API_URL = 'https://birthday-wishes-api.birthday-wishes-ari.workers.dev/api/wishes';

  // Confetti explosion
  useEffect(() => {
    const createConfetti = () => {
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 3 + Math.random() * 2,
        rotation: Math.random() * 360,
        color: ['#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 5)]
      }));
      setConfetti(prev => [...prev, ...newConfetti]);
    };

    createConfetti();
    const interval = setInterval(createConfetti, 3000);
    return () => clearInterval(interval);
  }, []);

  // Particle system
  useEffect(() => {
    const createParticle = () => {
      setParticles(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: 10 + Math.random() * 10
      }]);
    };

    const interval = setInterval(createParticle, 200);
    return () => clearInterval(interval);
  }, []);

  // Cleanup old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setConfetti(prev => prev.slice(-100));
      setParticles(prev => prev.slice(-50));
    }, 5000);
    return () => clearInterval(cleanup);
  }, []);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = (window.scrollY / documentHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Load wishes from API
  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    try {
      setIsLoadingWishes(true);
      const response = await fetch(API_URL);
      
      if (response.ok) {
        const data = await response.json();
        setWishes(data.wishes || []);
      } else {
        console.error('Failed to load wishes');
      }
    } catch (error) {
      console.error('Error loading wishes:', error);
    } finally {
      setIsLoadingWishes(false);
    }
  };

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    
    if (newWish.name.trim() && newWish.message.trim()) {
      setIsSubmitting(true);
      
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newWish.name.trim(),
            message: newWish.message.trim(),
            relation: newWish.relation || 'Teman'
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          // Add new wish to the top of the list
          setWishes(prev => [data.wish, ...prev]);
          setNewWish({ name: '', message: '', relation: 'Teman' });
          setShowWishForm(false);
          alert('✨ Terima kasih! Ucapan kamu sudah terkirim dan bisa dilihat semua orang! 🎉');
        } else {
          alert('Maaf, gagal mengirim ucapan. Coba lagi ya!');
        }
      } catch (error) {
        console.error('Error submitting wish:', error);
        alert('Maaf, gagal mengirim ucapan. Coba lagi ya!');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const milestones = [
    { year: '20s', title: 'Si Petualang Cinta', desc: 'Aku tau masa ini karena cerita kamusih, masa dimana perjuangan dan penemuan diri sendiri tapi disini mantan kamu udah ada 20 ya kan?' },
    { year: '25', title: 'Terpaksa Dewasa', desc: 'Tahun terbaik saat kamu bisa memulai dunia yang sesungguhnya, walaupun tidak selamanya berjalan mulus tapi kamu hebat sudah berjuang!' },
    { year: '29', title: 'Pertemuan Kita', desc: 'Tiba-tiba banget ketemu? eh jodoh? eh nikah? ni pasti moment terbaik ya kan? karena kamu berhasil menikahi aku HAHAHA' },
    { year: '30', title: 'Era Baru!', desc: 'Tahun spektakuler dimulai! Selamat datang di usia 30, gak muda-muda amatsih tapi kannn gak tua juga hehehe' }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Static gradient background */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500 via-pink-500 to-orange-500 opacity-70"></div>
      </div>

      {/* Particle field */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `twinkle ${particle.duration}s ease-in-out infinite`,
            opacity: 0.6
          }}
        />
      ))}

      {/* Confetti */}
      {confetti.map(conf => (
        <div
          key={conf.id}
          className="absolute w-3 h-3 pointer-events-none"
          style={{
            left: `${conf.left}%`,
            top: '-20px',
            backgroundColor: conf.color,
            animation: `fall ${conf.duration}s linear forwards`,
            animationDelay: `${conf.delay}s`,
            transform: `rotate(${conf.rotation}deg)`
          }}
        />
      ))}

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700;900&family=Playfair+Display:wght@400;700;900&display=swap');
        
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes float-3d {
          0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
          33% { transform: translateY(-20px) rotateX(5deg) rotateY(5deg); }
          66% { transform: translateY(-10px) rotateX(-5deg) rotateY(-5deg); }
        }
        @keyframes neon-pulse {
          0%, 100% { 
            text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fbbf24, 0 0 40px #fbbf24;
          }
          50% { 
            text-shadow: 0 0 20px #fff, 0 0 30px #fbbf24, 0 0 40px #fbbf24, 0 0 50px #f59e0b, 0 0 60px #f59e0b;
          }
        }
        @keyframes expand {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-float-3d { animation: float-3d 6s ease-in-out infinite; }
        .animate-neon-pulse { animation: neon-pulse 2s ease-in-out infinite; }
        .animate-expand { animation: expand 0.8s ease-out forwards; }
        
        .text-neon {
          font-family: 'Orbitron', sans-serif;
        }
        .text-display {
          font-family: 'Playfair Display', serif;
        }
        .text-bold {
          font-family: 'Bebas Neue', sans-serif;
        }
      `}</style>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
          <div className="text-center w-full">
            <div className="mb-6 sm:mb-9 animate-float-3d">
              <div className="text-[8rem] sm:text-[12rem] md:text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 leading-none text-neon animate-neon-pulse" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                30
              </div>
              <div className="text-xl sm:text-2xl md:text-5xl text-amber-300 -mt-10 sm:-mt-16 md:-mt-20 tracking-widest text-bold">
                YEARS LEGENDARY
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 animate-expand" style={{ animationDelay: '0.3s' }}>
              <br />
              <h1 className="text-2xl sm:text-4xl md:text-7xl font-bold text-white text-display px-4">
                Happy Birthday <br /> ❤️ Ari Ilham Ramadhan ❤️
              </h1>
              <br />
              <p className="text-xl sm:text-2xl md:text-4xl text-amber-200">
                my handsome husband
              </p>
              <div className="flex justify-center gap-3 sm:gap-4 pt-6 sm:pt-8">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 animate-pulse" fill="currentColor" />
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 animate-pulse" fill="currentColor" style={{ animationDelay: '0.2s' }} />
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 animate-pulse" fill="currentColor" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>

            <div className="mt-8 sm:mt-12 animate-bounce">
              <div className="text-white/60 text-xs sm:text-sm">Scroll untuk petualangan</div>
              <div className="text-2xl sm:text-4xl mt-2">↓</div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="py-12 sm:py-20 px-4 relative">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-center text-white mb-12 sm:mb-20 text-bold">
            PERJALANAN KE 30
          </h2>
          
          <div className="max-w-5xl mx-auto relative">
            <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 via-rose-500 to-purple-500"></div>
            
            <div className="sm:hidden relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-rose-500 to-purple-500"></div>
              
              {milestones.map((milestone, idx) => (
                <div key={idx} className="relative mb-8">
                  <div className="absolute -left-[1.875rem] top-4 w-10 h-10 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full border-4 border-black flex items-center justify-center z-10">
                    <Heart className="w-5 h-5 text-white" fill="currentColor" />
                  </div>
                  
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                    <div className="text-4xl font-black text-amber-400 mb-2 text-neon">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-white mb-2 text-display">{milestone.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`flex items-center mb-20 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${idx % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/20 hover:scale-105 transition-transform duration-300">
                      <div className="text-5xl font-black text-amber-400 mb-2 text-neon">{milestone.year}</div>
                      <h3 className="text-2xl font-bold text-white mb-2 text-display">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.desc}</p>
                    </div>
                  </div>

                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full border-4 border-black flex items-center justify-center z-10">
                    <Heart className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Message Section */}
        <div className="py-12 sm:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-3xl p-6 sm:p-12 md:p-16 border border-white/20 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6 sm:mb-8 animate-float-3d">
                  <div className="bg-gradient-to-br from-amber-400 to-rose-500 p-6 sm:p-8 rounded-full">
                    <Cake className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-center text-white mb-6 sm:mb-8 text-display">
                  Welcome to Your 30s Era! 🎉
                </h2>

                <div className="text-base sm:text-xl md:text-2xl text-gray-200 space-y-4 sm:space-y-6 leading-relaxed text-center">
                  <p>
                    Sayang, 30 tahun bukan akhir dari sesuatu — tapi ini adalah <span className="text-amber-400 font-bold">awal dari dekade terbaik kamu!</span>
                  </p>
                  <p>
                    Kamu sudah jadi laki-laki luar biasa dan bertanggung jawab yang aku kenal, aku akan selalu ada di sisi kamu mendukung mimpi kamu, dan aku percaya kamu akan mencapai semua yang kamu impikan. aku selalu sayang kamu, lelaki hebatku.
                  </p>
                </div>

                <div className="flex justify-center mt-8 sm:mt-12">
                  <button
                    onClick={() => setShowMessage(!showMessage)}
                    className="group relative px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-xl font-bold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50"
                  >
                    <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                      <Gift className="w-5 h-5 sm:w-7 sm:h-7" />
                      Buka Pesan Rahasia
                      <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {showMessage && (
                  <div className="mt-8 sm:mt-12 bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-purple-500/20 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 animate-expand backdrop-blur-sm">
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="text-3xl sm:text-5xl mb-3 sm:mb-4">🎊✨🎁✨🎊</div>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-300 text-display">
                        Surprise Message!
                      </p>
                      <p className="text-sm sm:text-base md:text-xl text-white leading-relaxed">
                        sayang, maaf ya... aku belum bisa memberi sesuatu yang berarti untuk kamu, kita berdoa bareng-bareng yuk semoga rezeki kita semakin banyak kamu bolehh beli apa yang kamu mau sayangku, kita rayain kecil-kecilan dulu ya, kita rayain semua pencapaian yang ada di hidup kita saat ini, semoga apapun ujiannya kita bisa saling menguatkan satu sama lain, ditunggu ya kado impian kamu itu, sekali lagi selamat ulang tahun imamku, cintaku, surgaku
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="py-12 sm:py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 mx-auto mb-3 sm:mb-4 animate-pulse" />
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-3 sm:mb-4 text-bold">
                OUR STORY
              </h2>
            </div>

            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-amber-400/30 hover:border-amber-400/60 transition-all duration-300">
              <video 
                className="w-full"
                controls
                poster="/video/thumbnail.jpg"
              >
                <source src="/video/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Wishes Section - REAL-TIME with API */}
        <div className="py-12 sm:py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">💌</div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-3 sm:mb-4 text-bold">
                UCAPAN UNTUK ARI
              </h2>
              <p className="text-base sm:text-xl text-gray-300 mb-6">
                Haaaai sayang ini ada ucapan dan doa dari orang-orang yang sayang sama kamu loh! dibaca yaaa 
              </p>
              
              <button
                onClick={() => setShowWishForm(!showWishForm)}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  {showWishForm ? 'Tutup Form' : 'Kirim Ucapan Sekarang'}
                  <Sparkles className="w-5 h-5" />
                </span>
              </button>
            </div>

            {/* Wish Form */}
            {showWishForm && (
              <div className="max-w-2xl mx-auto mb-12 animate-expand">
                <form onSubmit={handleSubmitWish} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-amber-400/50">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center text-display">
                    ✨ Tulis Ucapan Kamu ✨
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm sm:text-base text-gray-300 mb-2 font-semibold">Nama Kamu</label>
                      <input
                        type="text"
                        value={newWish.name}
                        onChange={(e) => setNewWish({...newWish, name: e.target.value})}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base text-gray-300 mb-2 font-semibold">Hubungan dengan Ari</label>
                      <select
                        value={newWish.relation}
                        onChange={(e) => setNewWish({...newWish, relation: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all"
                        disabled={isSubmitting}
                      >
                        <option value="Teman" className="bg-gray-900">Teman</option>
                        <option value="Sahabat" className="bg-gray-900">Sahabat</option>
                        <option value="Keluarga" className="bg-gray-900">Keluarga</option>
                        <option value="Kolega" className="bg-gray-900">Kolega</option>
                        <option value="Lainnya" className="bg-gray-900">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base text-gray-300 mb-2 font-semibold">Ucapan Kamu</label>
                      <textarea
                        value={newWish.message}
                        onChange={(e) => setNewWish({...newWish, message: e.target.value})}
                        placeholder="Tulis ucapan selamat ulang tahun untuk Ari..."
                        rows="4"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all resize-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '⏳ Mengirim...' : '🎉 Kirim Ucapan 🎉'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Wishes Display */}
            {isLoadingWishes ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                <p className="text-gray-300 mt-4">Memuat ucapan...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
                  {wishes.slice(0, 50).map((wish, idx) => (
                    <div 
                      key={wish.id || idx} 
                      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:scale-105 transition-all duration-300 hover:border-amber-400/50 animate-expand"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0">
                          {wish.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-white text-display">{wish.name}</h3>
                          <p className="text-xs sm:text-sm text-amber-300">{wish.relation}</p>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-200 leading-relaxed italic">
                        "{wish.message}"
                      </p>
                      <div className="mt-4 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {wishes.length > 50 && (
                  <div className="text-center">
                    <p className="text-gray-400 text-sm sm:text-base">
                      Dan {wishes.length - 50} ucapan lainnya... 💕
                    </p>
                  </div>
                )}

                {wishes.length === 0 && !isLoadingWishes && (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-300">Belum ada ucapan. Jadilah yang pertama! 🎉</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-12 sm:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-center text-white mb-10 sm:mb-16 text-bold">
              30 YEARS IN NUMBERS
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {[
                { num: '10,950', label: 'Hari Hidup' },
                { num: '∞', label: 'Momen Berharga' },
                { num: '100%', label: 'Luar Biasa' },
                { num: '#1', label: 'Suami Terbaik' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 sm:p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-rose-400 mb-2 sm:mb-3 text-neon">
                    {stat.num}
                  </div>
                  <div className="text-xs sm:text-base md:text-lg text-gray-300 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-12 sm:py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-4xl sm:text-6xl mb-6 sm:mb-8">❤️</div>
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 mb-3 sm:mb-4 px-4">
              With all my love and excitement for what's next,
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400 text-display">
              Your Wife Tiara Cantik💕
            </p>
            <div className="mt-6 sm:mt-8 text-amber-400/60 text-xs sm:text-sm px-4">
              Made with ❤️ for my husband spectacular 30th birthday
            </div>
          </div>
        </div>
      </div>

      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/music/music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Control Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white p-3 sm:p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/30 backdrop-blur-sm"
        title={isMusicPlaying ? 'Pause Music' : 'Play Music'}
      >
        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xl sm:text-2xl">
          {isMusicPlaying ? '🔊' : '🔇'}
        </div>
      </button>
    </div>
  );
}