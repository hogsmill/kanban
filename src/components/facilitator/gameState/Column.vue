<template>
  <td class="game-state-column">
    <div>{{ name }}</div>
    <div class="cards-header">
      <div class="count">
        {{ column.length }}
      </div>
      <i v-if="!showCards" @click="setShowCards(true)" title="expand" class="fas fa-caret-down toggle" />
      <i v-if="showCards" @click="setShowCards(false)" title="collapse" class="fas fa-caret-up toggle" />
    </div>
    <div v-if="showCards">
      <div class="column-card" :class="{'blocked': card.blocked}" v-for="(card, index) in column" :key="index">
        <div v-if="card.urgent" class="urgent">
          URGENT
        </div>
        <div class="card-number">
          #{{ card.number }}
        </div>
        <div>{{ card.effort.done }} / {{ card.effort.effort }}</div>
        <div v-if="card.dependentOn" class="dependent-on" :style="{'background-color': card.dependentOn.team.toLowerCase()}">
          {{ card.dependentOn.done }} / {{ card.dependentOn.effort }}
        </div>
        <div v-if="card.commit" class="delivered">
          C: {{ card.commit }}
        </div>
        <div v-if="card.delivered" class="delivered">
          D: {{ card.delivered }}
        </div>
      </div>
    </div>
  </td>
</template>

<script>
export default {
  props: [
    'column', 'name'
  ],
  data() {
    return {
      showCards: false
    }
  },
  methods: {
    setShowCards(val) {
      this.showCards = val
    }
  }
}
</script>

<style lang="scss">

  .game-state-column {

    .cards-header {
      position: relative;
      height: 20px;

      .count {
        width: 40%;
        position: absolute;
        left: 0;
      }
      .toggle {
        width: 40%;
        position: absolute;
        right: 0;
        font-size: large;
      }
    }

    .column-card {
      margin: 2px;
      border: 1px solid #888;
      min-width: 40px;

      &.blocked {
        background-color: #ffe6e6;
      }

      .card-number {
        font-weight: bold;
        text-align: left;
      }

      .urgent {
        background-color: red;
        color: #fff;
        font-weight: bold;
        font-size: xx-small;
      }

      .dependent-on {
        color: #fff;
        font-weight: bold;
        font-size: xx-small;
      }

      .delivered {
        font-size: xx-small;
      }
    }
  }

</style>
