const rollup = require('rollup')
const defaultPlugins = require('./config.rollup.js')

module.exports = function (fileContent, fileObj, filePath) {
  console.log('START OF RUN ROLLUP', filePath)
  if (fileObj.ext === '.html') {
    return new Promise((resolve, reject) => {
      resolve({ fileContent: fileContent, fileName: fileObj.base })
    }).catch(console.log)
  }

  let result

  const inputOptions = {
    input: filePath,
    plugins: [
      ...defaultPlugins(res => { result = res })
    ]
  }

  const outputOptions = {
    format: 'umd'
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
    // console.log('finalename', finalName)
    return { fileContent: finalCode, fileName: finalName }
  })

  async function build () {
    try {
      const bundle = await rollup.rollup(inputOptions)
      return bundle.generate(outputOptions)
    } catch (err) {
      if (err) throw err
      console.log(err)
    }
  }
}
