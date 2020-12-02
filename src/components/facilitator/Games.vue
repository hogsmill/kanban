<template>
  <table class="games">
    <tr>
      <td class="left" colspan="16">
        <h4>Games</h4>
        <i v-if="showGames" @click="setShowGames(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGames" @click="setShowGames(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGames" class="header">
      <td>Games</td>
      <td>
        <table class="games-table">
          <thead>
            <th>Include?</th>
            <th>Game Name</th>
            <th>Hosts</th>
            <th />
            <th>Last Accessed</th>
          </thead>
          <tbody>
            <tr v-for="(game, index) in games" :key="index">
              <td>
                <input :id="'game-active-' + idSafe(game)" type="checkbox" :checked="game.include" @click="toggleGameInclude(game)" :disabled="game.gameName == gameName">
              </td>
              <td>
                {{ game.gameName }}
              </td>
              <td>
                {{ game.hosts ? game.hosts.join(', ') : '' }}
              </td>
              <td>
                <button class="btn btn-sm btn-site-primary" @click="deleteGame(game)" :disabled="game.gameName == gameName">
                  Delete
                </button>
              </td>
              <td>
                {{ lastAccessed(game) }}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import stringFuns from '../../lib/stringFuns.js'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-GB')

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showGames: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    games() {
      return this.$store.getters.getGames
    }
  },
  created() {
    this.socket.emit('getGames')
  },
  methods: {
    setShowGames(val) {
      this.showGames = val
    },
    idSafe(game) {
      return stringFuns.idSafe(game.gameName)
    },
    lastAccessed(game) {
      return game.lastaccess ? timeAgo.format(new Date(game.lastaccess)) : ''
    },
    toggleGameInclude(game) {
      const include = document.getElementById('game-active-' + this.idSafe(game)).checked
      this.socket.emit('updateGameInclude', {gameName: game.gameName, include: include})
    },
    deleteGame(game) {
      this.socket.emit('deleteGame', {gameName: game.gameName})
    }
  }
}
</script>

<style lang="scss">
  .games {
    .games-table {
      border: none;

      th {
        text-align: center;
        padding: 3px 8px
      }
    }
  }
</style>
