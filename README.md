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

<!-- 
benchmark compare
nd-core faster then express
 -->

<!-- 
from express
ab -n 1000 -c 100 http://localhost:3000/
This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /
Document Length:        16 bytes

Concurrency Level:      100
Time taken for tests:   0.358 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      223000 bytes
HTML transferred:       16000 bytes
Requests per second:    2795.17 [#/sec] (mean)
Time per request:       35.776 [ms] (mean)
Time per request:       0.358 [ms] (mean, across all concurrent requests)
Transfer rate:          608.71 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0       2
Processing:    17   33   4.7     34      45
Waiting:        0   27   4.9     27      41
Total:         17   34   4.7     34      45

Percentage of the requests served within a certain time (ms)
  50%     34
  66%     35
  75%     36
  80%     38
  90%     39
  95%     40
  98%     43
  99%     44
 100%     45 (longest request)
 -->

<!-- 
from nd-core

ab -n 1000 -c 100 http://localhost/
This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:
Server Hostname:        localhost
Server Port:            80

Document Path:          /
Document Length:        16 bytes

Concurrency Level:      100
Time taken for tests:   2.285 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      123000 bytes
HTML transferred:       16000 bytes
Requests per second:    437.68 [#/sec] (mean)
Time per request:       228.478 [ms] (mean)
Time per request:       2.285 [ms] (mean, across all concurrent requests)
Transfer rate:          52.57 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0       2
Processing:    14   23   3.8     22      32
Waiting:        1   19   4.0     19      30
Total:         14   23   3.8     22      32

Percentage of the requests served within a certain time (ms)
  50%     22
  66%     25
  75%     25
  80%     26
  90%     28
  95%     30
  98%     30
  99%     31
 100%     32 (longest request)

 -->

