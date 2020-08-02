const config = require('../config')
const state = require('../state.js')
const fs = require('fs-extra')

const devScript = loadScript('../scripts/compiled/script-dev.min.js')
const dynamicLinks = loadScript('../scripts/compiled/script-links.min.js')

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
  if (config.dynamicLinks && isHtml(fileObj)) {
    const finalScript = `<script>${dynamicLinks()}</script>`
    return addToTag(fileContent, finalScript, 'body')
  }
  return fileContent
}

function addDevScript (fileContent, fileObj) {
  if (state.mode === 'dev' && isHtml(fileObj)) {
    const finalScript = `
      <!-- KEYSTONE: Dev server script, use 'npm run build' for production -->\n 
      <script>${devScript()}</script>
    `
    return addToTag(fileContent, finalScript, 'head')
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

function loadScript (script) {
  let cache = null
  return () => { 
    if (cache === null) {
      cache = fs.readFileSync(require.resolve(script), 'utf-8')
    }
    return cache
  }
}