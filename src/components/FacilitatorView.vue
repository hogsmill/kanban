<template>
  <div class="container about">
    <h1>Kanban Explorer - <span v-if="stealth">(Stealth)</span> Facilitator View</h1>
    <Connections />
    <GameMessaging />
    <GameParams />
    <GameState />
    <Games />
    <div v-if="isDev()">
      <Utils />
    </div>
  </div>
</template>

<script>
import Connections from './facilitator/Connections.vue'
import GameMessaging from './facilitator/GameMessaging.vue'
import GameParams from './facilitator/GameParams.vue'
import GameState from './facilitator/GameState.vue'
import Games from './facilitator/Games.vue'
import Utils from './facilitator/Utils.vue'

export default {
  components: {
    Connections,
    GameMessaging,
    GameParams,
    GameState,
    Games,
    Utils
  },
  computed: {
    stealth() {
      return this.$store.getters.getStealth
    }
  },
  methods: {
    isDev() {
      return window.location.href.match('localhost')
    }
  }
}
</script>

<style lang="scss">
  .game-messaging, .game-params, .game-state, .games {

    width: 100%;
    margin: 12px;
    border: 1px solid #ccc;

    .toggle {
      color: #aaa;
      font-size: xx-large;

      &:hover {
        cursor: pointer;
      }
    }

    .left {
      text-align: left;
    }

    h4 {
      width: 50%;
      display: inline-block;
      text-align: left;
    }

    span, i {
      position: absolute;
      right: 6px;
    }

    td {
      vertical-align: top;
      position: relative;
      padding: 4px;
      text-align: left;
      border: 1px solid #ccc;

      &.center {
        text-align: center;
      }
      &.left-col {
        vertical-align: top;
      }
    }
    input {
      width: 70px;
      height: 24px;
      padding: 2px;
      text-align: right;
      margin: 0 auto;
    }
  }
</style>
