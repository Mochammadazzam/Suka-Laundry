const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const minify = require('html-minifier').minify;

const htmlPath = path.join(__dirname, 'www', 'index.html');

if (!fs.existsSync(htmlPath)) {
    console.error("❌ Error: index.html tidak ditemukan di folder www!");
    process.exit(1);
}

console.log("🔒 Memulai Enkripsi Kode & Proteksi Anti-Maling...");
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script>([\s\S]*?)<\/script>/;
const match = htmlContent.match(scriptRegex);

if (match && match[1]) {
    const originalJs = match[1];

    // Proteksi tingkat menengah yang aman untuk verifikasi sistem Android
    const obfuscatedJs = JavaScriptObfuscator.obfuscate(originalJs, {
        compact: true,
        controlFlowFlattening: false, // Dimatikan agar instalasi cepat
        debugProtection: true,        // Mencegah debugging
        disableConsoleOutput: true,   // Menyembunyikan log sensitif
        selfDefending: true,          // Mencegah perusakan kode
        stringArray: true,            // Mengenkripsi teks/API Key
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayThreshold: 0.8,
        splitStrings: true,           // Memecah string agar sulit dilacak
        identifierNamesGenerator: 'hexadecimal' // Nama variabel jadi kode hexa
    }).getObfuscatedCode();

    htmlContent = htmlContent.replace(scriptRegex, `<script>${obfuscatedJs}</script>`);
}

const minifiedHtml = minify(htmlContent, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: false // Jangan minify lagi karena sudah di-obfuscate
});

fs.writeFileSync(htmlPath, minifiedHtml);
console.log("✅ Berhasil! Kode sekarang sulit dibaca tapi tetap ringan.");
