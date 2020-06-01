const config = require('./config.js')
const chokidar = require('chokidar')
const Server = require('./server/server.js')
const serverLog = require('./server-log.js')
const runBuild = require('./run-build.js')

const devServer = new Server()

const watchSettings = {
  ignored: /(^|[/\\])\../, // ignore dotfiles
  ignoreInitial: true,
  cwd: config.cwd
}

let fileChanges = {}
let building = false

const reloadDevServer = debounce(function () {
  console.log('NEW RELOAD')
  if (fileChanges) {
    serverLog.fileChange(fileChanges)
  }
  fileChanges = {}
  building = true
  console.log('BUILD START')
  runBuild()
  console.log('BUILD DONE')
  devServer.reload().then(() => {
    console.log('RELOAD DONE')
    building = false
  })
}, config.reloadDebounce)

chokidar.watch(config.watched, watchSettings).on('all', (event, path) => {
  if (!building) {
    fileChanges[Object.keys(fileChanges).length + 1 + '.'] = { File: path, Event: event }
    reloadDevServer()
  }
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
