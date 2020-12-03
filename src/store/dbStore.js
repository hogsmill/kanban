
const teamFuns = require('./lib/teams.js')
const cardFuns = require('./lib/cards.js')
const columnFuns = require('./lib/columns.js')
const pairingFuns = require('./lib/pairing.js')
const dependent = require('./lib/dependent.js')
const gameState = require('./lib/gameState.js')

const initialTeams = [
  { name: 'Blue', include: true },
  { name: 'Green', include: true },
  { name: 'Purple', include: true },
  { name: 'Red', include: true },
  { name: 'Orange', include: false },
  { name: 'Black', include: false },
  { name: 'Grey', include: false },
  { name: 'Brown', include: false },
  { name: 'Magenta', include: false },
  { name: 'Salmon', include: false },
  { name: 'Teal', include: false }
]

const initialColumns = [
  {name: 'design', order: 1, include: true, wipLimit: 0, cards: []},
  {name: 'develop', order: 2, include: true, wipLimit: 0, cards: []},
  {name: 'test', order: 3, include: true, wipLimit: 0, cards: []},
  {name: 'deploy', order: 4, include: true, wipLimit: 0, cards: []},
  {name: 'done', order: 5, include: true, wipLimit: 0, cards: []}
]

const initialCards = [
  {number: 1, design: 6, develop: 7, test: 8, deploy: 2, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 2, design: 0, develop: 8, test: 6, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 3, design: 10, develop: 9, test: 9, deploy: 3, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 4, design: 4, develop: 9, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 5, design: 4, develop: 10, test: 5, deploy: 2, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 6, design: 1, develop: 8, test: 2, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 7, design: 1, develop: 10, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 8, design: 0, develop: 4, test: 3, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 9, design: 10, develop: 4, test: 10, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 10, design: 1, develop: 7, test: 10, deploy: 8, urgent: true, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 11, design: 8, develop: 10, test: 10, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 12, design: 3, develop: 8, test: 11, deploy: 3, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 13, design: 0, develop: 6, test: 9, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 14, design: 1, develop: 6, test: 3, deploy: 1, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 15, design: 10, develop: 1, test: 5, deploy: 2, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 16, design: 2, develop: 5, test: 1, deploy: 5, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 17, design: 3, develop: 6, test: 8, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 18, design: 0, develop: 7, test: 12, deploy: 3, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 19, design: 5, develop: 9, test: 4, deploy: 7, urgent: true, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 20, design: 8, develop: 8, test: 3, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 21, design: 1, develop: 6, test: 5, deploy: 1, urgent: false, teamDependency: 4, dependencyDone: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 22, design: 0, develop: 10, test: 7, deploy: 7, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 23, design: 5, develop: 10, test: 11, deploy: 8, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 24, design: 0, develop: 6, test: 4, deploy: 6, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}},
  {number: 25, design: 3, develop: 2, test: 2, deploy: 4, urgent: false, teamDependency: 0, dependentOn: '', commit: 0, blocked: false, effort: {design: 0, develop: 0, test: 0, deploy: 0}, workedOn: {}}
]

function resetGame(game) {
  game.columns = JSON.parse(JSON.stringify(initialColumns))
  game.workCards = JSON.parse(JSON.stringify(initialCards))
  game.otherCards = []
  game.pairing = []
  game.daysEffort = []
  game.autoDeploy = {
    doing: false,
    effort: 0,
    done: false
  }
  game.canStartAutoDeploy = false
  game.currentDay = 1
  game.currentWorkCard = 0
  game.projectEstimate = null
  game.projectActual = null
  game.reEstimate = null
  const members = []
  for (let i = 0; i < game.members.length; i++) {
    const member = game.members[i]
    member.effort = teamFuns.initialEffort()
    member.otherRoles = []
    members.push(member)
  }
  game.members = members

  return game
}

