const config = require('./config.js')
const state = require('./state.js')
const chokidar = require('chokidar')
const Server = require('./server/server.js')
const serverLog = require('./log-server.js')
const runBuild = require('./run-build.js')
const logError = require('./log-error.js')

state.devServer = new Server()

const watchSettings = {
  ignored: /(^|[/\\])\../, // ignore dotfiles
  ignoreInitial: true,
  cwd: config.cwd
}

let fileChanges = {}
let building = false

const reloadDevServer = debounce(function () {
  if (fileChanges) {
    serverLog.fileChange(fileChanges)
  }
  fileChanges = {}
  building = true
  runBuild().then(() => {
    state.devServer.reload().then(() => {
      building = false
    })
  }).catch(logError)
}, config.reloadDebounce)

chokidar.watch(config.watched, watchSettings).on('all', (event, path) => {
  if (!building) {
    fileChanges[Object.keys(fileChanges).length + 1 + '.'] = { File: path, Event: event }
    reloadDevServer()
  }
})

function debounce (func, wait) {
  let run = true
  return function () {
    const context = this
    if (run) {
      run = false
      func.apply(context)
      setTimeout(() => {
        run = true
      }, wait)
    }
  }
}
