@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encuentra Node.js. Instala Node.js 22 o superior y vuelve a abrir este archivo.
  pause
  exit /b 1
)
echo Iniciando Pocito. El navegador se abrira automaticamente.
echo Deja esta ventana abierta mientras uses el showroom.
node scripts/server.mjs --open
pause