function newGame(data) {
  const game = {
    gameName: data.gameName,
    include: false,
    teams: JSON.parse(JSON.stringify(initialTeams)),
    stealth: false,
    wipLimits: true,
    created: new Date().toISOString(),
    restarted: [],
    lastaccess: new Date().toISOString()
  }

  return game
}

function newTeam(gameName, teamName) {
  const team = {
    gameName: gameName,
    teamName: teamName,
    members: [],
    columns: JSON.parse(JSON.stringify(initialColumns)),
    workCards: JSON.parse(JSON.stringify(initialCards)),
    pairing: [],
    recharting: false,
    otherCards: [],
    canStartAutoDeploy: false,
    daysEffort: [],
    currentDay: 1,
    currentWorkCard: 0,
    projectEstimate: null,
    projectActual: null,
    reEstimate: null,
    autoDeploy: {
      doing: false,
      effort: 0,
      done: false
    }
  }
  return team
}

function _getGames(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('getGames') }

  db.collection('kanbanGames').find().toArray(function(err, res) {
    if (err) throw err
    if (res.length) {
      delete res._id
      io.emit('updateGames', res)
    }
  })
}

function updateTeam(db, io, res) {
  const id = res._id
  delete res._id
  db.collection('kanban').updateOne({'_id': id}, {$set: res}, function(err) {
    if (err) throw err
    io.emit('loadTeam', res)
    gameState.update(db, io, res)
  })
}

