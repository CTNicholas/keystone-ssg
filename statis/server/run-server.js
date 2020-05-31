const config = require('../config.js')
const path = require('path')
const chokidar = require('chokidar')
const Server = require('./server.js')

const devServer = new Server()

// const watchedDirs = config.watched.map(dir => path.resolve(process.cwd(), dir))
const watchSettings = {
  ignored: /(^|[/\\])\../, // ignore dotfiles
  ignoreInitial: true,
  cwd: process.cwd()
}

const reload = debounce(function () {
  devServer.reload()
}, 100)

chokidar.watch(config.watched, watchSettings).on('all', (event, path) => {
  console.log(event, path, 'changed')
  reload()
})

function debounce (func, wait, immediate) {
  var timeout
  return function () {
    const context = this
    const args = arguments
    var later = function () {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}
