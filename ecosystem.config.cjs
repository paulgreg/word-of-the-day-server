module.exports = {
  apps: [
    {
      name: 'word-of-the-day',
      script: 'dist/index.js',
      max_memory_restart: '128M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

