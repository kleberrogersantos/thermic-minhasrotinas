@echo off
setlocal enabledelayedexpansion

echo ================================================
echo Substituindo arquivos pela versão mais recente
echo ================================================

for /r %%F in (*-Latitude-Kleber.*) do (
    set "kleberFile=%%~fF"
    set "dir=%%~dpF"
    set "name=%%~nF"
    set "ext=%%~xF"

    REM Remove o sufixo -Latitude-Kleber do nome
    set "baseName=!name:-Latitude-Kleber=!"
    set "targetFile=!dir!!baseName!!ext!"
    set "renamedFile=!dir!!baseName!-renomeado!ext!"

    if exist "!targetFile!" (
        for %%A in ("!kleberFile!") do set "dateKleber=%%~tA"
        for %%B in ("!targetFile!") do set "dateOriginal=%%~tB"

        echo.
        echo Verificando: !targetFile!
        echo   -> Original: !dateOriginal!
        echo   -> Kleber  : !dateKleber!

        REM Comparando datas (yyyyMMddHHmmss)
        for /f "tokens=1-3 delims=/:. " %%a in ("!dateKleber!") do (
            set "kleberDate=%%c%%b%%a"
        )
        for /f "tokens=1-3 delims=/:. " %%a in ("!dateOriginal!") do (
            set "originalDate=%%c%%b%%a"
        )

        if !kleberDate! GTR !originalDate! (
            echo   >> Kleber é mais recente. Substituindo...
            ren "!targetFile!" "!baseName!-renomeado!ext!"
            ren "!kleberFile!" "!baseName!!ext!"
        ) else (
            echo   >> Original é mais recente. Mantendo como está.
        )
    )
)

echo.
echo Concluído!
pause
