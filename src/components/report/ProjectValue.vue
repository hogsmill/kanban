<template>
  <span class="current-value">Current Project Value: {{ currencyLabel() }}{{ total() }}</span>
</template>

<script>
import stringFuns from '../../lib/stringFuns.js'

export default {
  computed: {
    currency() {
      return this.$store.getters.getCurrency
    },
    workCards() {
      return this.$store.getters.getWorkCards
    }
  },
  methods: {
    currencyLabel() {
      return stringFuns.htmlDecode(this.currency)
    },
    total() {
      let total = 0
      for (let i = 0; i < this.workCards.length; i++) {
        if (this.workCards[i].value) {
          total += this.workCards[i].value
        }
      }
      return total
    }
  }
}
</script>
