<template>
  <div class="work-card" :class="{'blocked': workCard.blocked}">
    <div v-if="workCard.blocked" class="blocked-text">
      <strong>BLOCKED</strong>
    </div>
    <div v-if="workCard.failed && column == 'deploy'" class="failed">
      FAILED
    </div>
    <div v-if="workCard.urgent" class="urgent">
      URGENT
    </div>
    <div v-if="workCard.teamDependency && workCard.dependencyDone < workCard.teamDependency" class="outstanding-dependency">
      DEPENDENCY
    </div>
    <div class="work-card-header">
      <div class="card-number">
        #{{ workCard.number }}
      </div>
      <div class="card-effort">
        Effort: {{ totalEffort() }}
      </div>
    </div>
    <div v-if="column != 'done'">
      <div class="work-card-effort" :class="{ 'current' : canAssign('design') }" @click="addEffort('design')">
        <div class="work-card-column column rounded-circle" :class="{'design': !workCard.blocked}">
          A
        </div>
        <div v-for="n in workCard.design" :key="n" :class="{'assigned' : n <= workCard.effort.design}" class="work-card-column rounded-circle" />
      </div>
      <div class="work-card-effort" :class="{ 'current' : canAssign('develop') }" @click="addEffort('develop')">
        <div class="work-card-column column rounded-circle" :class="{'develop': !workCard.blocked}">
          B
        </div>
        <div v-for="n in workCard.develop" :key="n" :class="{'assigned' : n <= workCard.effort.develop}" class="work-card-column rounded-circle" />
      </div>
      <div class="work-card-effort" :class="{ 'current' : canAssign('test') }" @click="addEffort('test')">
        <div class="work-card-column column rounded-circle" :class="{'test': !workCard.blocked}">
          C
        </div>
        <div v-for="n in workCard.test" :key="n" :class="{'assigned' : n <= workCard.effort.test}" class="work-card-column rounded-circle" />
      </div>
      <div class="work-card-effort" :class="{ 'current' : canAssign('deploy') }" @click="addEffort('deploy')">
        <div class="work-card-column column rounded-circle" :class="{'deploy': !workCard.blocked}">
          D
        </div>
        <div v-for="n in workCard.deploy" :key="n" :class="{'assigned' : n <= workCard.effort.deploy}" class="work-card-column rounded-circle" />
      </div>
    </div>
    <table class="delivery">
      <tr>
        <td>COMMIT</td>
        <td>DELIVER</td>
        <td>TIME</td>
      </tr>
      <tr>
        <td>{{ workCard.commit }}</td>
        <td>{{ workCard.delivery }}</td>
        <td :class="{'not-done': !workCard.done}">
          {{ time() }}
        </td>
      </tr>
      <tr v-if="workCard.teamDependency">
        <td class="dependency" colspan="3">
          <span>TEAM: </span>
          <div class="dependency-team" :style="{'background-color': teamClass()}">
            <strong v-if="!workCard.dependentOn">None</strong>
            <strong v-if="workCard.dependentOn">{{ workCard.dependentOn.name }}</strong>
          </div>
          <div v-for="n in workCard.teamDependency" :key="n" :class="{'assigned' : n <= workCard.dependencyDone}" class="dependency-column rounded-circle" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import roles from '../../lib/roles.js'

