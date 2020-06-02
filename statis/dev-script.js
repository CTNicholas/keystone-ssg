const config = require('./config.js')

module.exports = `
<script>
  (function () {
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
      ws.onclose = message => {
        if (serverOpen == true) { 
          console.error('STATIS: Development server closed')
        }
        serverOpen = false
        setTimeout(startListen, ${config.disconnectReloadTime})
      }
    }
  })()
</script>
`
