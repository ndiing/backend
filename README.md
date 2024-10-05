# nd-core

**nd-core** adalah framework backend berbasis Node.js yang dirancang untuk memudahkan pengembangan aplikasi web. Framework ini menyediakan struktur yang jelas dan berbagai fitur untuk mempercepat proses pengembangan.

## Fitur

-   **Modularitas**: Memudahkan pengorganisasian kode dan pemisahan tanggung jawab.
-   **Middleware**: Mendukung penggunaan middleware untuk menangani permintaan dan respons.
-   **Routing**: Sistem routing yang fleksibel untuk menangani berbagai jalur aplikasi.
-   **Integrasi Database**: Mudah terhubung dengan berbagai database.

## Instalasi

Untuk menginstal **nd-core**, ikuti langkah-langkah berikut:

1. Kloning repositori ini:
 <pre>
 git clone https://github.com/ndiing/nd-core.git
 </pre>
2. Masuk ke direktori proyek:
 <pre>
 cd nd-core
 </pre>
3. Instal dependensi:
 <pre>
 npm install
 </pre>

## Penggunaan

Berikut adalah contoh cara menggunakan **nd-core** dalam proyek Anda:

<pre>
const Router = require("./lib/router.js");
const app = new Router();

app.get('/', (req, res) => {
    res.json({ message: 'ok' });
});

app.listen(3000);
</pre>

## Kontribusi

Jika Anda ingin berkontribusi pada **nd-core**, silakan ikuti langkah-langkah berikut:

1. Fork repositori ini.
2. Buat cabang baru (`git checkout -b feature-nama-fitur`).
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`).
4. Push ke cabang (`git push origin feature-nama-fitur`).
5. Buat pull request.

## Lisensi

Proyek ini didistribusikan di bawah lisensi MIT. Lihat [LICENSE](LICENSE) untuk detail lebih lanjut.

## Kontak

Nama: Ridho Prasetya  
Email: ndiing.inc@gmail.com  
GitHub: [ndiing](https://github.com/ndiing)
