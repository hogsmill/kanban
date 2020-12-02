<template>
  <div class="auto-deploy">
    <div class="deploy-card-header">
      Auto Deploy
    </div>
    <div class="deploy-card-effort" @click="addEffort('auto-deploy')">
      <div class="deploy-card-column column rounded-circle">
        A
      </div>
      <div v-for="n in 8" :key="n" class="deploy-card-column rounded-circle" :class="{'assigned' : n <= capabilities.autoDeploy.effort}" />
    </div>
  </div>
</template>

<script>
import roles from '../../lib/roles.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      message: ''
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    capabilities() {
      return this.$store.getters.getCapabilities
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
    currentDay() {
      return this.$store.getters.getCurrentDay
    }
  },
  methods: {
    addEffort() {
      const column = 'deploy'
      const iHaveRole = roles.iHaveRole(column, this.myRole, this.myOtherRoles)
      const effort = iHaveRole ? 1 : 2
      if (this.myEffort.available >= effort) {
        this.socket.emit('incrementAutoDeploy', {gameName: this.gameName, teamName: this.teamName, name: this.myName, effort: effort})
        this.socket.emit('updatePersonAutoDeployEffort', {gameName: this.gameName, teamName: this.teamName, name: this.myName})
        if (!iHaveRole) {
          this.socket.emit('pairingDay', {gameName: this.gameName, teamName: this.teamName, name: this.myName, column: column, day: this.currentDay})
        }
      } else {
        this.$store.dispatch('updateMessage', 'No effort available (Autodeploy)')
        const self = this
        this.timeout = window.setTimeout(function() {
          self.$store.dispatch('updateMessage', '')
        }, 2000)
      }
    }
  }
}
</script>
<style lang="scss">

  .auto-deploy {
    background-color: #fff;
    color: #444;
    margin: 6px;
    box-shadow: 2px 2px 3px #444;

    .deploy-card-header {
      font-weight: bold;
    }

    .deploy-card-effort {
      text-align: left;

      .deploy-card-column {
        display: inline-block;
        border: 1px solid;
        margin-left: 1px;
        width: 8px;
        height: 8px;
        font-size: 8px;
        padding-left: 2px;

        &.column {
          background-color: #555;
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
  }
</style>
