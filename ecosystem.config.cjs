module.exports = {
  apps: [
    {
      name: 'ngmp-network-app',
      namespace: 'ngmp-network-app',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        PORT: 8000,
      },
    },
  ],
}