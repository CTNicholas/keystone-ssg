module.exports = {
  fileChange,
  serverRunning
}

function fileChange (changes) {
  divider()
  console.log('File changes')

  console.log(changes)

  // console.table(changes)

  for (const change of changes) {
    console.log(change)
  }

  console.log('Server reloading')
  divider()
}

function serverRunning (port) {
  setTimeout(() => {
    divider()
    console.log(`Dev server running at http://localhost:${port}`)
  }, 50)
}

function divider () {
  console.log('___________________________________________________________________\n')
}
