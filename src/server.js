const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const logFile = prod ? process.argv[4] : 'server.log'

let currentAction = ''
let currentData = ''
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

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:*", "http://agilesimulations.co.uk"],
    methods: ["GET", "POST"],
    credentials: true
  }
})

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

function doDb(fun, data) {
  currentAction = fun
  currentData = data
  MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, function (err, client) {
    if (err) throw err
    const db = client.db('db')

    switch(fun) {
      case 'getAvailableGames':
        dbStore.getAvailableGames(db, io, data, debugOn)
        break
      case 'loadGame':
        dbStore.loadGame(db, io, data, debugOn)
        break
      case 'restartGame':
        dbStore.restartGame(db, io, data, debugOn)
        break
      case 'deleteGameMeta':
        dbStore.deleteGameMeta(db, io, data, debugOn)
        break
      case 'deleteGame':
        dbStore.deleteGame(db, io, data, debugOn)
        break
      case 'updateCurrentDay':
        dbStore.updateCurrentDay(db, io, data, debugOn)
        break
      case 'pullInCard':
        dbStore.pullInCard(db, io, data, debugOn)
        break
      case 'setColumnWip':
        dbStore.setColumnWip(db, io, data, debugOn)
        break
      case 'updateEffort':
        dbStore.updateEffort(db, io, data, debugOn)
        break
      case 'moveCardToNextColumn':
        dbStore.moveCardToNextColumn(db, io, data, debugOn)
        break
      case 'addEffortToOthersCard':
        dbStore.addEffortToOthersCard(db, io, data, debugOn)
        break
      case 'incrementAutoDeploy':
        dbStore.incrementAutoDeploy(db, io, data, debugOn)
        break
      case 'startAutoDeploy':
        dbStore.startAutoDeploy(db, io, data, debugOn)
        break
      case 'updateProjectEstimate':
        dbStore.updateProjectEstimate(db, io, data, debugOn)
        break
      case 'updateMVPEstimate':
        dbStore.updateMVPEstimate(db, io, data, debugOn)
        break
      case 'updateReEstimate':
        dbStore.updateReEstimate(db, io, data, debugOn)
        break
      case 'pairingDay':
        dbStore.pairingDay(db, io, data, debugOn)
        break

      // Statistics

      case 'updateStatistic':
        statistics.updateStatistic(db, io, data, debugOn)
        break

      // Facilitator
      //
      case 'updateTeamActive':
        dbStore.updateTeamActive(db, io, data, debugOn)
        break
      case 'updateGameInclude':
        dbStore.updateGameInclude(db, io, data, debugOn)
        break
      case 'updateWipLimits':
        dbStore.setGameParamater(db, io, data, 'wipLimits', debugOn)
        break
      case 'updateWipLimitType':
        dbStore.setGameParamater(db, io, data, 'wipLimitType', debugOn)
        break
      case 'updateStealth':
        dbStore.setGameParamater(db, io, data, 'stealth', debugOn)
        break
      case 'updateSplitColumns':
        dbStore.setGameParamater(db, io, data, 'splitColumns', debugOn)
        break
      case 'updateIncludeColumn':
        dbStore.updateIncludeColumn(db, io, data, debugOn)
        break
      case 'moveColumnUp':
        dbStore.moveColumnUp(db, io, data, debugOn)
        break
      case 'moveColumnDown':
        dbStore.moveColumnDown(db, io, data, debugOn)
        break
      case 'addColumn':
        dbStore.addColumn(db, io, data, debugOn)
        break
      case 'deleteColumn':
        dbStore.deleteColumn(db, io, data, debugOn)
        break

     // Game State
     //
     case 'gameState':
       dbStore.gameState(db, io, data, debugOn)
       break
    case 'getGames':
      dbStore.getGames(db, io, data, debugOn)
      break
    case 'getGameDetails':
      dbStore.getGameDetails(db, io, data, debugOn)
      break

      default:
        console.log('Unknown function: \'' + fun + '\'')
    }
  })
}

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

  socket.on('getAvailableGames', (data) => { doDb('getAvailableGames', data) })

  socket.on('loadGame', (data) => { doDb('loadGame', data) })

  socket.on('restartGame', (data) => { doDb('restartGame', data) })

  socket.on('deleteGame', (data) => {
    doDb('deleteGameMeta', data)
    doDb('deleteGame', data)
  })

  socket.on('showEventCard', (data) => { emit('showEventCard', data) })

  socket.on('updateCurrentDay', (data) => { doDb('updateCurrentDay', data) })

  socket.on('pullInCard', (data) => { doDb('pullInCard', data) })

  socket.on('setColumnWip', (data) => { doDb('setColumnWip', data) })

  socket.on('updatePersonEffort', (data) => { emit('updatePersonEffort', data) })

  socket.on('updatePersonAutoDeployEffort', (data) => { emit('updatePersonAutoDeployEffort', data) })

  socket.on('updateEffort', (data) => { doDb('updateEffort', data) })

  socket.on('moveCardToNextColumnError', (data) => { emit('moveCardToNextColumnError', data) })

  socket.on('moveCardToNextColumn', (data) => { doDb('moveCardToNextColumn', data) })

  socket.on('pairingDay', (data) => { doDb('pairingDay', data) })

  socket.on('resetEffort', (data) => { emit('resetEffort', data) })

  socket.on('addEffortToOthersCard', (data) => { doDb('addEffortToOthersCard', data) })

  socket.on('updateOtherTeamEffort', (data) => { emit('updateOtherTeamEffort', data) })

  socket.on('startAutoDeploy', (data) => { doDb('startAutoDeploy', data) })

  socket.on('incrementAutoDeploy', (data) => { doDb('incrementAutoDeploy', data) })

  // statistics

  socket.on('updateStatistic', (data) => { doDb('updateStatistic', data) })

  // Facilitator View

  socket.on('broadcastMessage', (data) => { emit('broadcastMessage', data) })

  socket.on('updateTeamActive', (data) => { doDb('updateTeamActive', data) })

  socket.on('updateStealth', (data) => { doDb('updateStealth', data) })

  socket.on('updateWipLimits', (data) => { doDb('updateWipLimits', data) })

  socket.on('updateWipLimitType', (data) => { doDb('updateWipLimitType', data) })

  socket.on('updateWipLimits', (data) => { doDb('updateWipLimits', data) })

  socket.on('updateSplitColumns', (data) => { doDb('updateSplitColumns', data) })

  socket.on('updateGameInclude', (data) => { doDb('updateGameInclude', data) })

  socket.on('moveColumnUp', (data) => { doDb('moveColumnUp', data) })

  socket.on('moveColumnDown', (data) => { doDb('moveColumnDown', data) })

  socket.on('addColumn', (data) => { doDb('addColumn', data) })

  socket.on('deleteColumn', (data) => { doDb('deleteColumn', data) })

  socket.on('getGames', (data) => { doDb('getGames', data) })

  socket.on('getGameDetails', (data) => { doDb('getGameDetails', data) })

  // Game State

  socket.on('gameState', (data) => { doDb('gameState', data) })
})

const port = process.argv[2] || 3014

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
