const fs = require('fs')
const plugins = require('./plugins.js')
const path = require('path')

const compileTypes = {
  file: addPartial
}

module.exports = function (fileContent) {
  // <<([^<>]+)>>
  // /<<([^<>]+)=([^<>]+)>>/igm
  return compiler(fileContent)
}

function compiler (fileContent) {
  // console.log('before content:', fileContent)
  const varRegex = /<<([^<>]+)=([^<>]+)>>/igm
  fileContent = fileContent.replace(varRegex, (match, p1, p2) => {
    console.log('MATCHES', match, p1, p2)
    const command = { func: p1.trim(), val: p2.trim() }
    if (Object.keys(compileTypes).includes(command.func)) {
      console.log('got f', command)
      return compileTypes[command.func](command.val) || match
    } else {
      return match
    }
  })
  console.log('FCCC', fileContent)
  return fileContent
}

function addPartial (filePath) {
  console.log('pls')
  filePath = path.normalize(filePath)
  console.log(2, filePath)
  try {
    if (fs.existsSync(filePath)) {
      console.log('exist')
      const fileObj = path.parse(filePath)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const newFile = plugins(fileContent, fileObj, filePath)
      newFile.fileContent = compiler(newFile.fileContent)
      return newFile.fileContent
    } else {
      return false
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

