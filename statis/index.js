const getEnv = (argKey, envKey) => {
  return (
    process.env[envKey] ||
    (process.argv.find(x => x.startsWith(argKey)) || '').replace(argKey, '')
  )
}

const DEV_SERVER = process.argv.includes('--dev')

console.log('Dev?', DEV_SERVER)

if (DEV_SERVER) {
  require('./server/run-server.js')
}
