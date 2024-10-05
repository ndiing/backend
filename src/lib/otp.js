const crypto = require("crypto");

// https://www.ietf.org/rfc/rfc4226.txt

/**
 * Menghitung nilai HOTP (HMAC-based One-Time Password).
 * @param {Object} options - Opsi untuk menghasilkan HOTP.
 * @param {string} options.secret - Kunci rahasia untuk menghasilkan HOTP.
 * @param {number} options.count - Nilai hitungan untuk HOTP (biasanya waktu atau hitungan penggunaan).
 * @param {string} [options.algorithm='sha1'] - Algoritma HMAC yang digunakan (default: 'sha1').
 * @param {number} [options.digits=6] - Jumlah digit untuk hasil HOTP (default: 6).
 * @returns {string} - Nilai HOTP yang dihasilkan.
 */
function hotp(options = {}) {
    const { secret, count, algorithm = "sha1", digits = 6 } = options;
    const key = Buffer.from(secret);

    const data = Buffer.alloc(8);
    data.writeUInt32BE(count, 4);

    const hash = crypto.createHmac(algorithm, key).update(data).digest("hex");

    // console.log(hash===options.hex)

    const offset = parseInt(hash.charAt(hash.length - 1), 16);

    const result = parseInt(hash.substring(offset * 2, (offset * 2) + (2 * 4)), 16) & 0x7fffffff;

    return String(result)
        .padStart(digits, "0")
        .slice(0 - digits);
}

// // test hotp
// {
//     const request = [
//         { secret: "12345678901234567890", count: 0, hex: "cc93cf18508d94934c64b65d8ba7667fb7cde4b0" },
//         { secret: "12345678901234567890", count: 1, hex: "75a48a19d4cbe100644e8ac1397eea747a2d33ab" },
//         { secret: "12345678901234567890", count: 2, hex: "0bacb7fa082fef30782211938bc1c5e70416ff44" },
//         { secret: "12345678901234567890", count: 3, hex: "66c28227d03a2d5529262ff016a1e6ef76557ece" },
//         { secret: "12345678901234567890", count: 4, hex: "a904c900a64b35909874b33e61c5938a8e15ed1c" },
//         { secret: "12345678901234567890", count: 5, hex: "a37e783d7b7233c083d4f62926c7a25f238d0316" },
//         { secret: "12345678901234567890", count: 6, hex: "bc9cd28561042c83f219324d3c607256c03272ae" },
//         { secret: "12345678901234567890", count: 7, hex: "a4fb960c0bc06e1eabb804e5b397cdc4b45596fa" },
//         { secret: "12345678901234567890", count: 8, hex: "1b3c89f65e6c9e883012052823443f048b4332db" },
//         { secret: "12345678901234567890", count: 9, hex: "1637409809a679dc698207310c8c7fc07290d9e5" },
//     ];
//     const result = [
//         { count: 0, hex: "4c93cf18", decimal: 1284755224, hotp: "755224" },
//         { count: 1, hex: "41397eea", decimal: 1094287082, hotp: "287082" },
//         { count: 2, hex: "82fef30", decimal: 137359152, hotp: "359152" },
//         { count: 3, hex: "66ef7655", decimal: 1726969429, hotp: "969429" },
//         { count: 4, hex: "61c5938a", decimal: 1640338314, hotp: "338314" },
//         { count: 5, hex: "33c083d4", decimal: 868254676, hotp: "254676" },
//         { count: 6, hex: "7256c032", decimal: 1918287922, hotp: "287922" },
//         { count: 7, hex: "4e5b397", decimal: 82162583, hotp: "162583" },
//         { count: 8, hex: "2823443f", decimal: 673399871, hotp: "399871" },
//         { count: 9, hex: "2679dc69", decimal: 645520489, hotp: "520489" },
//     ];
//     request.forEach((options, index) => {
//         console.log(hotp(options)=== result[index].hotp);
//     });
// }

// https://datatracker.ietf.org/doc/html/rfc6238

/**
 * Menghitung nilai TOTP (Time-based One-Time Password).
 * @param {Object} options - Opsi untuk menghasilkan TOTP.
 * @param {string} options.secret - Kunci rahasia untuk menghasilkan TOTP.
 * @param {number} [options.T=Date.now()/1000] - Waktu saat ini dalam detik (default: waktu sekarang).
 * @param {number} [options.T0=0] - Waktu awal dalam detik (default: 0).
 * @param {number} [options.X=30] - Interval waktu dalam detik (default: 30).
 * @param {string} [options.algorithm='sha1'] - Algoritma HMAC yang digunakan (default: 'sha1').
 * @param {number} [options.digits=6] - Jumlah digit untuk hasil TOTP (default: 6).
 * @returns {string} - Nilai TOTP yang dihasilkan.
 */
function totp(options = {}) {
    const { secret, T = Math.floor(Date.now() / 1000), T0 = 0, X = 30, algorithm = "sha1", digits = 6 } = options;
    const count = Math.floor((T - T0) / X);

    return hotp({ secret, count, algorithm, digits });
}

