const config = require('./config.js')
const state = require('./state.js')
const chokidar = require('chokidar')
const Server = require('./server/server.js')
const serverLog = require('./server/log-server.js')
const runBuild = require('./build.js')
const logError = require('./server/log-error.js')

module.exports = function () {
  state.devServer = new Server()
  
  const watchSettings = {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    ignoreInitial: true,
    cwd: config.cwd
  }
  
  let fileChanges = {}
  let building = false
  
  const reloadDevServer = debounce(function () {
    state.error = false
    if (fileChanges) {
      serverLog.fileChange(fileChanges)
    }
    const holdChanges = { ...fileChanges }
    fileChanges = {}
    building = true
    runBuild(holdChanges).then(() => {
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
}
  
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
