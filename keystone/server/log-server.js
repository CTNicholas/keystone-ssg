const chalk = require('chalk')

module.exports = {
  fileChange,
  serverRunning,
  divider,
  bundling,
  startBuild,
  endBuild
}

let bundleCount = 0

function startBuild () {
  bundleCount = 0
  console.log()
  console.log(chalk`{dim Bundling files...}`)
}

function bundling (file) {
  console.log(chalk`${++bundleCount}. {cyanBright ${file}}`)
}

function endBuild () {
  console.log()
  console.log(chalk`{white.bold Complete}`)
}

function fileChange (changes) {
  // divider()
  console.table(changes)
}

function serverRunning (port) {
  // setTimeout(() => {
  divider()
  console.log(chalk`{green Dev server running at {bold http://localhost:${port}}}\n`)
  // }, 50)
}

function divider () {
  console.log('___________________________________________________________________\n')
}
