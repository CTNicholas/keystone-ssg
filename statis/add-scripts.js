const config = require('./config')
const state = require('./state.js')
const devScript = require('./dev-script.js')
const pill = require('./pill.js')

const scripts = [
  addPill,
  addDevScript
]

module.exports = function (fileContent, fileObj) {
  for (const script of scripts) {
    fileContent = script(fileContent, fileObj)
  }
  return fileContent
}

function addPill (fileContent, fileObj) {
  if (isHtml(fileObj)) {
    return addToTag(fileContent, pill, 'body')
  }
  return fileContent
}

function addDevScript (fileContent, fileObj) {
  if (state.mode === 'dev' && isHtml(fileObj)) {
    return addToTag(fileContent, devScript, 'head')
  }
  return fileContent
}

function addToTag (fileContent, newContent, tag) {
  let addedScript = false
  return fileContent.replace(`</${tag}>`, () => {
    if (!addedScript) {
      addedScript = true
      return newContent + `</${tag}>`
    }
  })
}

function isHtml (fileObj) {
  return fileObj.ext.includes('.htm')
}
