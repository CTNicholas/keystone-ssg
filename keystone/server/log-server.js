const config = require('../config.js')
const chalk = require('chalk')

module.exports = {
  fileChange,
  serverRunning,
  divider,
  bundling,
  startBuild,
  endBuild,
  startKeystone,
  endBuildMode
}

let bundleCount = 0

function startBuild () {
  bundleCount = 0
  console.log()
  console.log(chalk`{dim  Bundling files...}`)
}

function bundling (file) {
  bundleCount++
  const str = '' + bundleCount + '.'
  console.log(chalk` {grey ${str.length < 3 ? ` ${str}` : str}} {grey ${file}}`)
}

function endBuild () {
  console.log()
  console.log(chalk`{white.bold  Bundle generated}`)
}

function startKeystone () {
  divider()
  console.log()
  console.log(chalk` {bgBlueBright.bold.white  KEYSTONE }`)
}

function endBuildMode () {
  divider()
  console.log(chalk`{green.bold  Project successfully built:} {dim Distribute {white.bold /${config.served}/} directory}`)
  console.log()
}

function fileChange (changes) {
  // divider()
  console.table(changes)
}

function serverRunning (port) {
  // setTimeout(() => {
  divider()
  console.log(chalk`{green  Dev server running at {bold http://localhost:${port}}}\n`)
  // }, 50)
}

function divider () {
  console.log('___________________________________________________________________\n')
}
