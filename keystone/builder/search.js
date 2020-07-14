const config = require('../config.js')
const writeFile = require('./write.js')
const logError = require('../server/log-error.js')
const fs = require('fs-extra')
const path = require('path')

const searchItems = []

function add (html, filePath) {
  if (config.searchFile) {
    searchItems.push({
      path: getUrl(filePath),
      title: getTitle(html),
      content: getInnerText(html)
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
  }
}

module.exports = { add, create }

var Entities = require('html-entities').AllHtmlEntities
var entities = new Entities()

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
  return html.match("<title>((?:.|\n)*?)</title>")[1]
}

function getUrl (filePath) {
  const configPath = path.normalize(config.served)
  filePath = path.normalize(filePath.replace(configPath, ''))
  filePath = filePath.replace(new RegExp(path.delimiter, 'igm'), '/')
  return filePath.replace(/\\/igm, '/')
}
