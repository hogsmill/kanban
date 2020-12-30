<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: [
    'type'
  ],
  computed: {
    cycleTime() {
      return this.$store.getters.getCycleTime
    },
    distribution() {
      return this.$store.getters.getDistribution
    }
  },
  mounted() {
    switch(this.type) {
      case 'cycle-time':
        this.renderChart(this.cycleTime.data, this.cycleTime.options)
        break
      case 'distribution':
        this.renderChart(this.distribution.data, this.distribution.options)
        break
    }
  }
}
</script>