// // test totp
// {
//     const request = [
//         {
//             "secret": "12345678901234567890",
//             "T": 59,
//             "utc": "1970-01-01 00:00:59",
//             "hex": "0000000000000001",
//             "totp": "287082",
//             "algorithm": "SHA1"
//         },
//         {
//             "secret": "12345678901234567890123456789012",
//             "T": 59,
//             "utc": "1970-01-01 00:00:59",
//             "hex": "0000000000000001",
//             "totp": "119246",
//             "algorithm": "SHA256"
//         },
//         {
//             "secret": "1234567890123456789012345678901234567890123456789012345678901234",
//             "T": 59,
//             "utc": "1970-01-01 00:00:59",
//             "hex": "0000000000000001",
//             "totp": "693936",
//             "algorithm": "SHA512"
//         },
//         {
//             "secret": "12345678901234567890",
//             "T": 1111111109,
//             "utc": "2005-03-18 01:58:29",
//             "hex": "00000000023523EC",
//             "totp": "081804",
//             "algorithm": "SHA1"
//         },
//         {
//             "secret": "12345678901234567890123456789012",
//             "T": 1111111109,
//             "utc": "2005-03-18 01:58:29",
//             "hex": "00000000023523EC",
//             "totp": "084774",
//             "algorithm": "SHA256"
//         },
//         {
//             "secret": "1234567890123456789012345678901234567890123456789012345678901234",
//             "T": 1111111109,
//             "utc": "2005-03-18 01:58:29",
//             "hex": "00000000023523EC",
//             "totp": "091201",
//             "algorithm": "SHA512"
//         },
//         {
//             "secret": "12345678901234567890",
//             "T": 1111111111,
//             "utc": "2005-03-18 01:58:31",
//             "hex": "00000000023523ED",
//             "totp": "050471",
//             "algorithm": "SHA1"
//         },
//         {
//             "secret": "12345678901234567890123456789012",
//             "T": 1111111111,
//             "utc": "2005-03-18 01:58:31",
//             "hex": "00000000023523ED",
//             "totp": "062674",
//             "algorithm": "SHA256"
//         },
//         {
//             "secret": "1234567890123456789012345678901234567890123456789012345678901234",
//             "T": 1111111111,
//             "utc": "2005-03-18 01:58:31",
//             "hex": "00000000023523ED",
//             "totp": "943326",
//             "algorithm": "SHA512"
//         },
//         {
//             "secret": "12345678901234567890",
//             "T": 1234567890,
//             "utc": "2009-02-13 23:31:30",
//             "hex": "000000000273EF07",
//             "totp": "005924",
//             "algorithm": "SHA1"
//         },
//         {
//             "secret": "12345678901234567890123456789012",
//             "T": 1234567890,
//             "utc": "2009-02-13 23:31:30",
//             "hex": "000000000273EF07",
//             "totp": "819424",
//             "algorithm": "SHA256"
//         },
//         {
//             "secret": "1234567890123456789012345678901234567890123456789012345678901234",
//             "T": 1234567890,
//             "utc": "2009-02-13 23:31:30",
//             "hex": "000000000273EF07",
//             "totp": "441116",
//             "algorithm": "SHA512"
//         },
//         {
//             "secret": "12345678901234567890",
//             "T": 2000000000,
//             "utc": "2033-05-18 03:33:20",
//             "hex": "0000000003F940AA",
//             "totp": "279037",
//             "algorithm": "SHA1"
//         },
//         {
//             "secret": "12345678901234567890123456789012",
//             "T": 2000000000,
//             "utc": "2033-05-18 03:33:20",
//             "hex": "0000000003F940AA",
//             "totp": "698825",
//             "algorithm": "SHA256"
//         },
//         {
//             "secret": "1234567890123456789012345678901234567890123456789012345678901234",
//             "T": 2000000000,
//             "utc": "2033-05-18 03:33:20",
//             "hex": "0000000003F940AA",
//             "totp": "618901",
//             "algorithm": "SHA512"
//         },
//         {
//             "secret": "12345678901234567890",
//             "T": 20000000000,
//             "utc": "2603-10-11 11:33:20",
//             "hex": "0000000027BC86AA",
//             "totp": "353130",
//             "algorithm": "SHA1"
//         },
//         {
//             "secret": "12345678901234567890123456789012",
//             "T": 20000000000,
//             "utc": "2603-10-11 11:33:20",
//             "hex": "0000000027BC86AA",
//             "totp": "737706",
//             "algorithm": "SHA256"
//         },
//         {
//             "secret": "1234567890123456789012345678901234567890123456789012345678901234",
//             "T": 20000000000,
//             "utc": "2603-10-11 11:33:20",
//             "hex": "0000000027BC86AA",
//             "totp": "863826",
//             "algorithm": "SHA512"
//         }
//     ];

//     // SHA-1: 20 byte (160 bit / 8)
//     // SHA-256: 32 byte (256 bit / 8)
//     // SHA-512: 64 byte (512 bit / 8)

//     request.forEach(item => {
//         console.log(totp(item)===item.totp)
//     })
// }

module.exports = {
    hotp,
    totp,
};
