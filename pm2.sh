NODE_ENV=production pm2 start dist/index.js --name "word-of-the-day" --max-memory-restart 128M
