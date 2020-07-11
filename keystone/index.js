const getEnv = (argKey, envKey) => {
  return (
    process.env[envKey] ||
    (process.argv.find(x => x.startsWith(argKey)) || '').replace(argKey, '')
  )
}

const config = require('./config.js')
const state = require('./state.js')
const runBuild = require('./build.js')
const chalk = require('chalk')

if (process.argv.includes('--dev')) {
  state.mode = 'dev'
} else {
  state.mode = 'build'
}

console.log(chalk`{bgBlueBright.bold.white  KEYSTONE }`)

runBuild().then(() => {
  if (state.mode === 'build') {
    console.log('___________________________________________________________________\n')
    console.log(chalk`{green.bold Project successfully built}`)
    console.log(chalk`{dim Distribute {white.bold ${config.served}} directory}`)
    console.log()
  }
})

if (state.mode === 'dev') {
  require('./dev.js')
}

module.exports = {
  config
}
