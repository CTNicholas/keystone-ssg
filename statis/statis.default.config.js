const port = 8080
var sass = require('node-sass')
var babel = require('@babel/core')

const sassPlugin = {
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

const babelPlugin = {
  input: '.js',
  output: '.js',
  run ({ inputContent }) {
    return babel.transformSync(inputContent, {
      minified: true,
      presets: ['@babel/preset-env']
    }).code
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
    'components',
    'src'
  ],
  port: port,
  portWs: port + 1,
  cwd: process.cwd(),
  disconnectReloadTime: 2000,
  reloadDebounce: 150,
  prePlugins: [
    // sassPlugin,
    // babelPlugin
  ]
}
