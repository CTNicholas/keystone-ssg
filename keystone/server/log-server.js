const config = require('../config.js')
const state = require('../state.js')
const chalk = require('chalk')
const consoleLog = console.log

let bundleFiles = []
let bundleCount = 0
let errorsSuppressed = 0

module.exports = {
  fileChange,
  serverRunning,
  divider,
  bundling,
  startBuild,
  endBuild,
  startKeystone,
  endBuildMode,
  errorsSuppressed
}

function startBuild () {
  bundleFiles = []
  bundleCount = 0
  errorsSuppressed = 0
  console.log()
  console.log(chalk`{dim  Bundling files}`)
}

function bundling (file) {
  if (state.error === false && !bundleFiles.includes(file)) {
    bundleCount++
    bundleFiles.push(file)
    const str = '' + bundleCount + '.'
    console.log(chalk` {grey ${str.length < 3 ? ` ${str}` : str}} {grey ${file}}`)
  }
}

function endBuild () {
  if (state.error === false) {
    console.log()
    console.log(chalk`{white.bold  ${state.mode === 'dev' ? 'Development' : 'Production'} bundle generated}`)
  } else if (errorsSuppressed) {
    console.log(chalk`{white.bold  ${errorsSuppressed}} errors supressed`)
  }
}

function startKeystone () {
  divider()
  console.log()
  console.log(chalk` {bgBlueBright.bold.white  KEYSTONE }`)
}

function endBuildMode () {
  if (state.error === false) {
    divider()
    console.log(chalk`{green.bold  Project successfully built:} {dim Distribute {white.bold /${config.served}/} directory}`)
  } else {
    console.log(chalk`{redBright.bold  Project build error:} {dim Fix error and rebuild}`)
  }
  console.log()
}

function fileChange (changes) {
  for (const [index, { File, Event }] of Object.entries(changes)) {
    console.log(chalk` File ${Event}`)
    console.log(chalk` {grey ${index.length < 3 ? ` ${index}` : index}} {cyanBright.bold ${File}}`)
  }
}

function serverRunning (port) {
  if (console.log === null) { console.log = consoleLog } // Part of scss error log fix
  if (state.error === false) {
    divider()
    console.log(chalk`{green  Dev server running at {bold http://localhost:${port}}}\n`)
  } else {
    divider()
    console.log(chalk`{redBright.bold  Dev server awaiting error fix...}\n`)
  }
  
}

function divider () {
  console.log('___________________________________________________________________\n')
}