export default {
  props: [
    'column', 'workCard', 'socket'
  ],
  data() {
    return {
      timeout: false,
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
    myOtherRoles() {
      return this.$store.getters.getMyOtherRoles
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    },
    capabilities() {
      return this.$store.getters.getCapabilities
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    }
  },
  methods: {
    teamClass() {
      return this.workCard.dependentOn ? this.workCard.dependentOn.name.toLowerCase() : ''
    },
    effort(column) {
      return this.workCard[column]
    },
    totalEffort() {
      return this.workCard.design +
        this.workCard.develop +
        this.workCard.test +
        this.workCard.deploy
    },
    time() {
      return this.currentDay - this.workCard.commit
    },
    canAssign(column) {
      return this.column == column
    },
    addEffort(column) {
      let message = '', effort = 0
      if (this.workCard.blocked) {
        message = 'card is blocked'
      } else if (this.canAssign(column)) {
        if (this.myEffort.available == 0) {
          message = 'all effort assigned'
        } else if (this.workCard.effort[column] == this.workCard[column]) {
          message = 'all work completed'
        } else {
          if (roles.iHaveRole(column, this.myRole, this.myOtherRoles)) {
            this.workCard.effort[column] = this.workCard.effort[column] + 1
            effort = 1
          } else {
            if (this.myEffort.available < 2) {
              message = 'you only have one effort point left'
            } else {
              this.workCard.effort[column] = this.workCard.effort[column] + 1
              effort = 2
              if (column == this.column) {
                this.socket.emit('pairingDay', {gameName: this.gameName, teamName: this.teamName, name: this.myName, column: column, day: this.currentDay})
              }
            }
          }
        }
      } else if (!this.canAssign(column)) {
        message = 'wrong column'
      }
      if (message != '') {
        // TBD this is a bit messy...
        if (this.timeout) {
          window.clearTimeout(this.timeout)
        }
        this.$store.dispatch('updateMessage', message)
        const self = this
        this.timeout = window.setTimeout(function() {
          self.$store.dispatch('updateMessage', '')
        }, 2000)
      } else {
        this.socket.emit('updatePersonEffort', {gameName: this.gameName, teamName: this.teamName, workCard: this.workCard, name: this.myName, column: column})
        this.socket.emit('updateEffort', {
          gameName: this.gameName,
          teamName: this.teamName,
          name: this.myName,
          role: this.myRole,
          workCard: this.workCard,
          column: column,
          effort: effort})
      }
    }
  }
}
</script>

<style lang="scss">

  .work-card-popup {
    * {
      text-align: center;
    }
    .button {
      text-align: center;
    }
  }

  .work-card {
    background-color: #fff;
    color: #444;
    margin: 6px;
    position: relative;
    box-shadow: 2px 2px 3px #444;

    &.blocked {
      background-color: red;
    }

    .blocked-text {
      z-index: 10;
      position: absolute;
      top: 50px;
      left: 16px;
      color: #fff;
      font-size: large;
    }

    div {
      text-align: left;
    }

    .urgent, .failed, .outstanding-dependency {
      height: 22px;
      text-align: center;
      padding: 0 6px;
      font-weight: bold;
      color: #fff;
    }

    .urgent {
      background-color: red;
    }

    .outstanding-dependency {
      background-color: orange;
    }

    .failed {
      background-color: #888;
    }

    .work-card-header {
      text-align: right;
      padding-right: 2px;
      font-weight: bold;
      margin-bottom: 4px;

      .card-number {
        padding-left: 2px;
        width: 20%;
        display: inline-block;
      }

      .card-effort {
        padding-right: 2px;
        width: 80%;
        display: inline-block;
        text-align: right;
      }
    }

    .work-card-effort {

      opacity: 0.5;

      &.current {
        opacity: 1;

        &:hover {
          cursor: pointer;
        }
      }

      .work-card-column {
        display: inline-block;
        border: 1px solid;
        margin-left: 1px;
        width: 8px;
        height: 8px;
        font-size: 8px;
        padding-left: 2px;

        &.column {
          color: #fff;
          border: 0;
          display: inline-block;
          width: 11px;
          height: 11px;
          font-size: 8px;
          padding-left: 2px;
        }
      }

      .assigned {
        background-color: #000;
      }
    }

    .delivery {
      td {
        border: 1px solid #444;
      }
    }

    .dependency {
      background-color: #000;
      color: #fff;
      vertical-align: middle;

      div {
        display: inline-block;
        width: 33%;
      }

      .dependency-team {
        background-color: #fff;
        color: #fff;
        text-align: center;
      }

      .dependency-column {
        display: inline-block;
        border: 1px solid;
        margin-left: 1px;
        width: 8px;
        height: 8px;
        font-size: 8px;
        padding-left: 2px;

        &.assigned {
          background-color: #fff;
        }
      }
    }

    table {
      width: 100%;
      margin-top: 10px;
      border-collapse: collapse
    }

    td {
      font-size: 8px;

      &.not-done {
        color: #fff;
        font-weight: bold;
        background-color: red;
      }
    }

  }

</style>
