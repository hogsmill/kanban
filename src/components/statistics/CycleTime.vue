<template>
  <div class="cycle-time">
    <table>
      <tr>
        <td>Small: </td>
        <td class="small" />
        <td>Medium: </td>
        <td class="medium" />
        <td>Large: </td>
        <td class="large" />
      </tr>
    </table>
    <div>
      <BarChart :type="'cycle-time'" />
    </div>
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

<style lang="scss">

  .cycle-time {
    table {
      width: 50%;
      margin: 0 auto;
      td {
        width: 50px;
        text-align: right;
        padding: 0 4px;
        &.small {
          background-color: cadetblue;
        }
        &.medium {
          background-color: olive;
        }
        &.large {
          background-color: darkorange;
        }
      }
    }
  }

</style>
