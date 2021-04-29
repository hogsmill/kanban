const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const port = prod ? process.env.VUE_APP_PORT : 3007
const logFile = prod ? process.argv[4] : 'server.log'
const gameCollection =  prod ? process.env.VUE_APP_COLLECTION : 'kanbam'
const gamesCollection =  prod ? process.env.VUE_APP_GAME_COLLECTION : 'kanbanGames'

const currentAction = ''
const currentData = ''
ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (currentAction) {
    logStr = logStr + '  Action: ' + currentAction + '\n'
  }
  if (currentData) {
    logStr = logStr + '  Data: ' + currentData + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  Error: ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const dbStore = require('./store/dbStore.js')
const statistics = require('./store/statistics.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const maxIdleTime = 7200000
const connectDebugOff = prod
const debugOn = !prod

const connections = {}
const maxConnections = 2000

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, function (err, client) {
  if (err) throw err
  const db = client.db('db')

  db.createCollection(gameCollection, function(error, collection) {})
  db.createCollection(gamesCollection, function(error, collection) {})

  db.gameCollection = db.collection(gameCollection)
  db.gamesCollection = db.collection(gamesCollection)

  io.on('connection', (socket) => {
    const connection = socket.handshake.headers.host
    connections[connection] = connections[connection] ? connections[connection] + 1 : 1
    if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
      console.log(`Too many connections. Socket ${socket.id} closed`)
      socket.disconnect(0)
    } else {
      connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    }

    socket.on('disconnect', () => {
      const connection = socket.handshake.headers.host
      connections[connection] = connections[connection] - 1
      connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
      emit('updateConnections', {connections: connections, maxConnections: maxConnections})
    })

    socket.on('sendGetAvailableGames', (data) => { dbStore.getAvailableGames(db, io, data, debugOn) })

    socket.on('sendLoadGame', (data) => { dbStore.loadGame(db, io, data, debugOn) })

    socket.on('sendRestartGame', (data) => { dbStore.restartGame(db, io, data, debugOn) })

    socket.on('sendDeleteGame', (data) => {
      dbStore.deleteGameMeta(db, io, data, debugOn)
      dbStore.deleteGame(db, io, data, debugOn)
    })

    socket.on('sendShowEventCard', (data) => { emit('showEventCard', data) })

    socket.on('sendUpdateCurrentDay', (data) => { dbStore.updateCurrentDay(db, io, data, debugOn) })

    socket.on('sendPullInCard', (data) => { dbStore.pullInCard(db, io, data, debugOn) })

    socket.on('sendSetColumnWip', (data) => { dbStore.setColumnWip(db, io, data, debugOn) })

    socket.on('sendUpdatePersonEffort', (data) => { emit('updatePersonEffort', data) })

    socket.on('sendUpdatePersonAutoDeployEffort', (data) => { emit('updatePersonAutoDeployEffort', data) })

    socket.on('sendUpdateEffort', (data) => { dbStore.updateEffort(db, io, data, debugOn) })

    socket.on('sendMoveCardToNextColumnError', (data) => { emit('moveCardToNextColumnError', data) })

    socket.on('sendMoveCardToNextColumn', (data) => { dbStore.moveCardToNextColumn(db, io, data, debugOn) })

    socket.on('sendPairingDay', (data) => { dbStore.pairingDay(db, io, data, debugOn) })

    socket.on('sendAddEffortToOthersCard', (data) => { dbStore.addEffortToOthersCard(db, io, data, debugOn) })

    socket.on('sendUpdateOtherTeamEffort', (data) => { emit('updateOtherTeamEffort', data) })

    socket.on('sendStartAutoDeploy', (data) => { dbStore.startAutoDeploy(db, io, data, debugOn) })

    socket.on('sendIncrementAutoDeploy', (data) => { dbStore.incrementAutoDeploy(db, io, data, debugOn) })

    // statistics

    socket.on('sendUpdateStatistic', (data) => { statistics.updateStatistic(db, io, data, debugOn) })

    // Facilitator View

    socket.on('sendBroadcastMessage', (data) => { emit('broadcastMessage', data) })

    socket.on('sendUpdateTeamActive', (data) => { dbStore.updateTeamActive(db, io, data, debugOn) })

    socket.on('sendUpdateStealth', (data) => { dbStore.setGameParamater(db, io, data, 'stealth', debugOn) })

    socket.on('sendUpdateWipLimitType', (data) => { dbStore.setGameParamater(db, io, data, 'wipLimitType', debugOn) })

    socket.on('sendUpdateWipLimits', (data) => { dbStore.setGameParamater(db, io, data, 'wipLimits', debugOn) })

    socket.on('sendUpdateSplitColumns', (data) => { dbStore.setGameParamater(db, io, data, 'splitColumns', debugOn) })

    socket.on('sendUpdateIncludeColumn', (data) => { dbStore.updateIncludeColumn(db, io, data, debugOn) })

    socket.on('sendUpdateGameInclude', (data) => { dbStore.updateGameInclude(db, io, data, debugOn) })

    socket.on('sendMoveColumnUp', (data) => {dbStore.moveColumnUp(db, io, data, debugOn) })

    socket.on('sendMoveColumnDown', (data) => { dbStore.moveColumnDown(db, io, data, debugOn) })

    socket.on('sendAddColumn', (data) => { dbStore.addColumn(db, io, data, debugOn) })

    socket.on('sendDeleteColumn', (data) => { dbStore.deleteColumn(db, io, data, debugOn) })

    socket.on('sendGetGames', (data) => { dbStore.getGames(db, io, data, debugOn) })

    socket.on('sendGetGameDetails', (data) => { dbStore.getGameDetails(db, io, data, debugOn) })

    // Game State

    socket.on('sendGameState', (data) => { dbStore.gameState(db, io, data, debugOn) })
  })
})

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
