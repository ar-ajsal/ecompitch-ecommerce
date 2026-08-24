module.exports = {
  apps: [
    {
      name: 'bharatbazaar-backend',
      script: './server.js',
      cwd: './backend',
      instances: 'max', 
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
