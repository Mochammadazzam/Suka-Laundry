const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const minify = require('html-minifier').minify;

// Lokasi index.html kamu
const htmlPath = path.join(__dirname, 'www', 'index.html');

if (!fs.existsSync(htmlPath)) {
    console.error("❌ Error: index.html tidak ditemukan di folder www!");
    process.exit(1);
}

console.log("🚀 Memulai proteksi kode (Anti-Decompile)...");
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. Ekstrak bagian <script>
const scriptRegex = /<script>([\s\S]*?)<\/script>/;
const match = htmlContent.match(scriptRegex);

if (match && match[1]) {
    console.log("🔒 Mengacak JavaScript...");
    const originalJs = match[1];

    const obfuscatedJs = JavaScriptObfuscator.obfuscate(originalJs, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true, // Membuat hang jika di-debug/inspect
        debugProtectionInterval: 2000,
        disableConsoleOutput: true,
        selfDefending: true, // Kode rusak jika dirapikan (prettify)
        stringArray: true,
        stringArrayRotate: true,
        stringArrayThreshold: 0.8,
        unicodeEscapeSequence: true
    }).getObfuscatedCode();

    htmlContent = htmlContent.replace(scriptRegex, `<script>${obfuscatedJs}</script>`);
}

// 2. Minify HTML & CSS
console.log("📦 Mengecilkan ukuran HTML & CSS...");
const minifiedHtml = minify(htmlContent, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true
});

fs.writeFileSync(htmlPath, minifiedHtml);
console.log("✅ SELESAI: index.html sekarang sudah terenkripsi.");
