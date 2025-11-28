@echo off
REM Quick Start Script for Taxi Management System
echo.
echo ========================================
echo   Taxi Management System - Boshlash
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Python o'rnatilmagan!
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo ✓ Python topildi

REM Check dependencies
echo.
echo Dependency-larni tekshirilmoqda...
pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ✗ Dependencies o'rnatilmagan!
    echo.
    echo Quyidagini o'rnatish uchun ishga tushirish:
    echo    pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

echo ✓ Barcha dependencies o'rnatilgan

REM Check .env file
if not exist ".env" (
    echo.
    echo ⚠ .env fayli topilmadi!
    echo .env.example ni .env ga nusxa olamiz...
    copy .env.example .env >nul
    echo ✓ .env fayli yaratildi - sozlamalarnii o'zgartirishni tavsiya etamiz
)

REM Initialize system
echo.
echo Tizim o'rnatilmoqda...
python init_system.py

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Tizim o'rnatishda xato!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Tizim tayyor! Quyidagi 3 terminalda:
echo ========================================
echo.
echo Terminal 1 (WEB SERVER):
echo   python app.py
echo.
echo Terminal 2 (ADMIN PANEL):
echo   python admin_panel.py
echo.
echo Terminal 3 (DISPATCHER PANEL):
echo   python dispatcher_panel.py
echo.
echo Health Check:
echo   curl http://localhost:5000/health
echo.
pause
