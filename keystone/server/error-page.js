const wsScript = require('../scripts/dev-script.js')
const config = require('../config.js')

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
      <small>Incorrect URL, or check server console for errors.</small>
      <small>Ensure that there are .html files in the ${config.build} folder. If not, fix this and restart server.</small>
    </h1>
  </body>
</html>
`
