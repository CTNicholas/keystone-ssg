const config = require('./config.js')
const state = require('./state.js')
const runBuild = require('./build.js')
const logServer = require('./server/log-server.js')

if (process.argv.includes('--dev')) {
  state.mode = 'dev'
} else {
  state.mode = 'build'
}

logServer.startKeystone()

runBuild().then(() => {
  if (state.mode === 'build') {
    logServer.endBuildMode()
  }
  if (state.mode === 'dev') {
    require('./dev.js')
  }
})

module.exports = {
  config
}
