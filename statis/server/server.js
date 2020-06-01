const config = require('../config.js')
const serverLog = require('../server-log.js')
const express = require('express')
const app = express()

const WebSocket = require('ws')
let wss

module.exports = class Server {
  constructor (port = config.port, portWs = config.portWs) {
    this.port = port
    this.portWs = portWs
    this.server = undefined
    this.users = []
    this.start()
    if (config.watch) {
      this.startWss()
    }
  }

  start () {
    if (!this.server) {
      app.disable('etag')
      app.use(express.static(config.served, {
        etag: false,
        maxAge: -1,
        setHeaders: (res, path, stat) => {
          res.set('Cache-Control', 'no-store')
          res.set('Expires', '-1')
        }
      }), (req, res, next) => {
        next()
      })
      this.server = app.listen(this.port, () => serverLog.serverRunning(this.port))
    }
  }

  startWss () {
    wss = new WebSocket.Server({ port: this.portWs })
    wss.on('connection', ws => {
      this.users.push(ws)
      ws.on('message', message => {
        console.log('Message:', message)
      })
    })
  }

  stop () {
    if (this.server) {
      this.server.close()
      this.server = undefined
    }
  }

  reload () {
    this.refresh()
    this.stop()
    this.start()
  }

  refresh () {
    if (config.watch) {
      wss.clients.forEach(function each (client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send('refresh')
        }
      })
    }
  }
}
