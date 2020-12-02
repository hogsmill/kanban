import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    thisGame: 'No Estimates',
    connections: 0,
    walkThrough: false,
    showFacilitator: false,
    host: false,
    stealth: false,
    currency: '&#163;',
    gameName: '',
    members: [],
    myName: {id: '', name: '', captain: false, host: false},
    myRole: '',
    teamName: '',
    teams: [
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
    ],
    pairing: [],
    message: '',
    roles: [
      'Designer',
      'Developer',
      'Tester',
      'Deployer'
    ],
    columns: [
      {name: 'design', order: 1, include: true, wipLimit: 0, cards: []},
      {name: 'develop', order: 2, include: true, wipLimit: 0, cards: []},
      {name: 'test', order: 3, include: true, wipLimit: 0, cards: []},
      {name: 'deploy', order: 4, include: true, wipLimit: 0, cards: []},
      {name: 'done', order: 5, include: true, wipLimit: 0, cards: []}
    ],
    wipLimits: true,
    currentDay: 1,
    eventCards: [
      {number: 1, text: 'Good Luck!<br/><br/>. Have you submitted an initial estimate for the project?<br/><br/>If not, click \'Report\' or \'Set Estimates\' and create your estimate now.'},
      {number: 2, text: 'Remember that manual deployments will fail a certain percentage of the time. In this case, you will need to re-do the deployment effort.'},
      {number: 3, function: 'Add 1 Point To Everyones Capacity', text: 'Pizza inspires your team to greatness! Add one to each person\'s capacity tomorrow.'},
      {number: 4, text: 'Did you remember that people can work in areas outside their speciality? They require two effort points to make one effort point in another area.'},
      {number: 5, function: 'Add 8 points to Deploy', confirm: true, autoDeployCard: true, text: 'You read that automating deployments can lead to better quality and more predictable delivery. If you\'d like to invest in that, you\'ll need to spend 8 effort points in Deploy (you can do this over multiple days)</br></br>(<em>You can do this later by clicking the \'*\' in the Deploy Column header</em>)'},
      {number: 6, text: 'If you decided yesterday to automate deployments, when you complete the delivery automation, deployments will no longer fail, and you will no longer have to re-do any deploy work.'},
      {number: 7, text: 'Would someone like to learn a new skill? If a person spends five days working in a work stage different from his or her speciality, the person will be able to work in that state at a 1:1 effort ratio.'},
      {number: 8, text: 'Perhaps you have delivered at least one card? If so, are you able to forecast when you might deliver the Minimum Viable Product, which the Product Owner has defined as cards #1-11 '},
      {number: 9, text: 'In this game, you may have been committing to work on an individual work-item basis. Now a new Scrum Master has joined the company, and she wants you to do batch commitment (i.e. pull in as many stories at once as you believe you can accomplish in a week). Will you do this?'},
      {number: 10, function: 'Concurrent Dev and Test', confirm: true, text: 'Testers and Developers want to sit together. You now have the option to do concurrent Dev and Test (i.e. no need to finish Development effort before beginning Testing). Do you want to do this?'},
      {number: 11, function: 'Spend a Day Estimating', text: 'Vince from the PMO says he\'s nervous that you\'re not producing enough according to your original estimate. As a result, he wants you to spend time re-estimating. Lock the team in a room for a day and do no delivery work tomorrow - update your estimate for delivering the entire project and move your day tracker one more day.'},
      {number: 12, text: 'Vince is satisfied with your estimate and sends it around to the business in an email titled \'Team commits to deadline\''},
      {number: 13, function: 'Have Paired', text: 'Did you pair (more than one person worked on a single card in one work stage) today? If so, you get an extra point of work in each stage where the pairing occured (for today only)'},
      {number: 14, function: 'Lose Tester', text: 'Your organisation has lost a tester so if you have testers, one of them now has to support multiple teams. One tester loses two points of effort tomorrow.'},
      {number: 15, text:'You have found that quality improves when you have someone pair with a Deployer. Deploy failures will be halved whenever someone in addition to Deployer works in deploy. (Disregard if you\'re doing automated deployments)'},
      {number: 16, function: 'Recharting', text: 'Team rechartering! Would you like to restructure your team? Feel free to change role specialties (<i>click on \'Set Up\'</i>)  or negotiate with other teams to bring on new members.'},
      {number: 17, text: 'If you restructured your team yesterday, how do you expect the change to impact your forecast.'},
      {number: 18, text: 'Jim from accounting sales sends an email directing employees to make sure they\'re fully utilised (i.e. follow a policy that you do not leave capacity on the table). Do you obey or silently ignore him?'},
      {number: 19, text: 'How much work in progress do you have? Has that changed from earlier?'},
      {number: 20, text: 'When you have completed the MVP (cards 1 to [MVPCARDS]), look at your estimates from earlier. How did you do? This time, try creating a probabilistic forecast for the rest of the backlog using the delivery-time data (ask the facilitator for help).'}
    ],
    workCards: [
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
    ],
    otherCards: [],
    currentWorkCard: 0,
    recharting: false,
    autoDeploy: {
      doing: false,
      effort: 0,
      done: false
    },
    projectEstimate: 0,
    projectActual: 0,
    reEstimate: 0,
    gameState: [],
    games: []
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getShowFacilitator: (state) => {
      return state.showFacilitator
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getHost: (state) => {
      return state.host
    },
    getStealth: (state) => {
      return state.stealth
    },
    getWipLimits: (state) => {
      return state.wipLimits
    },
    getCurrency: (state) => {
      return state.currency
    },
    getAvailableGames: (state) => {
      return state.availableGames
    },
    getGameName: (state) => {
      return state.gameName
    },
    getMyName: (state) => {
      return state.myName
    },
    getMyRole: (state) => {
      let role = ''
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      role = me ? me.role : ''
      return role
    },
    getMyOtherRoles: (state) => {
      let roles = []
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      roles = me ? me.otherRoles : []
      return roles
    },
    getMessage: (state) => {
      return state.message
    },
    getMyEffort: (state) => {
      let effort
      const me = state.members.find(function(m) {
        return m.id == state.myName.id
      })
      if (me) {
        effort = me.effort
      }
      return effort
    },
    getTeamName: (state) => {
      return state.teamName
    },
    getOtherCards: (state) => {
      return state.otherCards
    },
    getCapabilities: (state) => {
      return {
        autoDeploy: state.autoDeploy,
        recharting: state.recharting
      }
    },
    getMyTeamMembers: (state) => {
      return state.members ? state.members.length : 0
    },
    getTeams: (state) => {
      return state.teams
    },
    getActiveTeams: (state) => {
      const teams = []
      for (let i = 0; i < state.teams.length; i++) {
        if (state.teams[i].include) {
          teams.push(state.teams[i])
        }
      }
      return teams
    },
    getPairing: (state) => {
      return state.pairing
    },
    getCurrentDay: (state) => {
      return state.currentDay
    },
    getRoleNames: (state) => {
      return state.roles
    },
    getRoles: (state) => {
      const roles = []
      for (let r = 0; r < state.roles.length; r++) {
        const role = {
          role: state.roles[r]
        }
        const names = []
        const otherNames = []
        for (let i = 0; i < state.members.length; i++) {
          if (state.roles[r] == state.members[i].role) {
            names.push(state.members[i])
          }
          for (let j = 0; j < state.members[i].otherRoles.length; j++) {
            if (state.roles[r] == state.members[i].otherRoles[j]) {
              otherNames.push(state.members[i])
            }
          }
        }
        role.names = names
        role.otherNames = otherNames
        roles.push(role)
      }
      return roles
    },
    getColumns: (state) => {
      return state.columns.sort(function(a, b) {
        return a.order - b.order
      })
    },
    getIncludedColumns: (state) => {
      const columns = []
      for (let i = 0; i < state.columns.length; i++) {
        if (state.columns[i].include) {
          columns.push(state.columns[i])
        }
      }
      return columns
    },
    getBacklog: (state) => {
      state.backlog = []
      return state.backlog
    },
    getWipLimits: (state) => {
      return state.wipLimits
    },
    getCurrentEventCard: (state) => {
      return state.eventCards.find(function(c) {
        return c.number == state.currentDay
      })
    },
    getCurrentWorkCard: (state) => {
      if (state.currentWorkCard < state.workCards.length) {
        return state.currentWorkCard
      } else {
        return false
      }
    },
    getWorkCards: (state) => {
      return state.workCards
    },
    getProjectEstimate: (state) => {
      return state.projectEstimate
    },
    getProjectActual: (state) => {
      return state.projectActual
    },
    getReEstimate: (state) => {
      return state.reEstimate
    },
    getGameState: (state) => {
      return state.gameState
    },
    getGames: (state) => {
      return state.games
    },
    getAvailableGames: (state) => {
      const games = []
      for (let i = 0; i < state.games.length; i++) {
        if (state.games[i].include) {
          games.push(state.games[i].gameName)
        }
      }
      return games
    },
    getConnections: (state) => {
      return state.connections
    }
  },
  mutations: {
    updateShowFacilitator: (state, payload) => {
      state.showFacilitator = payload
    },
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    updateHost: (state, payload) => {
      state.host = payload
    },
    loadAvailableGames: (state, payload) => {
      state.availableGames = payload.games
    },

    loadTeam: (state, payload) => {
      state.members = payload.members
      state.workCards = payload.workCards
      state.otherCards = payload.otherCards
      state.columns = payload.columns
      state.daysEffort = payload.daysEffort
      state.currentDay = payload.currentDay
      state.currentWorkCard = payload.currentWorkCard
      state.projectEstimate = payload.projectEstimate
      state.reEstimate = payload.reEstimate
      state.projectActual = payload.projectActual
      state.pairing = payload.pairing
      state.recharting = payload.recharting
      state.canStartAutoDeploy = payload.canStartAutoDeploy
      state.autoDeploy = payload.autoDeploy
    },
    loadGame: (state, payload) => {
      state.teams = payload.teams
      state.stealth = payload.stealth
      state.wipLimits = payload.wipLimits
    },
    updateGameName: (state, payload) => {
      state.gameName = payload
    },
    updateMyName: (state, payload) => {
      if (payload.uuid && payload.uuid == state.myName.uuid) {
        state.myName.name = payload.name
        state.myName.captain = payload.captain
        state.myName.host = payload.host
      } else {
        state.myName = payload
      }
    },
    updateMessage: (state, payload) => {
      state.message = payload
    },
    updateTeamName: (state, payload) => {
      state.teamName = payload
    },
    updateGameState: (state, payload) => {
      state.gameState = payload.gameState
    },
    updateGames: (state, payload) => {
      state.games = payload
    },
    updateGameDetails: (state, payload) => {
      for (let i = 0; i < state.games.length; i++) {
        if (state.games[i].gameName == payload.gameName) {
          state.games[i].hosts = payload.details.hosts
        }
      }
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    }
  },
  actions: {
    updateShowFacilitator: ({ commit }, payload) => {
      commit('updateShowFacilitator', payload)
    },
    updateWalkThrough: ({ commit }, payload) => {
      commit('updateWalkThrough', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateStealth: ({ commit }, payload) => {
      commit('updateStealth', payload)
    },
    loadAvailableGame: ({ commit }, payload) => {
      commit('loadAvailableGame', payload)
    },
    loadGame: ({ commit }, payload) => {
      commit('loadGame', payload)
    },
    loadTeam: ({ commit }, payload) => {
      commit('loadTeam', payload)
    },
    updateGameName: ({ commit }, payload) => {
      commit('updateGameName', payload)
    },
    updateMyName: ({ commit }, payload) => {
      commit('updateMyName', payload)
    },
    updateMessage: ({ commit }, payload) => {
      commit('updateMessage', payload)
    },
    updateTeamName: ({ commit }, payload) => {
      commit('updateTeamName', payload)
    },
    updateGameState: ({ commit }, payload) => {
      commit('updateGameState', payload)
    },
    updateGames: ({ commit }, payload) => {
      commit('updateGames', payload)
    },
    updateGameDetails: ({ commit }, payload) => {
      commit('updateGameDetails', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  }
})
