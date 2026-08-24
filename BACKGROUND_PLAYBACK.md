# Musicfly — Native Audio / Background Playback

Perubahan utama:
- YouTube iframe player dihapus dari Player.
- Playback sekarang menggunakan elemen HTML5 `<audio>`.
- `/api/audio?id=VIDEO_ID` mengambil direct audio stream dari YouTube dan mengarahkan browser ke signed media URL.
- Media Session API menyediakan Play/Pause/Next/Previous/Seek di lock screen/notification pada browser yang mendukung.
- Tidak lagi memakai silent-audio trick; audio native adalah sumber playback sebenarnya.

## Deploy ke Vercel
1. Upload/replace project dengan isi folder ini.
2. Jalankan deployment normal.
3. Pastikan dependency `@distube/ytdl-core` ter-install oleh Vercel.
4. Setelah deploy, buka Musicfly, putar lagu, lalu keluar dari Chrome/kunci layar.

## Catatan
Ekstraksi direct stream YouTube bersifat tidak resmi dan dapat berubah jika YouTube mengubah mekanisme streaming. Untuk penggunaan produksi jangka panjang, gunakan sumber audio/stream yang memang kamu punya hak untuk didistribusikan.
