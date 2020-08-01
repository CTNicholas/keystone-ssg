const chalk = require('chalk')
const config = require('../config.js')
const state = require('../state.js')
const serverLog = require('./log-server.js')
const { divider } = require('./log-server.js')
const consoleLog = console.log

const errorList = {
  ENOENT: enoent,
  EADDRINUSE: eaddrinuse,
  PLUGIN_ERROR: plugin_error,
  SCSS_ERROR: scss_error
}

module.exports = function (error, info) {
  if (!ignoreError(error) && !state.error) {
    state.error = true
    startError(error, info)
    if (Object.keys(errorList).includes(error.code)) {
      errorList[error.code](error, info)
    } else {
      defaultError(error, info)
    }
    endError()
  } else if (!ignoreError(error)) {
    serverLog.errorsSuppressed++
  }
}

function scss_error (error, { path, name }) {
  console.log(chalk` {gray Code:} {whiteBright ${error.code}}`)
  console.log(chalk` {gray File:} {redBright.bold ${path}}`)
  console.log(chalk` {gray Info:} {white See above, SCSS/CSS error in }: {inverse.bold  ${name} }`)
  console.log()
  console.log = null // Only way to prevent async duplicated automatic scss error logging
}

function plugin_error (error) {
  console.log(chalk` {gray Code:} {whiteBright ${error.code}}`)
  console.log(chalk` {gray File:} {redBright.bold ${error.loc.file}}`)
  console.log(chalk` {gray Info:} {whiteBright Unexpected token or syntax error at}: {inverse.bold  line ${error.loc.line} column ${error.loc.column} }`)
  console.log()
  console.log(chalk.bold(error.frame))
}

function eaddrinuse (error, { port }) {
  let portOption = port === config.port ? 'port' : 'portWs'
  console.log(chalk` {gray Code:} {whiteBright ${error.code}}`)
  console.log(chalk` {gray Port:} {whiteBright.bold ${port}}`)
  console.log(chalk` {gray Info:} {whiteBright Port ${port} already in use, or Keystone already running}`)
  console.log(chalk` {gray  Fix:} {whiteBright Stop other process, or change {cyanBright ${portOption}} in keystone.config.js}`)
  console.log()
}

function enoent (error, { path, name }) {
  console.log(chalk` {gray Code:} {whiteBright ${error.code}}`)
  console.log(chalk` {gray File:} {whiteBright.bold ${path || name}}`)
  console.log(chalk` {gray Info:} {whiteBright File missing or incorrect path referenced}: {inverse.bold  ${error.path} }`)
}

function defaultError (error) {
  console.log(' Error: ', error.code)
  console.log(error)
}

function startError (error) {
  if (error.code !== 'SCSS_ERROR') {
    divider()
  }
  if (state.fullErrors) {
    console.log(error)
    console.log()
  }
  console.log(chalk.bgRed.white.bold(' ERROR '))
}

function endError () {
  if (state.fullErrors) {
    console.log(chalk` {gray (stack trace above)}`)
    divider()
  }
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
