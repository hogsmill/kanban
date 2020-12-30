<script>
import { Scatter } from 'vue-chartjs'

export default {
  extends: Scatter,
  computed: {
    scatterPlot() {
      return this.$store.getters.getScatterPlot
    }
  },
  mounted() {
    this.renderChart(this.scatterPlot.data, this.scatterPlot.options)
  }
}
</script>
