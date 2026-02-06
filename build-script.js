const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const minify = require('html-minifier').minify;

const htmlPath = path.join(__dirname, 'www', 'index.html');

if (!fs.existsSync(htmlPath)) {
    console.error("❌ Error: index.html tidak ditemukan!");
    process.exit(1);
}

console.log("🚀 Mengoptimalkan proteksi agar instalasi lebih cepat...");
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script>([\s\S]*?)<\/script>/;
const match = htmlContent.match(scriptRegex);

if (match && match[1]) {
    const originalJs = match[1];

    // Konfigurasi yang diseimbangkan: Tetap sulit dibaca, tapi ramah prosesor HP
    const obfuscatedJs = JavaScriptObfuscator.obfuscate(originalJs, {
        compact: true,
        controlFlowFlattening: false, // DIMATIKAN: Ini penyebab utama instalasi lama
        deadCodeInjection: false,     // DIMATIKAN: Agar ukuran & verifikasi lebih ringan
        debugProtection: true,        // TETAP AKTIF: Biar tidak bisa di-inspect
        disableConsoleOutput: true,   // TETAP AKTIF
        selfDefending: true,          // TETAP AKTIF
        stringArray: true,            // TETAP AKTIF: Menyembunyikan teks/string
        stringArrayRotate: true,
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false  // DIMATIKAN: Biar verifikasi string lebih cepat
    }).getObfuscatedCode();

    htmlContent = htmlContent.replace(scriptRegex, `<script>${obfuscatedJs}</script>`);
}

const minifiedHtml = minify(htmlContent, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true
});

fs.writeFileSync(htmlPath, minifiedHtml);
console.log("✅ Berhasil! Proteksi sudah diseimbangkan.");
