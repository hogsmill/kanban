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
      <td class="wip-limits">
        <input id="wip-limits" type="checkbox" :checked="wipLimits" @click="toggleWipLimits()">
      </td>
      <td colspan="2" class="wip-limits">
        <input name="wip-limits-type" id="wip-limits-hard" type="radio" :checked="wipLimitType == 'hard'" @click="toggleWipLimitType('hard')"> Hard<br>
        <input name="wip-limits-type" id="wip-limits-soft" type="radio" :checked="wipLimitType == 'soft'" @click="toggleWipLimitType('soft')"> Soft
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Split Columns?
      </td>
      <td colspan="3" class="wip-limits">
        <input id="split-columns" type="checkbox" :checked="splitColumns" @click="toggleSplitColumns()">
      </td>
    </tr>
    <tr v-if="showGameParams">
      <td class="left-col">
        Columns
      </td>
      <td colspan="3" class="columns">
        <table class="columns-table">
          <thead>
            <tr>
              <th>
                Include?
              </th>
              <th>
                Name
              </th>
              <th colspan="3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(column, index) in columns" :key="index">
              <td>
                <input :id="'include-column-' + column.name" type="checkbox" :checked="column.include" @click="toggleIncludeColumn(column)">
              </td>
              <td class="column-name" :style="{ 'background-color': column.colour }">
                {{ column.name }}
              </td>
              <td>
                <ColumnColours :column="column" :id="'column-color-' + column.name" />
              </td>
              <td>
                <i class="fas fa-trash-alt" title="Delete column" @click="deleteColumn(column)" />
              </td>
              <td>
                <i v-if="index > 0 && index < columns.length - 1" class="fas fa-chevron-up" title="Move Column Left in Workflow" @click="moveColumnUp(column)" />
              </td>
              <td>
                <i v-if="index < columns.length - 2" class="fas fa-chevron-down" title="Move Column Right in Workflow" @click="moveColumnDown(column)" />
              </td>
            </tr>
            <tr>
              <td>
                Add New
              </td>
              <td>
                <input type="text" id="add-column">
              </td>
              <td>
                <ColumnColours :column="null" :id="'add-column-colour'" />
              </td>
              <td colspan="3">
                <i class="fas fa-save" @click="addColumn()" />
              </td>
            </tr>
          </tbody>
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
import bus from '../../socket.js'

import ColumnColours from './gameParams/ColumnColours.vue'

export default {
  components: {
    ColumnColours
  },
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
    wipLimitType() {
      return this.$store.getters.getWipLimitType
    },
    splitColumns() {
      return this.$store.getters.getSplitColumns
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
    toggleSplitColumns() {
      const splitColumns = document.getElementById('split-columns').checked
      bus.$emit('sendUpdateSplitColumns', {gameName: this.gameName, splitColumns: splitColumns})
    },
    toggleWipLimits() {
      const wipLimits = document.getElementById('wip-limits').checked
      bus.$emit('sendUpdateWipLimits', {gameName: this.gameName, wipLimits: wipLimits})
    },
    toggleWipLimitType(wipLimitType) {
      bus.$emit('sendUpdateWipLimitType', {gameName: this.gameName, wipLimitType: wipLimitType})
    },
    toggleStealth() {
      const isStealth = document.getElementById('isStealth').checked
      localStorage.setItem('stealth', isStealth)
      bus.$emit('sendUpdateStealth', {gameName: this.gameName, stealth: isStealth})
    },
    toggleIncludeColumn(column) {
      const include = document.getElementById('include-column-' + column.name).checked
      bus.$emit('sendUpdateIncludeColumn', {gameName: this.gameName, column: column, include: include})
    },
    moveColumnUp(column) {
      bus.$emit('sendMoveColumnUp', {gameName: this.gameName, column: column})
    },
    moveColumnDown(column) {
      bus.$emit('sendMoveColumnDown', {gameName: this.gameName, column: column})
    },
    deleteColumn(column) {
      bus.$emit('sendDeleteColumn', {gameName: this.gameName, column: column})
    },
    addColumn() {
      const column = document.getElementById('add-column').value
      const colour = document.getElementById('add-column-colour').value
      bus.$emit('sendAddColumn', {gameName: this.gameName, column: column, colour: colour})
    },
    toggleTeamActive(team) {
      const include = document.getElementById('team-active-' + team).checked
      bus.$emit('updateTeamActive', {gameName: this.gameName, teamName: team, include: include})
    },
    otherCards(team) {
      const _team = this.gameState.find(function(t) {
        return t.name == team.name
      })
      return _team ? _team.otherCards.length > 0 : []
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
    th {
      text-align: center;
    }
    td {
      border: none;

      &.column-name {
        color: #fff;
        text-align: center;
        font-weight: bold;
      }
    }
    .fa-trash-alt, .fa-save, .fa-chevron-up, .fa-chevron-down {
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