module.exports = {

  gameState: function(err, client, db, io, data, debugOn) {
    gameState.update(db, io, data)
  },

  getGameDetails: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('getGameDetails', data) }

    db.collection('kanban').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        const hosts = []
        for (let r = 0; r < res.length; r++) {
          for (let i = 0; i < res[r].members.length; i++) {
            if (res[r].members[i].host) {
              hosts.push(res[r].members[i].name)
            }
          }
        }
        details = {
          hosts: hosts
        }
        io.emit('updateGameDetails', { gameName: data.gameName, details : details})
      }
    })
  },

  getGames: function(err, client, db, io, data, debugOn) {
    _getGames(err, client, db, io, data, debugOn)
  },

  getAvailableGames: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('getAvailableGames', data) }

  },

  loadGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    db.collection('kanbanGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        db.collection('kanbanGames').updateOne({'_id': res._id}, {$set: {lastaccess: new Date().toISOString()} }, function(err) {
          if (err) throw err
        })
        console.log('Loading game \'' + data.gameName + '\'')
        io.emit('loadGame', res)
        if (data.oldTeam) {
          db.collection('kanban').findOne({gameName: data.gameName, teamName: data.oldTeam}, function(err, resOld) {
            if (err) throw err
            resOld.members = teamFuns.removeMember(resOld.members, data.myName)
            updateTeam(db, io, resOld)
          })
        }
        db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
          if (err) throw err
          if (res) {
            res.members = teamFuns.addMember(res.members, data.myName, data.myRole)
            updateTeam(db, io, res)
          }
        })
      } else {
        console.log('Created new game \'' + data.gameName + '\'')
        const game = newGame(data)
        db.collection('kanbanGames').insertOne(game, function(err) {
          if (err) throw err
          io.emit('loadGame', game)
          gameState.update(db, io, data)
        })
        for (let i = 0; i < initialTeams.length; i++) {
          const teamName = initialTeams[i].name
          const team = newTeam(data.gameName, teamName)
          if (teamName == data.teamName) {
            team.members = teamFuns.addMember(team.members, data.myName, data.myRole)
          }
          db.collection('kanban').insertOne(team, function(err) {
            if (err) throw err
            io.emit('loadTeam', team)
            gameState.update(db, io, data)
          })
        }
      }
    })
  },

  restartGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.collection('kanbanGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const restarted = res.restarted
        restarted.push(new Date().toISOString())
        res.restarted = restarted
        db.collection('kanbanGames').updateOne({'_id': res._id}, {$set: {restarted: restarted} }, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })

    db.collection('kanban').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          const game = resetGame(res[r])
          const id = game._id
          delete game._id
          db.collection('kanban').updateOne({'_id': id}, {$set: game}, function(err) {
            if (err) throw err
            io.emit('loadTeam', game)
            gameState.update(db, io, game)
          })
        }
      }
    })
  },

  deleteGameMeta: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGameMeta', data) }

    db.collection('kanbanGames').findOne({name: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        db.collection('kanbanGames').deleteOne({'_id': res._id}, function(err, res) {
          if (err) throw err
          _getGames(err, client, db, io, data, debugOn)
        })
      }
    })
  },

  deleteGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('deleteGame', data) }

    db.collection('kanban').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let i = 0; i < res.length; i++) {
          db.collection('kanban').deleteOne({'_id': res[i]._id}, function(err, res) {
            if (err) throw err
          })
        }
      }
    })
  },

  updateCurrentDay: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateCurrentDay', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        let updating = false
        if (res.currentDay != data.currentDay) {
          updating = true
          currentDay = res.currentDay + 1
          res = teamFuns.updateTeamCapabilities(res, data, res.daysEffort)
          const columns = res.columns, workCards = res.workCards
          for (let i = 0; i < columns.length; i++) {
            for (let j = 0; j < columns[i].cards.length; j++) {
              const card = columns[i].cards[j]
              const colName = columns[i].name
              if (card.blocked || card.failed) {
                card.blocked = false
                card.failed = false
                if (cardFuns.cardCompleteInColumn(card, colName, res.teamName, res.autoDeploy)) {
                  cardFuns.moveCard(columns, workCards, card, i, res.currentDay)
                }
              }
            }
          }
          actuals = cardFuns.calculateActuals(columns, res.workCards, data.currentDay, res.projectActual)
          mvpActual = actuals.mvpActual
          projectActual = actuals.projectActual
          members = teamFuns.setTeamMembersEffort(res.members, data)
          res.currentDay = currentDay
          res.members = members
          res.columns = columns
          res.workCards = workCards
          res.mvpActual = mvpActual
          res.projectActual = projectActual
        }
        const id = res._id
        delete res._id
        io.emit('loadTeam', res)
        gameState.update(db, io, res)
        if (updating) {
          db.collection('kanban').updateOne({'_id': id}, {$set: res}, function() {
            if (err) throw err
          })
        }
      }
    })
  },

  pullInCard: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('pullInCard', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.currentWorkCard = res.currentWorkCard + 1
        res.columns = cardFuns.pullInCard(res.columns, res.workCards, res.currentWorkCard, res.currentDay, data.teams, data.teamName)
        updateTeam(db, io, res)
        const card = res.workCards.find(function(c) {
          return c.number == res.currentWorkCard
        })
        if (card.dependentOn) {
          db.collection('kanban').findOne({gameName: data.gameName, teamName: card.dependentOn.name}, function(err, depRes) {
            if (err) throw err
            if (depRes) {
              const depCard = depRes.workCards.find(function(c) {
                return c.number == res.currentWorkCard
              })
              depCard.team = data.teamName
              depRes.otherCards.push(depCard)
              updateTeam(db, io, depRes)
            }
          })
        }
      }
    })
  },

  setColumnWip: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setColumnWip', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const columns = []
        for (let i = 0; i < res.columns.length; i++) {
          const column = res.columns[i]
          if (column.name == data.column) {
            column.wipLimit = parseInt(data.wipLimit)
          }
          columns.push(column)
        }
        res.columns = columns
        const id = res._id
        delete res._id
        db.collection('kanban').updateOne({'_id': id}, {$set: res}, function() {
          if (err) throw err
          updateTeam(db, io, res)
          gameState.update(db, io, res)
        })
      }
    })
  },

  updateEffort: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateEffort', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.members = teamFuns.decrementMyEffort(res.members, data.name, data.effort)
        const columns = res.columns, workCards = res.workCards
        let todaysEffort = []
        for (let i = 0; i < columns.length; i++) {
          for (let j = 0; j < columns[i].cards.length; j++) {
            if (columns[i].cards[j].number == data.workCard.number) {
              todaysEffort = pairingFuns.updateTodaysEffort(res, columns[i], data.workCard, data.name)
              let card = columns[i].cards[j]
              const colName = columns[i].name
              card.effort = data.workCard.effort
              card = cardFuns.addWorkedOn(card, data.column, data.name, data.role)
              if (cardFuns.cardCompleteInColumn(card, colName, res.teamName, res.autoDeploy, res.percentageBlocked, res.percentageDeployFail)) {
                cardFuns.moveCard(columns, workCards, card, i, res.currentDay)
              }
            }
          }
        }
        res.daysEffort = todaysEffort
        res.columns = columns
        res.workCards = workCards
        updateTeam(db, io, res)
      }
    })
  },

  pairingDay: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('pairingDay', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        let i, player
        const pairing = [], members = res.members
        for (i = 0; i < res.pairing.length; i++) {
          if (res.pairing[i].name.id == data.name.id) {
            player = res.pairing[i]
          } else {
            pairing.push(res.pairing[i])
          }
        }
        if (!player) {
          player = {name: data.name, columns: [{column: data.column, days: [data.day]}]}
        } else {
          let column
          for (i = 0; i < player.columns.length; i++) {
            if (player.columns[i].column == data.column) {
              column = player.columns[i]
            }
          }
          if (!column) {
            player.columns.push({column: data.column, days: [data.day]})
          } else {
            let dayDone = false
            for (i = 0; i < column.days.length; i++) {
              if (column.days[i] == data.day) {
                dayDone = true
              }
            }
            if (!dayDone) {
              column.days.push(data.day)
            }
            if (column.days.length >= 5) {
              res.members = pairingFuns.addSecondarySkill(res.members, column.column, data.name)
            }
            const columns = []
            for (i = 0; i < player.columns.length; i++) {
              if (player.columns[i].column == data.column) {
                columns.push(column)
              } else {
                columns.push(player.columns[i])
              }
            }
            player.columns = columns
          }
        }
        pairing.push(player)
        res.pairing = pairing
        updateTeam(db, io, res)
      }
    })
  },

  addEffortToOthersCard: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addEffortToOthersCard', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.card.team}, function(err, otherRes) {
      if (err) throw err
      if (otherRes) {
        otherRes.columns = dependent.addDependentEffort(otherRes.columns, data.card, data.effort)
        updateTeam(db, io, otherRes)
      }
    })

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.otherCards = dependent.addOtherCardEffort(res.otherCards, data.card, data.effort)
        res.members = teamFuns.decrementMyEffort(res.members, data.myName, data.effort)
        updateTeam(db, io, res)
      }
    })
  },

  startAutoDeploy: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('startAutoDeploy', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.autoDeploy.doing = true
        updateTeam(db, io, res)
      }
    })
  },

  incrementAutoDeploy: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('incrementAutoDeploy', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const autoDeploy = res.autoDeploy
        autoDeploy.effort = autoDeploy.effort + 1
        if (autoDeploy.effort >= 8) {
          autoDeploy.doing = false
          autoDeploy.done = true
        }
        res.autoDeploy = autoDeploy
        res.members = teamFuns.decrementMyEffort(res.members, data.name, data.effort)
        updateTeam(db, io, res)
      }
    })
  },

  updateProjectEstimate: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateProjectEstimate', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.projectEstimate = data.projectEstimate
        updateTeam(db, io, res)
      }
    })
  },

  updateReEstimate: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateReEstimate', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.reEstimate = data.reEstimate
        updateTeam(db, io, res)
      }
    })
  },

  updateTeamActive: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateTeamActive', data) }

    db.collection('kanbanGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team.include = data.include
          }
          teams.push(team)
        }
        res.teams = teams
        const id = res._id
        delete res._id
        db.collection('kanbanGames').updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
          gameState.update(db, io, res)
        })
      }
    })
  },

  updateGameInclude: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateGameInclude', data) }

    db.collection('kanbanGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.include = data.include
        const id = res._id
        delete res._id
        db.collection('kanbanGames').updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          _getGames(err, client, db, io, data, debugOn)
        })
      }
    })
  },

  updateStealth: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateStealth', data) }

    db.collection('kanbanGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const id = res._id
        delete res._id
        res.stealth = data.stealth
        db.collection('kanbanGames').updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  },

  updateWipLimits: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateWipLimits', data) }

    db.collection('kanbanGames').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const id = res._id
        delete res._id
        res.wipLimits = data.wipLimits
        db.collection('kanbanGames').updateOne({'_id': id}, {$set: res}, function(err) {
          if (err) throw err
          io.emit('loadGame', res)
        })
      }
    })
  },

  updateIncludeColumn: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateIncludeColumn', data) }

    db.collection('kanban').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          res[r].columns = columnFuns.includeColumn(res[r].columns, data.colum.name, data.include)
          const id = res[r]._id
          delete res[r]._id
          db.collection('kanban').updateOne({'_id': id}, {$set: res[r]}, function(err) {
            if (err) throw err
            io.emit('loadTeam', res[r])
          })
        }
      }
    })
  },

  moveColumnUp: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('moveColumnUp', data) }

    db.collection('kanban').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          const col = res[r].columns.find(function(c) {
            return c.name == data.column.name
          })
          const colNumber = col.order
          const otherColNumber = col.order - 1
          const otherCol = res[r].columns.find(function(c) {
            return c.order == otherColNumber
          })
          const columns = []
          for (let i = 0; i < res[r].columns.length; i++) {
            const column = res[r].columns[i]
            if (column.name == col.name) {
              column.order = otherColNumber
            }
            if (column.name == otherCol.name) {
              column.order = colNumber
            }
            columns.push(column)
          }
          res[r].columns = columns
          const id = res[r]._id
          delete res[r]._id
          db.collection('kanban').updateOne({'_id': id}, {$set: res[r]}, function(err) {
            if (err) throw err
            io.emit('loadTeam', res[r])
          })
        }
      }
    })
  },

  moveColumnDown: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('moveColumnDown', data) }

    db.collection('kanban').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          const col = res[r].columns.find(function(c) {
            return c.name == data.column.name
          })
          const colNumber = col.order
          const otherColNumber = col.order + 1
          const otherCol = res[r].columns.find(function(c) {
            return c.order == otherColNumber
          })
          const columns = []
          for (let i = 0; i < res[r].columns.length; i++) {
            const column = res[r].columns[i]
            if (column.name == col.name) {
              column.order = otherColNumber
            }
            if (column.name == otherCol.name) {
              column.order = colNumber
            }
            columns.push(column)
          }
          res[r].columns = columns
          const id = res[r]._id
          delete res[r]._id
          db.collection('kanban').updateOne({'_id': id}, {$set: res[r]}, function(err) {
            if (err) throw err
            io.emit('loadTeam', res[r])
          })
        }
      }
    })
  },

  addColumn: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addColumn', data) }

    db.collection('kanban').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          res[r].columns = columnFuns.addColumn(res[r].columns, data.column)
          const id = res[r]._id
          delete res[r]._id
          db.collection('kanban').updateOne({'_id': id}, {$set: res[r]}, function(err) {
            if (err) throw err
            io.emit('loadTeam', res[r])
          })
        }
      }
    })
  },

  deleteColumn: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('deleteColumn', data) }

    db.collection('kanban').find({gameName: data.gameName}).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let r = 0; r < res.length; r++) {
          res[r].columns = columnFuns.deleteColumn(res[r].columns, data.column.name)
          const id = res[r]._id
          delete res[r]._id
          db.collection('kanban').updateOne({'_id': id}, {$set: res[r]}, function(err) {
            if (err) throw err
            io.emit('loadTeam', res[r])
          })
        }
      }
    })
  }

}
