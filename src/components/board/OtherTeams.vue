<template>
  <div class="other-team-header">
    <div class="other-team-header">
      Other Teams
    </div>
    <div>
      <div v-for="(card, index) in otherCards" :key="index" class="other-work-card">
        <div class="urgent" v-if="card.urgent">
          URGENT
        </div>
        <div class="other-work-card-header">
          <div class="card-number">
            #{{ card.number }}
          </div>
          <div class="card-team">
            <span :style="{ 'background-color': card.team.toLowerCase()}">{{ card.team }}</span>
          </div>
        </div>
        <div class="other-work-card-effort" @click="addEffort(card)">
          <div class="other-work-card-column column rounded-circle">
            X
          </div>
          <div v-for="n in card.teamDependency" :key="n" :class="{'assigned' : n <= card.dependencyDone}" class="other-work-card-column rounded-circle" />
        </div>
        <div v-if="card.dependencyDone == card.teamDependency">
          COMPLETE
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    myName() {
      return this.$store.getters.getMyName
    },
    myEffort() {
      return this.$store.getters.getMyEffort
    },
    otherCards() {
      return this.$store.getters.getOtherCards
    }
  },
  methods: {
    addEffort(card) {
      let message = ''
      if (this.myEffort.available == 0) {
        message = 'Can\'t assign - all effort assigned'
      } else if (card.dependencyDone == card.teamDependency) {
        message = 'Can\'t assign - card complete'
      }
      if (message) {
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
        this.socket.emit('addEffortToOthersCard', {gameName: this.gameName, teamName: this.teamName, card: card, myName: this.myName, effort: 1})
        this.socket.emit('updateOtherTeamEffort', {gameName: this.gameName, teamName: this.teamName, card: card, name: this.myName, effort: this.myEffort})
      }
    }
  }
}
</script>

<style lang="scss">
  .other-team-header {
    font-weight: bold;
    width: 100%;
    margin-top: 20px;
  }

  .other-work-card {
    background-color: #fff;
    color: #444;
    margin: 6px;
    width: 122px;

    .urgent {
      background-color: red;
      color: #fff;
    }

    .other-work-card-header {
      padding: 2px 2px 0 0;
      font-weight: bold;
      margin-bottom: 4px;

      .card-team {
        text-align: right;
        width: 80%;
        display: inline-block;

        span {
          padding: 2px; color: #fff;
        }
      }

      .card-number {
        text-align: left;
        width: 20%;
        padding-left: 2px;
        display: inline-block;
      }
    }

    .other-work-card-effort {
      text-align: left;

      &:hover {
        cursor: pointer;
      }

      .other-work-card-column {
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
