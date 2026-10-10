Buatkan struktur dan kode untuk aplikasi web "Kalkulator & Kalender Hari Baik Transaksi Ternak" untuk bisnis "Kandang Sena Mulya" yang mengombinasikan Kalender Weton Jawa (Panca Sudha Ternak) sebagai Nilai Utama (Primary) dan Kalender Feng Shui Tionghoa sebagai Penimbang Tambahan (Secondary Booster).

### HIRARKI & ARSITEKTUR PENILAIAN (SCORING ALGORITHM)

Aplikasi web ini menggunakan metode Weighted Scoring:

- WETON JAWA (PANCA SUDHA TERNAK): UTAMA / PRIMARY (Bobot 70%)
- FENG SHUI TIONGHOA (LUNAR): PENIMBANG / SECONDARY (Bobot 30%)

---

### LOGIKA PERHITUNGAN & KRITERIA

1. LOGIKA WETON JAWA (Nilai Utama - Bobot 70%):
   - Neptu Hari: Minggu (5), Senin (4), Selasa (3), Rabu (7), Kamis (8), Jumat (6), Sabtu (9)
   - Neptu Pasaran: Legi (5), Pahing (9), Pon (7), Wage (4), Kliwon (8)
   - Total Neptu = Neptu Hari + Neptu Pasaran
   - Sisa = Total Neptu % 5 (Jika sisa == 0, maka Sisa = 5)
   - Interpretasi Panca Sudha Ternak:
     - Sisa 1 (Suku): "Kurang Baik" -> Ternak aktif/suka berjalan, cenderung kurus.
     - Sisa 2 (Watu): "Kurang Baik" -> Ternak statis, sulit berkembang, rezeki seret.
     - Sisa 3 (Gajah): "Sangat Baik" -> Ternak berpotensi tumbuh besar, tegap, gemuk, sehat, rezeki stabil.
     - Sisa 4 (Buto): "Tidak Baik" -> Makan banyak/rakus, rawan terserang penyakit, berisiko rugi.
     - Sisa 5 / 0 (Ratu): "Sangat Baik (Istimewa)" -> Cepat gemuk, mudah berkembang biak, membawa keberuntungan besar.

2. PENYESUAIAN BERDASARKAN JENIS TRANSAKSI (TARGET HAJAT):
   - Beli Bakalan (Fattening): Prioritas Sisa 3 (Gajah) & Sisa 5 (Ratu).
   - Beli Indukan (Breeding): Prioritas Utama Sisa 5 (Ratu) [Fokus kesuburan & reproduksi].
   - Beli Pejantan (Pemacek): Prioritas Utama Sisa 3 (Gajah) [Fokus postur tegap, rangka besar, stamina].
   - Menjual Ternak / Panen: Prioritas Sisa 5 (Ratu) [Kelancaran bayar & margin] & Sisa 3 (Gajah) [Kepuasan bobot].
   - TTD Kontrak B2B / Kemitraan: Mengacu pada Hari Baik Perjanjian (Feng Shui Contract Signing & Weton Ratu/Sri).

3. LOGIKA FENG SHUI TIONGHOA (Penimbang - Bobot 30%):
   - Gunakan library open-source `lunar-javascript` untuk konversi tanggal Masehi ke penanggalan Lunar Tionghoa (Ganzhi / Batang-Dahan, Shio, dan Dewa Harian).
   - Kategori: Lucky Day (Hoki), Ordinary Day (Netral), Unlucky Day (Ciong).

4. MATRIX HASIL AKHIR (MULTICULTURAL HARMONY SCORE):
   - Super Golden Day (Rekomendasi Utama): Weton Jawa "Sangat Baik" (Gajah/Ratu) + Feng Shui "Lucky Day".
   - Golden Day (Sangat Baik): Weton Jawa "Sangat Baik" (Gajah/Ratu) + Feng Shui "Ordinary Day".
   - Good Day (Cukup Baik): Weton Jawa "Sangat Baik" + Feng Shui "Unlucky Day" (Tetap disarankan karena Weton Jawa bernilai utama), ATAU Weton Jawa "Kurang Baik" + Feng Shui "Lucky Day".
   - Avoid Day (Dihindari): Weton Jawa "Tidak Baik / Buto" (Meskipun Feng Shui Lucky Day, tetap dianjurkan hindari karena Jawa adalah acuan utama).

---

### FITUR UI & INTERFASE APLIKASI WEB

1. Form Cek Hari & Transaksi Spesifik:
   - Date Picker untuk memilih tanggal transaksi.
   - Dropdown Opsi Jenis Transaksi: [ Beli Bakalan, Beli Indukan, Beli Pejantan, Menjual Ternak, TTD Kontrak B2B ].
   - Tampilan Dual-Card: Card Utama "Analisis Weton Jawa (Panca Sudha Ternak)" [Dominan], dan Card Secondary "Pertimbangan Feng Shui Tionghoa".
   - Badge Status Akhir (misal: "Super Golden Day", "Golden Day", "Avoid Day").

2. Kalender Bulanan Interaktif:
   - Tampilan Kalender Bulanan dengan Filter Status: [ Semua ] [ Super Golden Day Only ] [ Weton Jawa Baik ] [ Feng Shui Lucky ].
   - Highlight tanggal "Super Golden Day" menggunakan warna emas/badge khusus.

3. Profil Usaha & Branding (Header & Footer):
   - Nama Usaha: Kandang Sena Mulya
   - Tagline: "Data-Driven & Traditional Wisdom Farming"
   - Deskripsi Singkat: Penyedia domba/kambing bakalan, penggemukan (fattening), hingga pasokan rutin B2B untuk aqiqah, resto, dan pedagang besar dengan standar kontrol kualitas pakan Complete Feed & silase presisi.
   - Alamat Lengkap: Jalan Kali Krasak No.35, Kel. Pakunden, Kec. Sukorejo, Blitar, Jawa Timur 66122, Indonesia
   - Whatsapp/Telepon: 0851-9033-0629
   - Jam Operasional: Senin - Minggu (08:00 - 20:00 WIB)
   - Cakupan Layanan: Blitar & Jawa Timur

---

### STACK TEKNOLOGI

- HTML5, Tailwind CSS, JavaScript ES6 (Modular Component / React / Vue).
- Load library `lunar-javascript` via CDN atau npm package manager.
