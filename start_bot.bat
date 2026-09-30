@echo off
chcp 65001 > nul
title VK Bot - Теплицы ТУТ (club241898656)
echo ===================================================
echo     Запуск ВК Бота для группы club241898656
echo ===================================================
echo.
echo Проверка Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Node.js не установлен!
    echo Установите Node.js с официального сайта: https://nodejs.org
    pause
    exit /b
)

echo Запуск скрипта бота...
node scripts/vk_bot.js
pause
