module.exports = {
  dynamicLinks: true,
  indexPath: '/',
  port: 8080,
  portWs: 8081,
  devServerIp: 'localhost',
  watched: [
    'templates',
    'pages',
    'assets',
    'components',
    'src',
    'styles'
  ],
  build: 'pages',
  served: 'public'
}
