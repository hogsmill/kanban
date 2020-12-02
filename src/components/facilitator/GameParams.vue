<template>
  <table class="game-params">
    <tr>
      <td colspan="4">
        <h4>Game Params</h4>
        <i v-if="showGameParams" @click="setShowGameParams(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGameParams" @click="setShowGameParams(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Hosts
      </td>
      <td colspan="3" class="stealth">
        <input id="isStealth" type="checkbox" :checked="stealth" @click="toggleStealth()"> Hosts are in "Stealth" mode? {{ stealth }}
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        WIP Limits?
      </td>
      <td colspan="3" class="wip-limits">
        <input id="wipLimits" type="checkbox" :checked="wipLimits" @click="toggleWipLimits()">
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Columns
      </td>
      <td colspan="3" class="columns">
        <table class="columns-table">
          <tr>
            <td>
              Include?
            </td>
            <td>
              Name
            </td>
            <td colspan="2">
              Move
            </td>
          </tr>
          <tr v-for="(column, index) in columns" :key="index">
            <td>
              <input :id="'include-column-' + column.name" type="checkbox" :checked="column.include" @click="toggleIncludeColumn(column)">
            </td>
            <td>
              {{ column.name }}
            </td>
            <td>
              <i v-if="index > 0" class="fas fa-chevron-up" @click="moveColumnUp(column)" />
            </td>
            <td>
              <i v-if="index < columns.length - 1" class="fas fa-chevron-down" @click="moveColumnDown(column)" />
            </td>
          </tr>
          <tr>
            <td>
              Add New
            </td>
            <td>
              <input type="text" id="add-column-up">
            </td>
            <td colspan="2">
              <i class="fas fa-save" @click="addColumn()" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Teams
      </td>
      <td colspan="3">
        <div v-for="(team, index) in teams" :key="index">
          <input :id="'team-active-' + team.name" type="checkbox" :checked="team.include" @click="toggleTeamActive(team.name)" :disabled="otherCards(team)"> {{ team.name }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showGameParams: false
    }
  },
  computed: {
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
    stealth() {
      return this.$store.getters.getStealth
    },
    wipLimits() {
      return this.$store.getters.getWipLimits
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    teams() {
      return this.$store.getters.getTeams
    },
    columns() {
      return this.$store.getters.getColumns
    }
  },
  methods: {
    setShowGameParams(val) {
      this.showGameParams = val
    },
    toggleWipLimits() {
      const wip = document.getElementById('wipLimits').checked
      this.socket.emit('updateWipLimits', {gameName: this.gameName, wipLimits: wip})
    },
    toggleStealth() {
      const isStealth = document.getElementById('isStealth').checked
      localStorage.setItem('stealth', isStealth)
      this.socket.emit('updateStealth', {gameName: this.gameName, stealth: isStealth})
    },
    toggleIncludeColumn(column) {
      const include = document.getElementById('include-column-' + column.name).checked
      this.socket.emit('updateIncludeColumn', {gameName: this.gameName, column: column, include: include})
    },
    moveColumnUp(column) {
      this.socket.emit('moveColumnUp', {gameName: this.gameName, column: column})
    },
    moveColumnDown(column) {
      this.socket.emit('moveColumnDown', {gameName: this.gameName, column: column})
    },
    toggleTeamActive(team) {
      const include = document.getElementById('team-active-' + team).checked
      this.socket.emit('updateTeamActive', {gameName: this.gameName, teamName: team, include: include})
    },
    otherCards(team) {
      return this.gameState.find(function(t) {
        return t.name == team.name
      }).otherCards.length > 0
    }
  }
}
</script>

<style lang="scss">
  .mvp-label {
    left: 0;
  }
  .columns-table {
    border: none;
    td {
      border: none;
    }
    .fa-save, .fa-chevron-up, .fa-chevron-down {
      margin: 0 auto;
      position: initial;
      font-size: x-large;
      color: #aaa;
      &:hover {
        cursor: pointer;
        color: #444;
      }
    }
  }
</style>
