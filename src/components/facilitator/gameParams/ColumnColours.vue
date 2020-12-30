<template>
  <select :id="id">
    <option value="">
      -- Select --
    </option>
    <option v-for="(colour, index) in colours" :key="index" :selected="column && column.colour == colour">
      {{ colour }}
    </option>
  </select>
</template>

<script>
export default {
  props: [
    'column',
    'id'
  ],
  computed: {
    colours() {
      return this.$store.getters.getColours
    }
  }
}
</script>
