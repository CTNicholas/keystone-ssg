const config = require('../config.js')

module.exports = `
  <!-- KEYSTONE: Dev server script, use 'npm run build' for production -->\n 
  <script>
  try { 
    if (!window.KEYSTONE_DEV_SCRIPT && window.location.port === '${config.port}') {
      window.KEYSTONE_DEV_SCRIPT = true
      ;(function () {
        const blueText = 'color: #4086DB; font-weight: bold;'
        const greenText = 'color: #019952;'
        let alreadyClosed = false
        startListen()
        function startListen () {
          const wsUri = "ws://${config.devServerIp}:${config.portWs}/"
          const ws = new WebSocket(wsUri)
          let serverOpen = false
          let justOpened = true
          ws.onopen = function (message) {
            console.log('%c[KEYSTONE] %cDevelopment server started', blueText, greenText)
            serverOpen = true
            justOpened = false
            if (alreadyClosed) {
              location.reload()
            }
          }
          ws.onmessage = function (message) {
            console.log('Message received:', message.data)
            if (message.data === 'refresh') {
              location.reload()
            }
          }
          ws.onerror = function (message) {
            if (!justOpened) {
              console.error('%c[KEYSTONE]', blueText, 'Development server closed')
            }
          }
          ws.onclose = function (message) {
            if (serverOpen === true) {
              
              alreadyClosed = true
            }
            serverOpen = false
            setTimeout(startListen, ${config.disconnectReloadTime})
          }
        }
      })()
    }
  } catch (err) { console.log(err) }
  </script>
`
