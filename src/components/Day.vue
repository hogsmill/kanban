<template>
  <div class="card-deck">
    <div class="row days">
      <div class="days">
        <div class="days-label">
          Day
        </div>
        <span class="passed" v-if="days()[0] > 1"> . . . </span>
        <div class="day rounded-circle" :class="getClass(day)" v-for="(day, index) in days()" :key="index">
          {{ day }}
        </div>
        <span> . . . </span>
        <button class="btn btn-sm btn-info next" @click="next()">
          Next
        </button>
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
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    columns() {
      return this.$store.getters.getColumns
    }
  },
  methods: {
    getClass(day) {
      if (day < this.currentDay) {
        return 'passed'
      } else if (day == this.currentDay) {
        return 'current'
      }
    },
    days() {
      const days = []
      const range = 15
      const startDay = Math.max(1, this.currentDay - range)
      const endDay = Math.max(30, this.currentDay + range)
      for (let i = startDay; i <= endDay; i++) {
        days.push(i)
      }
      return days
    },
    next() {
      this.socket.emit('showEventCard', {gameName: this.gameName, teamName: this.teamName})
    }
  }
}
</script>

<style lang="scss">
  .days {
    text-align: center;
    width: 100%;
    font-weight: bold;
    margin-bottom: 4px;

    .passed {
      opacity: 0.25;
    }
  }

  .days-label {
    display: inline;
    padding-right: 12px;
    color: #fff;
  }

  .day {
    display: inline-block;
    width: 20px;

    &.current {
      background-color: #fff;
      color: blue;
    }

    button {
      margin: 4px;
    }
  }

  .next {
    margin-left: 12px;
  }

</style>
