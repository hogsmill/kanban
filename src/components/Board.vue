<template>
  <div class="board-container">
    <EventCard :socket="socket" />
    <div class="game-board">
      <table class="board-table rounded">
        <thead>
          <tr>
            <th>
              <div class="options">
                Backlog
              </div>
              <div v-if="wipLimits" class="options">
                {{ backlog.length }}
              </div>
            </th>
            <th v-for="(column, index) in columns" :key="index">
              <div :class="column.name">
                {{ columnDisplayName(column.name) }}
                <span class="autoDeploy" v-if="showAutoDeploy(column)" title="Deployment is now automated">&#10004;</span>
                <span class="canStartAutoDeploy rounded-circle" v-if="canStartAutoDeploy(column)" @click="startAutoDeploy()">&#10033;</span>
              </div>
              <div v-if="wipLimits" :class="column.name">
                <span>WIP: </span>
                <span v-if="editingWip != column.name" class="wip" @click="toggleEditingWip(column.name)">{{ column.wipLimit }}</span>
                <span v-if="editingWip == column.name">
                  <input type="text" :id="'wip-' + column.name" class="edit-wip">
                  <i class="fas fa-save" @click="saveWip(column.name)" /></span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <WorkCardStack :socket="socket" />
              <OtherSkills />
              <OtherTeams v-if="teams.length > 1" :socket="socket" />
            </td>
            <td v-for="(column, index) in columns" :key="index">
              <Column :column="column" :socket="socket" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import stringFuns from '../lib/stringFuns.js'

import OtherTeams from './board/OtherTeams.vue'
import OtherSkills from './board/OtherSkills.vue'
import WorkCardStack from './board/WorkCardStack.vue'
import EventCard from './board/EventCard.vue'
import Column from './board/Column.vue'

export default {
  components: {
    OtherTeams,
    OtherSkills,
    WorkCardStack,
    Column,
    EventCard
  },
  props: [
    'socket'
  ],
  data() {
    return {
      editingWip: ''
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    teams() {
      return this.$store.getters.getActiveTeams
    },
    capabilities() {
      return this.$store.getters.getCapabilities
    },
    columns() {
      return this.$store.getters.getIncludedColumns
    },
    backlog() {
      return this.$store.getters.getBacklog
    },
    wipLimits() {
      return this.$store.getters.getWipLimits
    }
  },
  methods: {
    toggleEditingWip(column) {
      this.editingWip = column
    },
    saveWip(column) {
      const wip = document.getElementById('wip-' + column).value
      if (!wip.match(/^[0-9]+$/)) {
        alert('Please enter a number for WIP')
      } else {
        this.socket.emit('setColumnWip', {gameName: this.gameName, teamName: this.teamName, column: column, wipLimit: wip})
        this.editingWip = ''
      }
    },
    columnDisplayName(s) {
      return stringFuns.properCase(s)
    },
    showAutoDeploy(column) {
      return this.teamName && this.capabilities.autoDeploy.done && column.name == 'deploy'
    },
    canStartAutoDeploy(column) {
      return this.teamName && !this.capabilities.autoDeploy.doing &&
        !this.capabilities.autoDeploy.done && this.capabilities.canStartAutoDeploy &&
        column.name == 'deploy'
    },
    startAutoDeploy() {
      this.socket.emit('startAutoDeploy', {gameName: this.gameName, teamName: this.teamName})
    }
  }
}
</script>

<style lang="scss">

  .board-container {
    padding-bottom: 12px;
  }

  table.board-table {
    margin: 6px auto 18px auto;
    width: 90%;
    border: 1px solid;
    border-collapse:separate;
    border-spacing: 0px;

    th, td {
      border: 1px solid;
      vertical-align: top;
      width: 16%;

      .wip:hover {
        cursor: pointer;
      }

      .edit-wip {
        height: 12px;
        width: 30px;
        margin-right: 6px;
      }

      .fas:hover {
        cursor: pointer;
      }
    }

    .autoDeploy {
      color: gold;
    }

    .canStartAutoDeploy {
      background-color: #fff;
      color: purple;
      font-weight: bold;
      padding: 1px 4px;
    }
  }

</style>
