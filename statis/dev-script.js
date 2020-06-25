const config = require('./config.js')

module.exports = `
  <!-- STATIS: Dev server script, run without --dev variable for production -->\n 
  <script>
  try { 
    if (!window.STATIS_DEV_SCRIPT && window.location.port === '${config.port}') {
      window.STATIS_DEV_SCRIPT = true
      ;(function () {
        startListen()
        function startListen () {
          const wsUri = "ws://localhost:${config.portWs}/"
          const ws = new WebSocket(wsUri)
          let serverOpen = false
          ws.onopen = message => {
            console.log('STATIS: Development server started')
            serverOpen = true
          }
          ws.onmessage = message => {
            console.log('Message received:', message.data)
            if (message.data === 'refresh') {
              location.reload()
            }
          }
          ws.onerror = message => {
            console.log('STATIS: Error:', message)
          }
          ws.onclose = message => {
            if (serverOpen == true) { 
              console.error('STATIS: Development server closed')
            }
            serverOpen = false
            setTimeout(startListen, ${config.disconnectReloadTime})
          }
        }
      })()
    }
  } catch (err) { }
  </script>
`
