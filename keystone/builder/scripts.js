// const config = require('../config')
const state = require('../state.js')
const runRollup = require('./rollup')
const path = require('path')

const devScript = require('../scripts/dev-script.js')
const dynamicLinks = require('../scripts/dynamic-links.js')

const scripts = [
  adddynamicLinks,
  addDevScript
]

module.exports = async function (fileContent, fileObj, filePath) {
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
  fileContent = fileContent.replace(`</${tag}>`, () => {
    if (!addedScript) {
      addedScript = true
      return newContent + `</${tag}>`
    }
  })
  if (!addedScript) {
    fileContent = `<${tag}>${newContent}</${tag}>${fileContent}`
  }
  return fileContent
}

function isHtml (fileObj) {
  return fileObj.ext.includes('.htm')
}
