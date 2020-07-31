const state = require('../state.js')
const runDev = require('../dev.js')
const chokidar = require('chokidar')


module.exports = function () {
  if (state.devServer.length > 0) {
    console.log('Dev server running')
    state.devServer.stop()
    state.devServer = {}
  }
  console.log('Error, waiting for file change')
  runDev()
}




/*

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
*/