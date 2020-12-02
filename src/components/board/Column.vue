<template>
  <div>
    <AutoDeploy v-if="showAutoDeploy(column)" :socket="socket" />
    <div v-for="(card, index) in column.cards" :key="index">
      <WorkCard :column="column.name" :work-card="card" :socket="socket" />
    </div>
  </div>
</template>

<script>
import WorkCard from './WorkCard.vue'
import AutoDeploy from './AutoDeploy.vue'

export default {
  components: {
    WorkCard,
    AutoDeploy
  },
  props: [
    'column', 'socket'
  ],
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    capabilities() {
      return this.$store.getters.getCapabilities
    }
  },
  methods: {
    showAutoDeploy(column) {
      return this.teamName && this.capabilities.autoDeploy.doing && column.name == 'deploy'
    }
  },
}
</script>

<style lang="scss">

  @import '../../assets/colours.scss';

  .game-board {

    .col {
      width: 130px;
    }

    .row {
      text-align: center;

      &.header {
        text-align: center;
        padding: 4px;
      }
    }
  }

  .options {
    background-color: navy;

    div {
      border: 1px solid;
      display: block;
    }
  }

  .design {
    background-color: $design;
  }
  .develop {
    background-color: $develop;
  }
  .test {
    background-color: $test;
  }
  .deploy {
    background-color: $deploy;
  }
  .done {
    background-color: $done;
  }
</style>
