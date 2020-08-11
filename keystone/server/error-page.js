const config = require('../config.js')
const fs = require('fs-extra')

const devScript = loadScript('../scripts/compiled/script-dev.min.js')
const dynamicLinks = loadScript('../scripts/compiled/script-links.min.js')

const emptyDir = false
// emptyDir = fs.readdirSync(config.build).length === 0

module.exports = `
<html>
  <head>
    <title>Dev server error</title>
    <style>
      body { margin: 1rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; }
      small, p { font-weight: normal; opacity: .7; font-size: .7em; display: block; }
      p { margin-top: .5em; opacity: 1; }
      a { color: #4086DB; font-weight: 600; }
    </style>
    <script>${devScript()}</script>
    </head>
    <body>
    <h1>
    Error
    ${emptyDir ? `<small>${config.build} folder is empty. Place .html files here and restart server.</small>` : ''}
    <small>Incorrect URL, or check server console for errors.</small>
    <p><a href="/">index.html</a></p>
    </h1>
    <script>${dynamicLinks()}</script>
  </body>
</html>
`
function loadScript (script) {
  let cache = null
  return () => { 
    if (cache === null) {
      cache = fs.readFileSync(require.resolve(script), 'utf-8')
    }
    return cache
  }
}
