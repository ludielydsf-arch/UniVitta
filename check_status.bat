@echo off
set PATH=%PATH%;C:\Program Files\Git\cmd
echo --- STATUS ---
git status
echo.
echo --- LAST LOG ---
git log -1 --stat
