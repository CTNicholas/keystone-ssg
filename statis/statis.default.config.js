const port = 8080
var sass = require('node-sass')

const runSass = {
  input: ['.scss', '.sass'],
  output: '.css',
  run ({ inputContent, outputPath }) {
    return sass.renderSync({
      data: inputContent,
      outFile: outputPath,
      outputStyle: 'compressed'
    }).css
  }
}

module.exports = {
  build: 'pages',
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
  reloadDebounce: 150,
  plugins: [
    runSass
  ]
}
