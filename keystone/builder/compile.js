const config = require('../config.js')
const fs = require('fs-extra')
const runRollup = require('./rollup.js')
const path = require('path')
const state = require('../state.js')
const logError = require('../server/log-error.js')
const logServer = require('../server/log-Server.js')

/*
 * Add a function to compileTypes to add a new substituion
 * <html-word name="apple" large> will run the function assigned to { word: addWord }
 * The function is sent the attributes and must return a value to replace the tag
 * addWord({ name: apple, large: true })
 * addWord (attrs) { return 'I am a <b>' + attrs.name + '</b>' }
 */

const excludedAttributes = ['src']

const compilePrefix = '_'
const varRegex = new RegExp(`<${compilePrefix}(\\w+)\\s*([\\s\\S]*?)\\s*\\/?>`, 'igm')

const compileTypes = {
  template: addTemplate,
  import: addImport,
  script: addScript,
  asset: addAssets,
  style: addStyle,
  link: addLinks,
  var: addVars
}

module.exports = async function ({ fileContent, fileName }, fileObj) {
  return compiler({}, fileContent, fileObj, fileName)
}

/*
 * Promises don't work well with replace, so we get the substition values,
 * and then make the replacements after
 */
async function compiler (compileVars = {}, fileContent, fileObj, fileName) {
  const asyncPromises = []
  const asyncResults = []
  const slotContent = { slot: false }

  // REGEX: /<_(\w+)\s*([\s\S]*?)\s*\/?>/igm
  fileContent.replace(varRegex, (match, p1, p2) => {
    asyncResults[`${match}${p1}${p2}`] = {
      content: '',
      slot: false
    }

    asyncPromises.push(new Promise((resolve, reject) => {
      const command = { func: p1.toLowerCase(), attr: getAttributes(p2) }
      if (Object.keys(compileTypes).includes(command.func)) {
        compileTypes[command.func]({
          attrs: command.attr,
          fileObj: fileObj,
          vars: compileVars,
          fileName: fileName,
          slotContent
          // promiseObj: asyncResults[`${match}${p1}${p2}`]
        }).then(res => {
          asyncResults[`${match}${p1}${p2}`].content = res === false ? match : res
          resolve()
          return match
        }).catch(error => {
          logError(error, { name: fileName })
          asyncResults[`${match}${p1}${p2}`].content = match
          return match
        })
      } else {
        asyncResults[`${match}${p1}${p2}`].content = match
        resolve()
        return match
      }
    }))
  })

  return Promise.all(asyncPromises).then(() => {
    let newFileContent = fileContent.replace(varRegex, (match, p1, p2) => {
      return asyncResults[`${match}${p1}${p2}`].content
    })
    newFileContent = addSlots(newFileContent, slotContent.slot)
    return removeTrailingTags(newFileContent)
  })
}

function addSlots (content, slotContent) {
  if (slotContent) {
    return slotContent.replace(varRegex, (match, p1, p2, p3) => {
      if (p1.toLowerCase() === 'slot') {
        slotContent = ''
        return content
      }
    })
  }
  return content
}

async function addTemplate ({ attrs, slotContent }) {
  return addImport({ attrs }, 'templates').then(res => {
    slotContent.slot = res
    return ''
  })
}

async function addScript ({ attrs, fileObj }) {
  const finalScript = await addImport({ attrs }, 'src')
  const filePath = checkPath(attrs, 'src')
  if (filePath) {
    const newName = path.parse(filePath).name
    const publicPath = path.join(config.served, 'js', newName + '.js')
    if (!alreadyCompiled(filePath)) {
      fs.ensureDirSync(path.join(config.served, 'js'))
      await fs.writeFileSync(publicPath, finalScript)
    }
    return `<script src="${config.indexPath}js/${newName}.js"></script>`
  }
  return false
}

async function addStyle ({ attrs }) {
  const filePath = checkPath(attrs, 'styles')
  if (filePath) {
    const newName = path.parse(filePath).name
    const publicPath = path.join(config.served, 'css', newName + '.css')
    if (!alreadyCompiled(filePath)) {
      const fileObj = path.parse(filePath)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const newFile = await runRollup(fileContent, fileObj, filePath)
      newFile.fileContent = await compiler(getVariables(attrs, excludedAttributes), newFile.fileContent)
      fs.ensureDirSync(path.join(config.served, 'css'))
      fs.writeFileSync(publicPath, newFile.fileContent)
    }
    logServer.bundling(filePath)
    return `<link rel="stylesheet" href="${config.indexPath}css/${newName}.css">`
  } else {
    return false
  }
}

async function addImport ({ attrs }, defaultDir = 'components') {
  const filePath = checkPath(attrs, defaultDir)
  if (filePath) {
    try {
      const fileObj = path.parse(filePath)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const newFile = await runRollup(fileContent, fileObj, filePath)
      newFile.fileContent = await compiler(getVariables(attrs, excludedAttributes), newFile.fileContent, fileObj)
      logServer.bundling(filePath)
      return await newFile.fileContent
    } catch (error) {
      logError(error, { path: filePath })
      return false
    }
  } else {
    return false
  }
}

async function addAssets ({ attrs }) {
  const filePath = checkPath(attrs, 'assets')
  if (filePath) {
    const fileObj = path.parse(filePath)
    const publicPath = path.join(config.served, 'assets', fileObj.base)
    fs.ensureDirSync(path.join(config.served, 'assets'))
    fs.copySync(filePath, publicPath)
    logServer.bundling(filePath)
    return `${config.indexPath}assets/${fileObj.base}`
  }
  return false
}

async function addLinks ({ attrs }) {
  if ('to' in attrs && 'text' in attrs) {
    return '<a href="' + config.indexPath + attrs.to + '">' + attrs.text + '</a>'
  } else {
    return false
  }
}

async function addVars ({ attrs, fileObj, vars }) {
  let result = ''
  for (const [name, val] of Object.entries(attrs)) {
    if (val === true && vars[name]) {
      result += vars[name]
    }
  }
  if (!result) {
    result = attrs.default || ''
    if (!attrs.default) {
      // console.log(`_VAR UNDEFINED in ${fileObj.base}:`, Object.keys(vars).join())
    }
  }
  return result
}

function getVariables (attrs, exclude) {
  return Object.fromEntries(Object.entries(attrs).filter(([name, val]) => !exclude.includes(name))) || {}
}

function getAttributes (attrString) {
  const attrRegex = /([^\s=]+)(?:=(['"`])(.*?)\2)?/igm
  const res = {}
  attrString.replace(attrRegex, (all, a1, a2, a3) => {
    res[a1] = a3 || true
  })
  return res
}

function checkPath (attrs, defaultDir) {
  try {
    if ('src' in attrs) {
      return dirExists(attrs.src)// Return if src is valid
    }
    for (const [key, val] of Object.entries(attrs)) {
      if (val === true) {
        return dirExists(key, true) // Returns first attribute key that is a real path
      }
    }
    return false // Else return false
  } catch (error) {
    logError(error, { path: defaultDir })
    return false
  }

  function dirExists (currPath, addDir = false) {
    let normalPath = path.normalize(currPath)
    if (addDir) { normalPath = path.join(defaultDir, normalPath) }
    return fs.existsSync(normalPath) ? normalPath : false
  }
}

function removeTrailingTags (text) {
  for (const comp of Object.keys(compileTypes)) {
    text = text.replace(new RegExp(`<\\/${compilePrefix}${comp}>`, 'igm'), () => {
      return ''
    })
  }
  return text
}

function alreadyCompiled (filePath) {
  return state.filesBuilt.includes(path.normalize(filePath))
}
