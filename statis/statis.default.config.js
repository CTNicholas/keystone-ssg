const port = 8080

module.exports = {
  served: 'public',
  watch: true,
  watched: [
    'templates',
    'pages',
    'assets'
  ],
  port: port,
  portWs: port + 1,
  disconnectReloadTime: 2000
}
