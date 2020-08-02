const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const ROLLUP = require('../builder/rollup.js')
const logServer = require('../server/log-server.js')

const files = ['./script-dev.js', './script-links.js']

async function compileScripts () {
  logServer.startKeystone()
  console.log(chalk.white('\n Minifying scripts'))
  let count = 1
  for (let file of files) {
    console.log(chalk.gray(`  ${count++}.`), chalk.cyanBright(file.slice(2)))
    const fileObj = path.parse(path.normalize(file))
    const tempFile = `./keystone/scripts/compiled/${fileObj.name}.temp.js`
    const minFile = `./keystone/scripts/compiled/${fileObj.name}.min.js`

    fs.ensureFileSync(tempFile)
    fs.writeFileSync(tempFile, require(file))
    
    const result = await ROLLUP('', path.parse(path.normalize(tempFile)), path.normalize(tempFile))
    fs.unlink(tempFile)
    
    fs.ensureFileSync(minFile)
    fs.writeFile(minFile, result.fileContent)
  }
  return true
}

compileScripts().then(() => console.log(chalk.green.bold('\n Scripts successfully minified\n'))).catch(console.log)
