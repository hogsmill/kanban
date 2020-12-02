<template>
  <div class="status" :class="{ 'urgent': urgent }">
    {{ status }}
  </div>
</template>

<script>
import stringFuns from '../lib/stringFuns.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      status: '',
      urgent: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    }
  },
  mounted() {
    const self = this
    this.socket.on('updatePersonEffort', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        const column = stringFuns.properCase(data.column)
        self.setStatus(data.name.name + ' has added effort to card #' + data.workCard.number + ' in ' + column, false)
      }
    })
    this.socket.on('updatePersonAutoDeployEffort', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        self.setStatus(data.name.name + ' has added Auto Deploy effort', false)
      }
    })
    this.socket.on('updateOtherTeamEffort', (data) => {
      if (this.gameName == data.gameName && this.teamName != data.teamName) {
        self.setStatus('Team ' + data.teamName + ' has added effort to card #' + data.card.number, false)
      }
    })
    this.socket.on('broadcastMessage', (data) => {
      if (this.gameName == data.gameName) {
        self.setStatus(data.message, true)
      }
    })
  },
  methods: {
    setStatus(status, urgent) {
      this.urgent = urgent
      this.status = status
    }
  }
}
</script>

<style lang="scss">
  .status {
    height: 20px;
    font-weight: bold;
    margin: 6px;

    &.urgent {
      background-color: red;
      color: #fff;
    }
  }
</style>
