<template>
  <div class="board-column" :class="'column-' + column.type">
    <h6 v-if="column.type == 'doing'">Doing</h6>
    <h6 v-if="column.type == 'done'">Done</h6>
    <AutoDeploy v-if="showAutoDeploy(column)" :socket="socket" />
    <div v-for="(card, index) in column.cards" :key="index">
      <WorkCard v-if="showCard(column, card)" :column="column" :work-card="card" :socket="socket" :complete="cardComplete(card, column.name)" />
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
    'column',
    'socket'
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
    },
    splitColumns() {
      return this.$store.getters.getSplitColumns
    }
  },
  methods: {
    showAutoDeploy(column) {
      return this.teamName && this.capabilities.autoDeploy.doing && column.name == 'deploy'
    },
    cardComplete(card, column) {
      return card.effort[column] == card[column]
    },
    showCard(column, card) {
      let show = true
      if (this.splitColumns) {
        const complete = this.cardComplete(card, column.name)
        if (column.type == 'doing') {
          show = !complete
        }
        if (column.type == 'done') {
          show = complete
        }
      }
      return show
    }
  },
}
</script>

<style lang="scss">
  .game-board {

    .board-column {
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
</style>
