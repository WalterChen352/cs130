@echo off
echo Starting deployment process...

REM Submit the build to Google Cloud Build
gcloud builds submit --tag gcr.io/gonow-449908/gonow:latest & gcloud run deploy gonow --image gcr.io/gonow-449908/gonow --platform managed

echo Deployment completed!
pause