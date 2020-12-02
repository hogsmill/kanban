<template>
  <div class="work-card-back" :class="{'complete': currentWorkCard === false}" @click="pullInCard()">
    <div v-if="currentWorkCard !== false" class="stack-number rounded-circle">
      {{ currentWorkCard + 1 }}
    </div>
    <div v-if="currentWorkCard === false" class="stack-number rounded-circle complete">
      0
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    currentWorkCard() {
      return this.$store.getters.getCurrentWorkCard
    },
    teams() {
      return this.$store.getters.getTeams
    }
  },
  methods: {
    pullInCard() {
      if (this.currentWorkCard !== false) {
        this.socket.emit('pullInCard', {gameName: this.gameName, teamName: this.teamName, teams: this.teams})
      }
    }
  }
}
</script>

<style lang="scss">

  .work-card-back {
    margin: 6px;
    height: 86px;
    background-image: url("../../assets/img/work-card-back.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    box-shadow: 2px 2px 3px #444;

    &:hover {
      cursor: pointer;
    }

    &.complete {
      opacity: 0.5;
    }
    .stack-number {
      width: 20px;
      position: relative;
      top: 58px;
      margin: 0 auto;
      color: #fff;
      background-color: red;

      &.complete {
        color: red;
      }
    }
  }
</style>
