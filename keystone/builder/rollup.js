const state = require('../state.js')
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
  let devInputOptions = {}
  let devOutputOptions = {}

  if (state.mode === 'dev') {
    devInputOptions = {}
    devOutputOptions = {
      sourcemap: 'inline'
    }
  }
  
  const inputOptions = {
    input: filePath,
    onwarn: error => logError(error, filePath),
    ...devInputOptions,
    plugins: [
      ...defaultPlugins(res => { result = res }, state)
    ]
  }

  const outputOptions = {
    format: 'iife',
    ...devOutputOptions
  }

  async function build () {
    try {
      const bundle = await rollup.rollup(inputOptions)
      const final = await bundle.generate(outputOptions)
      return final
    } catch (err) {
      if (err) { logError(err) }
      result = { code: 'error', fileExt: 'error' }
    }
  }

  return build().then(bundle => {
    let finalCode
    let finalName
    let finalMap
    if (result.code) {
      // SCSS/CSS file
      finalCode = result.code
      finalName = fileObj.name + result.fileExt
      finalMap = result.map || null
    } else if (isScssError(result.code, fileObj.ext)) {
      // SCSS/CSS error
      logError({ code: 'SCSS_ERROR' }, { path: filePath, name: fileObj.base })
      finalName = fileObj.base
      finalMap = bundle.output[0].map || null
      finalCode = `${bundle.output[0].code}${finalMap ? `\n//# sourceMappingURL=${finalMap.toUrl()}` : ''}`
    } else {
      // Other type of file
      finalName = fileObj.base
      finalMap = bundle.output[0].map || null
      if (finalMap) {
        finalCode = `${bundle.output[0].code}${finalMap ? `\n//# sourceMappingURL=${finalMap.toUrl()}` : ''}`
      } else {
        finalCode = bundle.output[0].code
      }
    }
    return { fileContent: finalCode, fileName: finalName, sourceMap: finalMap }
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
  })
  return output
}

function isScssError (css, ext) {
  const cssExts = ['.css', '.scss', '.sass']
  return cssExts.includes(ext) && css === undefined
}