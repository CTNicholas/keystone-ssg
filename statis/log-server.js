const chalk = require('chalk')

module.exports = {
  fileChange,
  serverRunning,
  divider
}

function fileChange (changes) {
  divider()
  console.log('FILE CHANGES')
  console.table(changes)
  // console.log('Reloading...')
  divider()
}

function serverRunning (port) {
  //setTimeout(() => {
    divider()
    console.log(chalk`{green Dev server running at {bold http://localhost:${port}}}\n`)
  //}, 50)
}

function divider () {
  console.log('___________________________________________________________________\n')
}
