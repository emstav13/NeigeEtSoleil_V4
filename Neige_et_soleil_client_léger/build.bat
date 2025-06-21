@echo off
javac -d backend/bin -cp "backend/lib/*" backend/src/modele/*.java backend/src/controleur/*.java
echo Compilation terminée !
pause
