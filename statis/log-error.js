const chalk = require('chalk')
const state = require('./state.js')
const serverLog = require('./log-server.js')

const errorList = {
  ENOENT: enoent
}

module.exports = function (error) {
  state.error = true
  startError(error)
  if (errorList[error.code]) {
    errorList[error.code](error)
  } else {
    defaultError(error)
  }
  endError()
}

function enoent (error) {
  console.log(chalk`{gray Code:} {whiteBright ${error.code}}`)
  console.log(chalk`{gray Info:} {whiteBright File missing or incorrect path referenced}`)
  console.log(chalk`{gray Path:} {inverse.bold  ${error.path} }`)
  // state.devServer.stop()
  console.log('STOP', state.pauseServer)
}

function defaultError (error) {
  console.log('Error: ', error.code)
}

function startError (error) {
  serverLog.divider()
  console.log(error)
  console.log()
  console.log(chalk.bgRed.white.bold(' ERROR '))
}

function endError () {
  console.log(chalk`{gray (stack trace above)}`)
  serverLog.divider()
}
