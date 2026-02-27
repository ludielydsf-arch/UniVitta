@echo off
set "GIT_PATH=C:\Program Files\Git\bin"
set "PATH=%GIT_PATH%;%PATH%"
git remote -v
git status
git log -n 1
