const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

const htmlPath = path.join(__dirname, 'www', 'index.html');

if (!fs.existsSync(htmlPath)) {
    console.error("❌ Error: index.html tidak ditemukan!");
    process.exit(1);
}

console.log("🚀 Memproses Minifikasi HTML (Tanpa Obfuscator agar instalasi cepat)...");
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Minify sederhana untuk membersihkan file tanpa merusak alur logika
const minifiedHtml = minify(htmlContent, {
    removeAttributeQuotes: false,
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true // Hanya mengecilkan ukuran JS, bukan mengacaknya
});

fs.writeFileSync(htmlPath, minifiedHtml);
console.log("✅ SELESAI: index.html sekarang sudah optimal dan ringan.");
