NODE_ENV=production pm2 start --name "word-of-the-day" dist/index.js --max-memory-restart 128M
