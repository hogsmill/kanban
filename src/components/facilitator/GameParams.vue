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
      <td colspan="3" class="stealth">
        <input id="wipLimits" type="checkbox" :checked="stealth" @click="toggleWipLimits()">
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
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    teams() {
      return this.$store.getters.getTeams
    }
  },
  methods: {
    setShowGameParams(val) {
      this.showGameParams = val
    },
    toggleStealth() {
      const isStealth = document.getElementById('isStealth').checked
      localStorage.setItem('stealth', isStealth)
      this.socket.emit('updateStealth', {gameName: this.gameName, stealth: isStealth})
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
</style>
