<template>
  <div class="board-container">
    <EventCard />
    <div class="game-board">
      <table class="board-table rounded">
        <thead>
          <tr>
            <th>
              <div class="options">
                Backlog
              </div>
              <div v-if="wipLimits" class="options">
                {{ wipLimitType }} WIP Limits
              </div>
            </th>
            <th v-for="(column, index) in columns" :key="index" :colspan="splitColumns ? 2 : 1">
              <div :style="{ 'background-color': column.colour }">
                {{ columnDisplayName(column.name) }}
                <span class="autoDeploy" v-if="showAutoDeploy(column)" title="Deployment is now automated">&#10004;</span>
                <span class="canStartAutoDeploy rounded-circle" v-if="canStartAutoDeploy(column)" @click="startAutoDeploy()">&#10033;</span>
              </div>
              <div v-if="wipLimits" :style="{ 'background-color': column.colour }">
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
            <td class="options-column">
              <WorkCardStack />
              <OtherSkills />
              <OtherTeams v-if="teams.length > 1" />
            </td>
            <td v-for="(column, index) in allColumns()" :key="index" :class="columnClass(column)">
              <Column :column="column" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

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
    },
    wipLimitType() {
      return this.$store.getters.getWipLimitType
    },
    splitColumns() {
      return this.$store.getters.getSplitColumns
    }
  },
  methods: {
    allColumns() {
      let columns = []
      if (!this.splitColumns) {
        columns = this.columns
      } else {
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].name == 'done') {
            const column = JSON.parse(JSON.stringify(this.columns[i]))
            column.type = 'none'
            columns.push(column)
          } else {
            const column1 = JSON.parse(JSON.stringify(this.columns[i]))
            const column2 = JSON.parse(JSON.stringify(this.columns[i]))
            column1.type = 'doing'
            columns.push(column1)
            column2.type = 'done'
            columns.push(column2)
          }
        }
      }
      return columns
    },
    toggleEditingWip(column) {
      this.editingWip = column
    },
    saveWip(column) {
      const wip = document.getElementById('wip-' + column).value
      if (!wip.match(/^[0-9]+$/)) {
        alert('Please enter a number for WIP')
      } else {
        bus.$emit('sendSetColumnWip', {gameName: this.gameName, teamName: this.teamName, column: column, wipLimit: wip})
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
      bus.$emit('sendStartAutoDeploy', {gameName: this.gameName, teamName: this.teamName})
    },
    columnClass(column) {
      let classStr = ''
      if (column.type) {
        classStr = classStr + 'column-' + column.type
      }
      if (column.wipLimit && column.cards.length > column.wipLimit) {
        classStr = classStr = ' over-wip'
      }
      return classStr
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
    border: 1px solid;
    border-collapse:separate;
    border-spacing: 0px;

    th, td {
      border: 1px solid;
      vertical-align: top;

      .wip:hover {
        cursor: pointer;
      }

      &.options-column {
        width: 136px;
      }

      &.column-doing {
        border-right-style: dashed;
      }
      &.column-done {
        border-left-style: dashed;
      }

      &.over-wip {
        background-color: red;
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
