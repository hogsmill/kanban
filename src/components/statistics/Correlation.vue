<template>
  <div class="correlation">
    <p>
      Correlation between Effort and Delivery Time:
    </p>
    <div class="correlation-labels">
      <div class="positive-correlation">
        Perfect correlation
      </div>
      <div class="negative-correlation">
        Perfect negative correlation
      </div>
      <div class="no-correlation">
        No correlation
      </div>
    </div>
    <div class="correlation-holder">
      <div class="correlation-label">
        -1
      </div>
      <div class="correlation-div rounded">
        <div :style="{ 'left': correlationPosition(correlation) }">
          {{ correlation }}
        </div>
      </div>
      <div class="correlation-label">
        +1
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    correlation() {
      return this.$store.getters.getCorrelation
    }
  },
  methods: {
    correlationPosition(value) {
      return parseInt(290 * (value + 1)) - 290 + 'px'
    }
  }
}
</script>

<style lang="scss">
  .correlation {
    text-align: center;

    .correlation-labels {
      width: 640px;
      height: 24px;
      margin: 48px auto 0 auto;

      div {
        width: 200px;
        font-weight: bold;
      }
      .negative-correlation {
        text-align: left;
        float: left;
      }
      .no-correlation {
        text-align: center;
        margin: 0 auto;
      }
      .positive-correlation {
        text-align: right;
        float: right;
      }
    }
    .correlation-holder {
      div {
        display: inline-block;
      }
      .correlation-label {
        width: 20px;
        text-align: center;
        position: relative;
        top: -8px;
      }
      .correlation-div {
        width: 600px;
        margin: 0 auto;
        position: relative;
        background: rgb(245,39,13);
        background: linear-gradient(90deg, rgba(245,39,13,1) 0%, rgba(100,210,12,1) 100%);

        div {
          position: relative;
          width: 20px;
          text-align: center;
          font-size: xx-large;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
</style>
