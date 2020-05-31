const port = 8080

module.exports = {
  served: 'public',
  watch: true,
  watched: [
    'templates',
    'pages',
    'assets',
    'src'
  ],
  port: port,
  portWs: port + 1,
  cwd: process.cwd(),
  disconnectReloadTime: 2000,
  plugins: [
    {
      filetype: ['scss'],
      
    }
  ]
}
