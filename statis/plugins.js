const config = require('./config')
const path = require('path')
const fs = require('fs')

module.exports = function (file) {
  const fileObj = path.parse(file)
  return runPlugins(file, fileObj) || file

  function runPlugins () {
    console.log('Checking for plugin')
    for (const plugin of config.plugins) {
      if (plugin.input === fileObj.ext || (typeof Array && plugin.input.includes(fileObj.ext))) {
        console.log('Plugin found:', plugin.input)
        return getPluginResult(plugin)
      }
    }
  }

  function getPluginResult (plugin) {
    const fileContent = fs.readFileSync(file, 'utf-8')
    const result = plugin.run({
      inputContent: fileContent,
      inputPath: file,
      inputExt: fileObj.ext
    })
    const newPath = path.join(fileObj.dir, fileObj.name + plugin.output)
    if (result) {
      console.log('Writing', newPath, new Date().getTime())
      fs.writeFileSync(newPath, result)
    }
    console.log('Written', new Date().getTime())
    return newPath
  }
}
