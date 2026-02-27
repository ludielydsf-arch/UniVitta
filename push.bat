@echo off
set "GIT_PATH=C:\Program Files\Git\bin"
set "PATH=%GIT_PATH%;%PATH%"
git init
git config user.email "ludielydsf-arch@users.noreply.github.com"
git config user.name "ludielydsf-arch"
git remote remove origin 2>nul
git remote add origin https://github.com/ludielydsf-arch/UniVitta.git
git add .
git commit -m "Sistema Univitta: SPA avancado com Supabase e Plano Univitta"
git branch -M main
git push -u origin main --force
