const config = require('./config')
const state = require('./state.js')
const devScript = require('./dev-script.js')
const dynamicLinks = require('./dynamic-links.js')

const scripts = [
  adddynamicLinks,
  addDevScript
]

module.exports = function (fileContent, fileObj) {
  for (const script of scripts) {
    fileContent = script(fileContent, fileObj)
  }
  return fileContent
}

function adddynamicLinks (fileContent, fileObj) {
  if (isHtml(fileObj)) {
    return addToTag(fileContent, dynamicLinks, 'body')
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
