# 🎂 Birthday Website untuk Suami

Website ulang tahun yang cantik dan interaktif dengan React!

## 📁 Struktur File

```
birthday-website/
├── public/
│   ├── index.html
│   └── videos/              # Taruh video di sini
│       └── birthday-video.mp4
├── src/
│   ├── index.js
│   ├── index.css
│   └── birthday.jsx
├── package.json
└── tailwind.config.js
```

## 🚀 Cara Install & Jalankan

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan development server:**
   ```bash
   npm start
   ```

3. **Buka browser:** http://localhost:3000


## 📝 Customization

### Ubah Pesan:
Edit teks di `birthday.jsx` di bagian:
- Main message (baris 60-75)
- Surprise message (baris 96-102)
- Footer (baris 126-131)

### Ubah Warna:
- Ganti gradient: `from-purple-900 via-pink-800 to-rose-900`
- Ganti warna button: `from-pink-500 to-rose-500`

## 🎨 Features

✨ Animasi hati yang melayang
🎂 Icon kue bouncing
💝 Tombol surprise message
🎥 Video player terintegrasi
📱 Responsive (mobile & desktop friendly)

## 📦 Build untuk Production

```bash
npm run build
```

Nanti akan generate folder `build/` yang siap di-deploy ke hosting.

## 🌐 Deploy Options

- **Vercel:** Upload folder project, deploy gratis
- **Netlify:** Drag & drop folder `build/`
- **GitHub Pages:** Push ke repo, enable GitHub Pages

---

Made with ❤️ for your amazing husband!
