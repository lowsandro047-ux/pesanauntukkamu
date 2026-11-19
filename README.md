# Halaman Pesan untuk Gebetan

Halaman web satu halaman bergaya UI kit: biru solid, kartu putih membulat, dan boneka pink yang animasinya meledak-ledak. Tombol **Tidak** bisa diklik, tetapi setiap kali diklik langsung bergeser ke tempat lain, jadi tidak pernah benar-benar terpilih.

## Alur

1. **Halaman 1**: layar biru penuh dengan boneka pink besar yang terus melompat, pesan pembuka, dan tombol **Lanjut**. Saat ditekan, boneka berputar, muncul gelombang ledakan, layar bergetar, dan hati-hati beterbangan.
2. **Halaman 2**: pesan pertanyaan (isi `askTitle` di `CONFIG`). Tombol **Tidak** bisa diklik, lalu langsung bergeser sedikit (tetap di dalam layar) dan boneka ikut ketawa. Hanya **Iya** yang bisa dipilih.
3. **Halaman 3**: "Makasih ya!" dengan boneka salto, tangan naik, gelombang ledakan berulang, dan confetti love. Tombol "Ledakan lagi" mengulanginya.

## Mengubah isi pesan

Buka `script.js`, ubah bagian `CONFIG` di paling atas:

```js
const CONFIG = {
  targetName: "Kamu",   // nama gebetanmu
  myName: "Aku",        // namamu
  ...
};
```

Sapaan, judul, isi pesan, teks saat tombol "Tidak" bergeser, dan pesan terima kasih bisa diubah di situ.

Seberapa jauh tombol **Tidak** bergeser setiap kali diklik diatur lewat konstanta `SHIFT` di `script.js`, tepat di bawah judul "Tombol Tidak".

Kecepatan animasi boneka diatur di `style.css` pada bagian "Boneka: animasi" (mis. `jump 1.5s` untuk lompatan biasa, `celebrate 1.2s` untuk pesta).

## Menjalankan di komputer

Buka `index.html` di browser. Font Poppins dimuat dari Google Fonts; tanpa internet, tampilan memakai font bawaan sistem.

## Upload ke GitHub + online dengan GitHub Pages

1. Buat repository baru di GitHub.
2. Upload `index.html`, `style.css`, `script.js`, dan `README.md`.
3. Buka **Settings → Pages**.
4. Pada **Source**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
5. Tunggu 1-2 menit. Link-nya: `https://USERNAME.github.io/NAMA-REPO/`

## Struktur file

```
├── index.html   # struktur halaman + boneka (SVG)
├── style.css    # gaya UI kit + animasi boneka
├── script.js    # CONFIG pesan, alur halaman, tombol bergeser, ledakan, confetti
└── README.md
```
