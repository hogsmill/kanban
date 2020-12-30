<template>
  <div class="scatter-plot">
    <p>
      75% of cards completed in {{ scatterPlot.limits[75] }} days,
      90% in {{ scatterPlot.limits[90] }} days,
      95% in {{ scatterPlot.limits[95] }} days and
      99% in {{ scatterPlot.limits[99] }} days
    </p>
    <div>
      <ScatterPlot />
    </div>
  </div>
</template>

<script>
import ScatterPlot from './graphs/ScatterPlot.vue'

export default {
  components: {
    ScatterPlot
  },
  computed: {
    scatterPlot() {
      return this.$store.getters.getScatterPlot
    }
  }
}
</script>

<style lang="scss">
  .scatter-plot {
    p {
      text-align: center;
    }
  }
</style>
