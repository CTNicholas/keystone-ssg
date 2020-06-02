const config = require('./config.js')

const old = '<!-- STATIS: Dev server script, run without --dev variable for production -->\n<script>!function(){!function e(){const o=new WebSocket("ws://localhost:' +
config.portWs + '/");let s=!1;o.onopen=(e=>{console.log("STATIS: Development server started"),s=!0});o.onmessage=(e=>{console.log("Message received:",e.data),"refresh"===e.data&&location.reload()});o.onclose=(o=>{1==s&&console.error("STATIS: Development server closed"),s=!1,setTimeout(e,' + 
config.disconnectReloadTime + ')})}()}();</script>\n'

module.exports = `<!-- STATIS: Dev server script, run without --dev variable for production -->\n
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
