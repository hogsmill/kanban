<template>
  <td>
    <div class="column-other-card" v-for="(card, index) in cards" :key="index">
      <div class="card-number" :style="{ 'background-color': card.team.toLowerCase()}">
        #{{ card.number }}
      </div>
      <div>{{ card.dependencyDone }} / {{ card.teamDependency }}</div>
    </div>
  </td>
</template>

<script>
export default {
  props: [
    'cards'
  ]
}
</script>

<style lang="scss">

.column-other-card {
  margin: 2px;
  border: 1px solid #888;
  min-width: 40px;

  .card-number {
    color: #fff;
    text-align: left;
    font-weight: bold;
  }
}

</style>
