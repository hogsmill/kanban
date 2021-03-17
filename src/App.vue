<template>
  <div id="app" class="mb-4">
    <appHeader />
    <WalkThroughView />
    <div v-if="showFacilitator">
      <FacilitatorView />
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
      <SetGame />
      <Status />
      <div class="container board">
        <h3 class="board-title">
          <span v-if="gameName">Game: {{ gameName }}</span>
          <span v-if="gameName && teamName"> - </span>
          <span v-if="teamName">Team: {{ teamName }} ({{ myTeamMembers }} {{ membersString() }})</span>
        </h3>
        <div class="game-buttons">
          <Statistics />
        </div>
        <Roles />
        <Message />
        <Day />
        <Board />
      </div>
    </div>
  </div>
</template>

<script>
import bus from './socket.js'

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
    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    if (params.getParam('game')) {
      const game = params.getParam('game')
      this.$store.dispatch('updateGameName', game)
      localStorage.setItem('gameName', game)
    }

    const gameName = localStorage.getItem('gameName')
    if (gameName) {
      this.$store.dispatch('updateGameName', gameName)
      bus.$emit('sendGameState', {gameName: gameName})
    }

    let myName = localStorage.getItem('myName')
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('updateMyName', myName)
      bus.$emit('sendGetAvailableGames', {host: myName})
    }

    const teamName = localStorage.getItem('teamName')
    if (teamName) {
      this.$store.dispatch('updateTeamName', teamName)
    }

    const myRole = localStorage.getItem('myRole')

    window.onload = function() {
      if (gameName && myName && teamName) {
        bus.$emit('sendLoadGame', {gameName: gameName, teamName: teamName, myName: myName, myRole: myRole}) //, myEffort: myEffort})
      }
    }

    bus.$on('loadTeam', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        this.$store.dispatch('loadTeam', data)
      }
    })

    bus.$on('loadGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('loadGame', data)
      }
    })

    bus.$on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    bus.$on('updateGames', (data) => {
      this.$store.dispatch('updateGames', data)
      for (let i = 0; i < data.length; i++) {
        bus.$emit('sendGetGameDetails', {gameName: data[i].gameName})
      }
    })

    bus.$on('updateGameDetails', (data) => {
      this.$store.dispatch('updateGameDetails', data)
    })

    bus.$on('updateConnections', (data) => {
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
