@echo off
:: This batch file runs a PowerShell command to get user info from Google API

:: Run the PowerShell command
powershell -Command "$token = gcloud auth print-identity-token; Invoke-WebRequest -Uri 'https://www.googleapis.com/oauth2/v1/userinfo' -Headers @{ Authorization = 'Bearer $token' } -UseBasicParsing"

:: Pause to see the output (optional)
pause