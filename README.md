# Portofolio Kalfin Alloto'dang

Website statis berbahasa Indonesia dengan tema glassmorphism modern:
panel transparan dengan blur, aksen biru–ungu, latar bergerak lembut,
refleksi mengikuti pointer, dan animasi saat bagian halaman muncul.
Susunan template portofolio dipertahankan: hero dua kolom pada desktop,
foto di atas pada ponsel, statistik, profil, keahlian, perusahaan,
pendidikan/pengalaman, kontak, dan navigasi bawah pada perangkat seluler.
Animasi mencakup kemunculan hero bertahap, cahaya dan gerak foto yang halus,
kartu dan statistik yang muncul berurutan, penghitung angka statistik,
sorotan timeline, serta kilau tombol ketika hover atau fokus keyboard.
Pengaturan prefers-reduced-motion menonaktifkan animasi dan efek tilt.
Animasi CSS berhenti ketika tab browser disembunyikan.

Lapisan waterglass menambahkan pantulan melengkung, cahaya caustic yang
bergerak di belakang foto, serta riak saat panel disentuh atau kontrol
diaktifkan melalui keyboard. Ikon, badge, dan identitas perusahaan memiliki
cahaya serta ritme animasinya sendiri. Lampu panel di luar layar berhenti
sementara; teks dan wajah tidak terkena distorsi.

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan dari direktori ini:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Kemudian buka http://127.0.0.1:8080. Tidak memerlukan npm atau proses build.
CSS, JavaScript, ikon, logo LJI, dan foto disimpan secara lokal. Google Fonts
bersifat opsional; browser menggunakan font cadangan jika tidak ada internet.

## Konten

- `index.html`: profil, kompetensi, perusahaan, produk, perjalanan, dan kontak.
- `s.css`: seluruh styling dan breakpoint responsif.
- `script.js`: status navigasi dan indikator kemajuan scroll.
- `waterglass.css` dan `waterglass.js`: pencahayaan, pantulan cair, serta riak interaktif.
- `assets/profil-kalfin.txt`: ringkasan profil yang dapat diunduh.
- `information.txt`: sumber konten, data yang belum tersedia, dan catatan edit foto.

Situs menggunakan informasi yang diberikan pemilik. Kontak menuju situs
perusahaan yang diberikan; email, nomor telepon, sertifikasi, dan pencapaian
lain yang belum diberikan tidak ditambahkan.

Foto asli dan edit sebelumnya dipertahankan. Versi terbaru dibuat dengan
Imagegen bawaan: latar transparan dan pencahayaan tepi biru–ungu agar foto
menyatu dengan panel kaca. Website menggunakan `assets/kalfin-portrait-glass.webp`
dengan alpha transparan; master PNG dan prompt lengkap disimpan di folder assets.
Versi WebP digunakan untuk mengurangi ukuran unduhan.
Logo LJI berasal dari situs resmi PT. Liny Jaya Informatika;
singkatan SPI ditampilkan sebagai teks, bukan sebagai logo resmi perusahaan.
