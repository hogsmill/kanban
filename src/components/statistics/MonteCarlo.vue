<template>
  <div class="monte-carlo">
    <div class="monte-carlo-percentiles rounded">
      The probability of completing {{ graphConfig.monteCarlo.cards }} cards is
      <ul>
        <li><div class="grey" /> 5o% in {{ monteCarlo.percentiles[50] }} days </li>
        <li><div class="green" /> 75% in {{ monteCarlo.percentiles[75] }} days </li>
        <li><div class="orange" /> 90% in {{ monteCarlo.percentiles[90] }} days </li>
        <li><div class="yellow" /> 95% in {{ monteCarlo.percentiles[95] }} days </li>
        <li><div class="red" /> 99% in {{ monteCarlo.percentiles[99] }} days </li>
      </ul>
    </div>
    <div>
      <BarChart :type="'monte-carlo'" />
    </div>
  </div>
</template>

<script>
import BarChart from './graphs/BarChart.vue'

export default {
  components: {
    BarChart
  },
  computed: {
    monteCarlo() {
      return this.$store.getters.getMonteCarlo
    },
    graphConfig() {
      return this.$store.getters.getGraphConfig
    }
  }
}
</script>

<style lang="scss">
.monte-carlo-percentiles {
  border: 1px solid #ddd;
  width: 300px;
  position: absolute;
  z-index: 10;
  background-color: #fff;
  left: 54px;
  top: 148px;
  box-shadow: 2px 2px 3px #aaa;

  li {
    text-align: left;

    div {
      height: 10px;
      width: 10px;
      display: inline-block;

      &.grey {
        background-color: #bbb;
      }
      &.green {
        background-color: green;
      }
      &.orange {
        background-color: orange;
      }
      &.yellow {
        background-color: yellow;
      }
      &.red {
        background-color: red;
      }
    }
  }
}
</style>
