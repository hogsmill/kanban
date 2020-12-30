<template>
  <div>
    <BarChart :type="'distribution'" />
  </div>
</template>

<script>
import BarChart from './graphs/BarChart.vue'

export default {
  components: {
    BarChart
  }
}
</script>
