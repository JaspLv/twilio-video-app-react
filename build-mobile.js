const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Путь к Cordova www
const cordovaWWW = path.resolve(__dirname, 'cordova/www');

// Очистим www
fs.removeSync(cordovaWWW);
fs.mkdirSync(cordovaWWW, { recursive: true });

// Определяем команду сборки React
let buildCmd = 'npx react-scripts build'; // для CRA
// buildCmd = 'npx vite build'; // для Vite, если у тебя Vite

console.log('🔹 Building React app...');
try {
  execSync(buildCmd, { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Ошибка сборки React:', err.message);
  process.exit(1);
}

// Определяем папку с результатом
let reactBuildDir = path.resolve(__dirname, 'build'); // CRA
// let reactBuildDir = path.resolve(__dirname, 'dist'); // Vite

// Проверяем, что папка существует
if (!fs.existsSync(reactBuildDir)) {
  console.error(`❌ Папка сборки React не найдена: ${reactBuildDir}`);
  process.exit(1);
}

// Копируем в Cordova www
console.log('🔹 Copying build to Cordova www...');
fs.copySync(reactBuildDir, cordovaWWW);

console.log('✔ React build успешно скопирован в Cordova www/');