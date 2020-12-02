<template>
  <table class="game-state">
    <tr>
      <td class="left" colspan="16">
        <h4>
          Game State: (Game: {{ gameName }})
          <i v-if="gameName" title="Restart Game" @click="restartGame" class="fas fa-undo-alt restart" />
        </h4>
        <i v-if="showGameState" @click="setShowGameState(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showGameState" @click="setShowGameState(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showGameState" class="header">
      <td>Team</td>
      <td>
        <div class="white rounded-circle member-role designer">
          D
        </div>
        <div class="white rounded-circle member-role developer">
          D
        </div>
        <div class="white rounded-circle member-role tester">
          T
        </div>
        <div class="white rounded-circle member-role deployer">
          D
        </div>
        <br>
        Members
      </td>
      <td>Autodeploy?</td>
      <td>Current<br>Day</td>
      <td>Last<br>Card<br>Played</td>
      <td>Other<br>Team<br>Cards</td>
      <td colspan="5">
        Columns
      </td>
      <td colspan="3">
        Estimates<br>Proj./MVP/Re-est.
      </td>
    </tr>
    <tr v-for="(team, index) in gameState" :key="index">
      <td v-if="showTeamState(team)" class="white" :style="{'background-color': team.name.toLowerCase()}">
        {{ team.name }}
      </td>
      <td v-if="showTeamState(team)">
        <div v-for="(member, m) in team.members" :key="m">
          <b>{{ member.name }}</b>
          <div class="white rounded-circle member-role" :class="roleClass(member.role)">
            {{ effort(member) }}
          </div>
        </div>
      </td>
      <td v-if="showTeamState(team) && !team.autoDeploy.doing && !team.autoDeploy.done">
        &#9746;
      </td>
      <td v-if="showTeamState(team) && team.autoDeploy.doing">
        {{ team.autoDeploy.effort }} / 8
      </td>
      <td v-if="showTeamState(team) && team.autoDeploy.done">
        &#9745;
      </td>
      <td v-if="showTeamState(team)">
        {{ team.currentDay }}
      </td>
      <td v-if="showTeamState(team)">
        {{ team.currentWorkCard }}
      </td>
      <OtherCards v-if="showTeamState(team)" :cards="team.otherCards" />
      <Column v-if="showTeamState(team)" :column="team.columns.design" :name="'Design'" />
      <Column v-if="showTeamState(team)" :column="team.columns.develop" :name="'Develop'" />
      <Column v-if="showTeamState(team)" :column="team.columns.test" :name="'Test'" />
      <Column v-if="showTeamState(team)" :column="team.columns.deploy" :name="'Deploy'" />
      <Column v-if="showTeamState(team)" :column="team.columns.done" :name="'Done'" />
      <td v-if="showTeamState(team)">
        {{ estimates(team) }}
      </td>
    </tr>
  </table>
</template>

<script>
import OtherCards from './gameState/OtherCards.vue'
import Column from './gameState/Column.vue'

export default {
  components: {
    OtherCards,
    Column
  },
  props: [
    'socket'
  ],
  data() {
    return {
      showGameState: true,
    }
  },
  computed: {
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
    setShowGameState(val) {
      this.showGameState = val
    },
    showTeamState(team) {
      const include = this.teams.find(function(t) {
        return t.name == team.name
      }).include
      return this.showGameState && include
    },
    estimates(team) {
      const proj = team.projectEstimate ? team.projectEstimate : '-'
      const mvp = team.mvpEstimate ? team.mvpEstimate : '-'
      const re = team.reEstimate ? team.reEstimate : '-'
      return proj + ' / ' + mvp + ' / ' + re
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        this.socket.emit('restartGame', {gameName: this.gameName, stealth: this.stealth})
      }
    },
    effort(role) {
      return role.effort ? role.effort.available : '?'
    },
    roleClass(role) {
      return role.toLowerCase()
    }
  }
}
</script>

<style lang="scss">

  @import '../../assets/colours.scss';

  .game-state {
    .header td {
      vertical-align: middle;
      text-align: center;
      font-weight: bold;
    }

    .restart {
      position: relative;
      left: 6px;
      top: 4px;
      color: #888;

      &:hover {
        color: #111;
        cursor: pointer;
      }
    }

    td {
      text-align: center;

      &.auto-deploy div {
        display: inline;
      }
    }

    .white {
      color: #fff;
      font-weight: bold
   }

    .member-role {
      width: 20px;
      position: relative;
      left: 2px;
      display: inline-block;
      text-align: center;
    }

    .designer {
      background-color: $design;
    }
    .developer {
      background-color: $develop;
    }
    .tester {
      background-color: $test;
    }
    .deployer {
      background-color: $deploy;
    }
  }
</style>
