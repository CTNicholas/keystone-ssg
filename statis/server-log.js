module.exports = {
  fileChange,
  serverRunning
}

function fileChange (changes) {
  // divider()
  console.log('\n\nFile changes, page reloading')
  console.table(changes)
}

function serverRunning (port) {
  divider()
  console.log(`Dev server running at http://localhost:${port}`)
}

function divider () {
  console.log('___________________________________________________________________\n')
}
