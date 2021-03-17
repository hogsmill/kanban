<template>
  <div class="connections">
    Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
  </div>
</template>

<script>
export default {
  computed: {
    connections() {
      return this.$store.getters.getConnections
    }
  }
}
</script>

<style lang="scss">
  .connections {
    text-align: right;
  }
</style>
