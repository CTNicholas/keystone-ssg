const config = require('../config.js')
const wsScript = require('../scripts/dev-script.js')
// const fs = require('fs-extra')

const emptyDir = false
// emptyDir = fs.readdirSync(config.build).length === 0

module.exports = `
<html>
  <head>
    <title>Dev server error</title>
    <style>
      body { margin: 1rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; }
      small { font-weight: normal; opacity: 0.7; font-size: 0.7em; display: block; }
    </style>
    ${wsScript}
  </head>
  <body>
    <h1>
      Error
      ${emptyDir ? `<small>${config.build} folder is empty. Place .html files here and restart server.</small>` : ''}
      <small>Incorrect URL, or check server console for errors.</small>
    </h1>
  </body>
</html>
`
