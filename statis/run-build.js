const config = require('./config')
const fs = require('fs')
const path = require('path')
const recursive = require('recursive-readdir')
const plugins = require('./plugins.js')
const compile = require('./compile.js')

console.log('Building..')

/*
fs.readdirSync(config.build).forEach(file => {
  console.log(file)
})
*/

recursive(config.build, (err, files) => {
  if (err) throw err
  console.log(files, config.build)

  let baseDirs = path.normalize(config.build).split(path.sep)
  if (baseDirs[baseDirs.length - 1] === '') {
    baseDirs = baseDirs.slice(0, -1)
  }
  baseDirs = baseDirs.length

  for (let filePath of files) {
    filePath = plugins(filePath)
    const data = compile(filePath)
    filePath = filePath.split(path.sep).slice(baseDirs).join(path.sep)
    console.log(filePath)
  }
})
