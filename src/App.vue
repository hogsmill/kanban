<template>
  <div id="app" class="mb-4">
    <appHeader />
    <WalkThroughView />
    <div v-if="showFacilitator">
      <FacilitatorView :socket="socket" />
    </div>
    <div class="main" v-else>
      <div v-if="isHost" class="right">
        <button class="btn btn-sm btn-outline-secondary smaller-font" @click="clearLocalStorage()">
          Clear Local Storage
        </button>
      </div>
      <div v-if="!connections.connections" class="not-connected">
        WARNING: You are not connected to the server
      </div>
      <SetGame :socket="socket" />
      <Status :socket="socket" />
      <div class="container board">
        <h3 class="board-title">
          <span v-if="gameName">Game: {{ gameName }}</span>
          <span v-if="gameName && teamName"> - </span>
          <span v-if="teamName">Team: {{ teamName }} ({{ myTeamMembers }} {{ membersString() }})</span>
        </h3>
        <div class="game-buttons">
          <Statistics :socket="socket" />
        </div>
        <Roles />
        <Message :socket="socket" />
        <Day :socket="socket" />
        <Board :socket="socket" />
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'
import stringFuns from './lib/stringFuns.js'

import Header from './components/Header.vue'
import Statistics from './components/Statistics.vue'
import SetGame from './components/SetGame.vue'
import Status from './components/Status.vue'
import Message from './components/Message.vue'
import FacilitatorView from './components/FacilitatorView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'

import Roles from './components/Roles.vue'
import Day from './components/Day.vue'
import Board from './components/Board.vue'

export default {
  name: 'App',
  components: {
    appHeader: Header,
    FacilitatorView,
    WalkThroughView,
    SetGame,
    Status,
    Message,
    Statistics,
    Roles,
    Day,
    Board
  },
  data() {
    return {
      setup: false
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    connections() {
      return this.$store.getters.getConnections
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myTeamMembers() {
      return this.$store.getters.getMyTeamMembers
    }
  },
  created() {
    let connStr
    if (location.hostname == 'localhost') {
      connStr = 'http://localhost:3014'
    } else {
      connStr = 'https://agilesimulations.co.uk:3014'
    }
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    if (params.getParam('game')) {
      const game = params.getParam('game')
      this.$store.dispatch('updateGameName', game)
      localStorage.setItem('gameName', game)
    }

    this.socket.on('updateMvpCards', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateMvpCards', data)
      }
    })

    const gameName = localStorage.getItem('gameName')
    if (gameName) {
      this.$store.dispatch('updateGameName', gameName)
      this.socket.emit('gameState', {gameName: gameName})
    }

    let myName = localStorage.getItem('myName')
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('updateMyName', myName)
      this.socket.emit('getAvailableGames', {host: myName})
    }

    const teamName = localStorage.getItem('teamName')
    if (teamName) {
      this.$store.dispatch('updateTeamName', teamName)
    }

    const myRole = localStorage.getItem('myRole')

    const self = this
    window.onload = function() {
      if (gameName && myName && teamName) {
        self.socket.emit('loadGame', {gameName: gameName, teamName: teamName, myName: myName, myRole: myRole}) //, myEffort: myEffort})
      }
    }

    this.socket.on('loadTeam', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('loadTeam', data)
      }
    })

    this.socket.on('loadGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('loadGame', data)
      }
    })

    this.socket.on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    this.socket.on('updateGames', (data) => {
      this.$store.dispatch('updateGames', data)
      for (let i = 0; i < data.length; i++) {
        this.socket.emit('getGameDetails', {gameName: data[i].gameName})
      }
    })

    this.socket.on('updateGameDetails', (data) => {
      this.$store.dispatch('updateGameDetails', data)
    })

    this.socket.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnections', data)
    })
  },
  methods: {
    membersString() {
      return stringFuns.pluralString(this.myTeamMembers, 'member')
    },
    clearLocalStorage() {
      if (confirm('Clear localStorage?')) {
        localStorage.removeItem('myName')
        localStorage.removeItem('teamName')
        localStorage.removeItem('myRole')
        localStorage.removeItem('gameName')
      }
    }
  },
}
</script>

<style lang="scss">

  .not-connected {
    background-color: red;
    color: #fff;
    font-weight: bold;
  }

  .right {
    text-align: right;
    padding-right: 4px;
  }

  .not-host {
    height: 0px;
    visibility: hidden;
  }

  h1 {
    margin-bottom: 16px;
  }

  .setup-header {
    width: 700px;
    margin: 0 auto 16px auto;
  }

  .board-title {
    padding-top: 8px;
    span {
      margin: 6px;
    }
  }

  .board {
    //
    // Gradient
    //
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#7db9e8+0,207cca+44,0000ff+100 */
    $start: #ABB2B9;
    $mid: #566573;
    $end: #17202A;
    background: #7db9e8; /* Old browsers */
    background: -moz-radial-gradient(center, ellipse cover,  $start 0%, $mid 44%, $end 100%); /* FF3.6-15 */
    background: -webkit-radial-gradient(center, ellipse cover,  $start 0%,$mid 44%,$end 100%); /* Chrome10-25,Safari5.1-6 */
    background: radial-gradient(ellipse at center,  $start 0%,$mid 44%,$end 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$start', endColorstr='$end',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    //
    // End Gradient
    //

    margin-top: 6px;
    color: #fff;

    .game-buttons {
      text-align: left;
    }
  }

</style>
