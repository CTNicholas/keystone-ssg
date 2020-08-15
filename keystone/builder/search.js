const config = require('../config.js')
const writeFile = require('./write.js')
const logError = require('../server/log-error.js')
const fs = require('fs-extra')
const path = require('path')

let searchItems = []

function add (file) {
  const { fileContent, filePath } = file.new
  if (config.searchFile && notIndexed(filePath)) {
    searchItems.push({
      path: getUrl(filePath),
      title: getTitle(fileContent),
      content: getInnerText(fileContent)
    })
  }
}

function create () {
  if (config.searchFile) {
    try {
      const searchPath = path.join(config.served, 'search.json')
      fs.writeFileSync(searchPath, JSON.stringify(searchItems))
    } catch (err) {
      logError(err)
    }
    searchItems = []
  }
}

module.exports = { add, create }

var Entities = require('html-entities').AllHtmlEntities
var entities = new Entities()

function notIndexed (filePath) {
  return !searchItems.some(({ path }) => path === filePath)
}

function getInnerText (html) {
  html = removeTag(html, 'style')
  html = removeTag(html, 'script')
  return entities.decode(html.split(/<[^>]+>/)
    .map(chunk => chunk.trim())
    .filter(trimmedChunk => trimmedChunk.length > 0)
    .join(' ')
  );
}

function removeTag (html, tag) {
  return html.replace(new RegExp(`<${tag}>(.|\n)*?</${tag}>`, 'igm'), '')
}

function getTitle (html) {
  const title = html.match("<title>((?:.|\n)*?)</title>")
  return title ? title[1] : ''
}

function getUrl (filePath) {
  const configPath = path.normalize(config.served)
  filePath = path.normalize(filePath.replace(configPath, ''))
  filePath = filePath.replace(new RegExp(path.delimiter, 'igm'), '/')
  return filePath.replace(/\\/igm, '/')
}
