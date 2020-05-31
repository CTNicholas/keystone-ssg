const port = 8080
var sass = require('node-sass')

const runSass = {
  input: ['.scss', '.sass'],
  output: '.css',
  run ({ inputPath, outputPath }) {
    return sass.renderSync({
      file: inputPath,
      outFile: outputPath,
      outputStyle: 'compressed'
    })
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
  plugin: [
    runSass
  ]
}
