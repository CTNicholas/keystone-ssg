const rollup = require('rollup')
const marked = require('marked')
const defaultPlugins = require('../config.rollup.js')
const logError = require('../server/log-error.js')

module.exports = function (fileContent, fileObj, filePath) {
  if (fileObj && (fileObj.ext === '.html' || fileObj.ext === '.htm')) {
    return new Promise((resolve, reject) => {
      resolve({ fileContent: fileContent, fileName: fileObj.base })
    }).catch(logError)
  }

  if (fileObj && fileObj.ext === '.md') {
    let result = compileMarkdown(fileContent)
    return new Promise((resolve, reject) => {
      resolve({ fileContent: result, fileName: fileObj.name + '.html' })
    }).catch(logError)
  }

  let result

  const inputOptions = {
    input: filePath,
    onwarn: error => logError(error, filePath),
    plugins: [
      ...defaultPlugins(res => { result = res })
    ]
  }

  const outputOptions = {
    format: 'umd'
  }

  async function build () {
    try {
      const bundle = await rollup.rollup(inputOptions)
      const final = await bundle.generate(outputOptions)
      return final
    } catch (err) {
      if (err) { logError(err) }
    }
  }

  return build().then(bundle => {
    let finalCode
    let finalName
    if (result.code) {
      finalCode = result.code
      finalName = fileObj.name + result.fileExt
    } else {
      finalCode = bundle.output[0].code
      finalName = fileObj.base
    }
    return { fileContent: finalCode, fileName: finalName }
  }).catch(logError)
}

function compileMarkdown (input) {
  const replacements = [
    { before: '&lt;', after: '<' }, 
    { before: '&gt;', after: '>' },
    { before: '&quot;', after: '"' },
    { before: '&#39;', after: "'" },
    { before: '<code>', after: '`' },
    { before: '</code>', after: '`' }
  ]
  let output = marked(input)
  output = output.replace(/&lt;_(\w+)\s*([\s\S]*?)\s*\/?&gt;/igm, tag => {
    for (const { before, after } of replacements) {
      tag = tag.replace(new RegExp(before, 'igm'), after)
    }
    return tag
    // return tag.replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"')
  })
  return output
}