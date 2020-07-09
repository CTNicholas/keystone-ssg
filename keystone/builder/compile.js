const config = require('../config.js')
const fs = require('fs-extra')
const runRollup = require('./rollup.js')
const path = require('path')
const state = require('../state.js')
const logError = require('../server/log-error.js')

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
        }).catch(error => logError(error, { name: fileName }))
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
  return addImport({ attrs }).then(res => {
    slotContent.slot = res
    return ''
  })
}

async function addScript ({ attrs, fileObj }) {
  if ('src' in attrs) {
    const filePath = path.normalize(attrs.src)
    const newPath = path.join('js', path.parse(filePath).name + '.js')
    const scriptContent = fs.readFileSync(filePath, 'utf-8')
    const publicPath = path.join('public', newPath)
    if (!alreadyCompiled(filePath)) {
      runRollup(scriptContent, fileObj, newPath).then(result => {
        fs.ensureDirSync(path.join('public', 'js'))
        fs.writeFileSync(publicPath, result.fileContent)
      })
    }
    return '<script src="' + config.indexPath + newPath + '"></script>'
  } else {
    return false
  }
}

async function addStyle ({ attrs }) {
  if ('src' in attrs) {
    const filePath = path.normalize(attrs.src)
    const newPath = path.join('css', path.parse(filePath).name + '.css')
    const publicPath = path.join('public', newPath)
    if (!alreadyCompiled(filePath)) {
      const fileObj = path.parse(filePath)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const newFile = await runRollup(fileContent, fileObj, filePath)
      newFile.fileContent = await compiler(getVariables(attrs, excludedAttributes), newFile.fileContent)
      fs.ensureDirSync(path.join('public', 'css'))
      await fs.writeFileSync(publicPath, newFile.fileContent)
    }
    return '<link rel="stylesheet" href="' + config.indexPath + newPath + '">'
  } else {
    return false
  }
}

async function addImport ({ attrs }) {
  if ('src' in attrs) {
    const filePath = path.normalize(attrs.src)
    try {
      if (fs.existsSync(filePath)) {
        const fileObj = path.parse(filePath)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const newFile = await runRollup(fileContent, fileObj, filePath)
        newFile.fileContent = await compiler(getVariables(attrs, excludedAttributes), newFile.fileContent)
        return await newFile.fileContent
      } else {
        return false
      }
    } catch (error) {
      logError(error, { path: filePath })
      return false
    }
  } else {
    return false
  }
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
    if (val === true) {
      result += vars[name]
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
