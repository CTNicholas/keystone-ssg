const chalk = require('chalk')
const config = require('../config.js')
const state = require('../state.js')
// const errorServer = require('./server-error.js')
const serverLog = require('./log-server.js')

const errorList = {
  ENOENT: enoent,
  EADDRINUSE: eaddrinuse,
  PLUGIN_ERROR: plugin_error
}

module.exports = function (error, info) {
  if (!ignoreError(error) && !state.error) {
    console.log(state.suppressErrors)
    //if (state.suppressErrors) {
      state.error = true
    //}
    startError(error, info)
    if (Object.keys(errorList).includes(error.code)) {
      errorList[error.code](error, info)
    } else {
      defaultError(error, info)
    }
    endError()
    // errorServer()
  } else if (!ignoreError(error)) {
    console.log('Error suppressed')
  }
}

function plugin_error (error, info = {}) {
  console.log(chalk` {gray Code:} {whiteBright ${error.code}}`)
  console.log(chalk` {gray File:} {whiteBright.bold ${error.loc.file}}`)
  console.log(chalk` {gray Info:} {whiteBright Unexpected token or syntax error at}: {inverse.bold  line ${error.loc.line} column ${error.loc.column} }`)
  console.log()
  console.log(error.frame)
  console.log()
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
  if (state.fullErrors) {
    console.log(error)
    console.log()
  }
  console.log(chalk.bgRed.white.bold(' ERROR '))
}

function endError () {
  if (state.fullErrors) {
    console.log(chalk` {gray (stack trace above)}`)
  }
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
