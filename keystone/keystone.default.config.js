const port = 8080

module.exports = {
  indexPath: '/',
  dynamicLinks: true,
  searchFile: true,
  build: 'pages',
  served: 'public',
  watch: true,
  watched: [
    'templates',
    'pages',
    'assets',
    'components',
    'src',
    'styles'
  ],
  port: port,
  portWs: port + 1,
  devServerIp: 'localhost',
  fullErrors: false,
  suppressErrors: true,
  fullRecompile: false,
  cwd: process.cwd(),
  disconnectReloadTime: 2000,
  reloadDebounce: 150,
  prePlugins: []
}
