<template>
  <table class="game-messaging">
    <tr>
      <td>
        <h4>Messaging</h4>
        <i v-if="showGameMessaging" @click="setShowGameMessaging(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGameMessaging" @click="setShowGameMessaging(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGameMessaging" class="message-params">
      <td>
        <div>Message: </div>
        <input type="text" id="gameMessageText">
        <button class="btn btn-sm btn-site-primary" @click="sendMessage">
          Send
        </button>
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
      showGameMessaging: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    setShowGameMessaging(val) {
      this.showGameMessaging = val
    },
    sendMessage() {
      const message = document.getElementById('gameMessageText').value
      if (message) {
        this.socket.emit('broadcastMessage', {gameName: this.gameName, message: message})
      }
    }
  }
}
</script>

<style lang="scss">
  .game-messaging {
    .message-params {
      div, input, button {
        display: inline-block;
        margin: 2px 6px;
      }

      input {
        width: 80%;
        border: 1px solid #ccc;
        text-align: left;
      }
    }
  }
</style>
