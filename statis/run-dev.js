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
  if (fileChanges) {
    serverLog.fileChange(fileChanges)
  }
  fileChanges = {}
  building = true
  runBuild().then(() => {
    devServer.reload().then(() => {
      building = false
    })
  })
}, config.reloadDebounce)

chokidar.watch(config.watched, watchSettings).on('all', (event, path) => {
  if (!building) {
    fileChanges[Object.keys(fileChanges).length + 1 + '.'] = { File: path, Event: event }
    reloadDevServer()
  }
})

function debounce (func, wait) {
  let run = true
  return function (...args) {
    const context = this
    if (run) {
      run = false
      func.apply(context, args)
      setTimeout(() => {
        run = true
      }, wait)
    }
  }
}
