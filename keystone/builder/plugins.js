const config = require('../config')
const state = require('../state.js')
const path = require('path')
const fs = require('fs-extra')

module.exports = function (fileContent, fileObj, filePath) {
  return runPlugins(filePath, fileObj) || filePath

  function runPlugins () {
    for (const plugin of config.prePlugins) {
      if (plugin.input === fileObj.ext || (typeof Array && plugin.input.includes(fileObj.ext))) {
        console.log('Plugin found:', plugin.input)
        return getPluginResult(plugin)
      }
    }
    return { fileContent: fileContent, fileName: fileObj.base }
  }

  function getPluginResult (plugin) {
    let result
    try {
      result = plugin.run({
        inputContent: fileContent,
        inputPath: filePath,
        inputExt: fileObj.ext
      })
      if (Buffer.isBuffer(result)) {
        result = result.toString('utf-8')
      }
      return { fileContent: result, fileName: fileObj.name + plugin.output }
    } catch (err) {
      console.log('ERROR: ' + fileObj.ext + ' plugin error')
      console.log(err)
      state.devServer.error(err)
      return { fileContent: fileContent, fileName: fileObj.base }
    }
  }
}
