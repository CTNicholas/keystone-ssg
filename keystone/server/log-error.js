const chalk = require('chalk')
const config = require('../config.js')
const state = require('../state.js')
const serverLog = require('./log-server.js')

const errorList = {
  ENOENT: enoent,
  EADDRINUSE: eaddrinuse
}

module.exports = function (error, info) {
  if (!ignoreError(error)) {
    state.error = true
    startError(error, info)
    if (errorList[error.code]) {
      errorList[error.code](error, info)
    } else {
      defaultError(error, info)
    }
    endError()
  }
}

function eaddrinuse (error, { path, name }) {
  console.log(chalk` {gray Code:} {whiteBright ${error.code}}`)
  console.log(chalk` {gray Port:} {whiteBright.bold ${config.portWs}}`)
  console.log(chalk` {gray Info:} {whiteBright Keystone already running, or port ${config.portWs} in use}: {inverse.bold  ${error.path} }`)
}

function enoent (error, { path, name }) {
  console.log(chalk` {gray Code:} {whiteBright ${error.code}}`)
  console.log(chalk` {gray File:} {whiteBright.bold ${path || name}}`)
  console.log(chalk` {gray Info:} {whiteBright File missing or incorrect path referenced}: {inverse.bold  ${error.path} }`)
}

function defaultError (error) {
  console.log(' Error: ', error.code)
}

function startError (error) {
  serverLog.divider()
  console.log(error)
  console.log()
  console.log(chalk.bgRed.white.bold(' ERROR '))
}

function endError () {
  console.log(chalk` {gray (stack trace above)}`)
  serverLog.divider()
}

function ignoreError (error) {
  const ignore = {
    message: 'Generated an empty chunk: "style"'
  }
  for (const errMsg of Object.keys(error)) {
    if (ignore[errMsg]) {
      return true
    }
  }
  return false
}
