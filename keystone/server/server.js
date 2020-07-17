const config = require('../config.js')
const state = require('../state.js')
const serverLog = require('./log-server.js')
const logError = require('./log-error.js')
const express = require('express')
const app = express()

const WebSocket = require('ws')
const logError = require('./log-error.js')
let wss

module.exports = class Server {
  constructor (port = config.port, portWs = config.portWs) {
    this.port = port
    this.portWs = portWs
    this.server = undefined
    this.userCount = 0
    this.start().then(() => {
      if (config.watch) {
        this.startWss()
      }
    })
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

      app.use(function (req, res) {
        res.status(404).send(require('./error-page.js'))
      })

      return new Promise((resolve, reject) => {
        this.server = app.listen(this.port, () => {
          serverLog.serverRunning(this.port)
          this.refresh()
          resolve()
        })
      }).catch(logError)
    }
    return new Promise((resolve, reject) => {
      reject(new Error('No server'))
    })
  }

  error () {
    console.log('Server error')
    // TODO
  }

  startWss () {
    wss = new WebSocket.Server({ port: this.portWs })
    wss.on('connection', ws => {
      this.isAlive = true
      ws.on('pong', function () {
        this.isAlive = true
      })

      this.updateUsers()

      // console.log('User connected', ++this.userCount)
      ws.on('message', message => {
        console.log('Message:', message)
      })

      ws.on('close', () => {
        // console.log('Disconnected', --this.userCount)
      })
    })
  }

  updateUsers () {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        // console.log('Terminate connection', --this.userCount)
        return ws.terminate()
      }
      ws.isAlive = false
      ws.ping()
    })
  }

  stop () {
    if (this.server) {
      this.server.close()
      this.server = undefined
    }
  }

  reload () {
    this.stop()
    return this.start()
  }

  refresh () {
    if (!state.error && config.watch && wss) {
      wss.clients.forEach(function each (client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send('refresh')
        }
      })
    }
  }
}
