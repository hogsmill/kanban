<template>
  <div class="statistics">
    <button class="btn btn-sm btn-site-primary" @click="show()">
      Statistics
    </button>

    <modal class="statistics-modal" name="statistics-modal" :height="580" :width="750" :classes="['rounded']">
      <div class="text-right">
        <span @click="hide" class="glyphicon glyphicon-star">x</span>
      </div>
      <div class="mt-4">
        <h4>
          Statistics
        </h4>
        <div class="tabs">
          <div class="tab" :class="{ 'selected': statistic == 'correlation' }" @click="showStatistic('correlation')">
            Correlation
          </div>
          <div class="tab" :class="{ 'selected': statistic == 'cycle-time' }" @click="showStatistic('cycle-time')">
            Cycle Time
          </div>
          <div class="tab" :class="{ 'selected': statistic == 'distribution' }" @click="showStatistic('distribution')">
            Distribution
          </div>
          <div class="tab" :class="{ 'selected': statistic == 'scatter-plot' }" @click="showStatistic('scatter-plot')">
            Scatter Plot
          </div>
          <div class="tab" :class="{ 'selected': statistic == 'monte-carlo' }" @click="showStatistic('monte-carlo')">
            Monte Carlo
          </div>
        </div>
        <Correlation v-if="statistic == 'correlation'" />
        <CycleTime v-if="statistic == 'cycle-time'" />
        <Distribution v-if="statistic == 'distribution'" />
        <ScatterPlot v-if="statistic == 'scatter-plot'" />
        <MonteCarlo v-if="statistic == 'monte-carlo'" />
      </div>
    </modal>
  </div>
</template>

<script>
import bus from '../socket.js'

import Correlation from './statistics/Correlation.vue'
import CycleTime from './statistics/CycleTime.vue'
import Distribution from './statistics/Distribution.vue'
import ScatterPlot from './statistics/ScatterPlot.vue'
import MonteCarlo from './statistics/MonteCarlo.vue'

export default {
  components: {
    Correlation,
    CycleTime,
    Distribution,
    ScatterPlot,
    MonteCarlo
  },
  data() {
    return {
      statistic: 'correlation'
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    cycleTime() {
      return this.$store.getters.getCycleTime
    },
    distribution() {
      return this.$store.getters.getDistribution
    },
    scatterPlot() {
      return this.$store.getters.getScatterPlot
    },
    monteCarlo() {
      return this.$store.getters.getMonteCarlo
    }
  },
  created() {
    this.getStatistics()

    bus.$on('updateStatistic', (data) => {
      if (this.gameName == data.gameName && this.teamName == data.teamName) {
        switch(data.statistic) {
          case 'correlation':
            this.updateCorrelation(data)
            break
          case 'cycle-time':
            this.updateCycleTime(data)
            break
          case 'distribution':
            this.updateDistribution(data)
            break
          case 'scatter-plot':
            this.updateScatterPlot(data)
            break
          case 'monte-carlo':
            this.updateMonteCarlo(data)
            break
        }
      }
    })
  },
  methods: {
    show() {
      this.getStatistics()
      this.$modal.show('statistics-modal')
    },
    hide() {
      this.$modal.hide('statistics-modal')
    },
    getStatistics() {
      bus.$emit('sendUpdateStatistic', {gameName: this.gameName, teamName: this.teamName, statistic: 'correlation'})
      bus.$emit('sendUpdateStatistic', {gameName: this.gameName, teamName: this.teamName, statistic: 'cycle-time'})
      bus.$emit('sendUpdateStatistic', {gameName: this.gameName, teamName: this.teamName, statistic: 'distribution'})
      bus.$emit('sendUpdateStatistic', {gameName: this.gameName, teamName: this.teamName, statistic: 'scatter-plot'})
      bus.$emit('sendUpdateStatistic', {gameName: this.gameName, teamName: this.teamName, statistic: 'monte-carlo'})
    },
    showStatistic(statistic) {
      this.statistic = statistic
    },
    updateCorrelation(data) {
      this.$store.dispatch('updateStatistic', {statistic: 'correlation', data: parseFloat(data.results)})
    },
    updateCycleTime(data) {
      const cycleTime = this.cycleTime
      cycleTime.data.datasets[0].backgroundColor = []
      for (let i = 0; i < data.results.effort.length; i++) {
        if (data.results.effort[i] < 15) {
          cycleTime.data.datasets[0].backgroundColor.push('cadetblue')
        } else if (data.results.effort[i] < 20) {
          cycleTime.data.datasets[0].backgroundColor.push('olive')
        } else {
          cycleTime.data.datasets[0].backgroundColor.push('darkorange')
        }
      }
      cycleTime.data.labels = data.results.ids
      cycleTime.data.datasets[0].data = data.results.days
      this.$store.dispatch('updateStatistic', {statistic: 'cycleTime', data: cycleTime})
    },
    updateDistribution(data) {
      const distribution = this.distribution
      distribution.data.labels = data.results.days
      distribution.data.datasets[0].data = data.results.counts
      this.$store.dispatch('updateStatistic', {statistic: 'distribution', data: distribution})
    },
    updateScatterPlot(data) {
      const scatterPlot = this.scatterPlot
      scatterPlot.data.datasets[0].data = data.results
      scatterPlot.limits = data.limits
      this.$store.dispatch('updateStatistic', {statistic: 'scatterPlot', data: scatterPlot})
    },
    updateMonteCarlo(data) {
      const monteCarlo = this.monteCarlo
      monteCarlo.data.labels = data.results.days
      monteCarlo.data.datasets[0].data = data.results.counts
      monteCarlo.percentiles = data.results.percentiles
      monteCarlo.data.datasets[0].backgroundColor = []
      const startDay = monteCarlo.data.labels[0]
      for (let i = startDay; i < monteCarlo.data.datasets[0].data.length + startDay; i++) {
        if (i <= data.results.percentiles[75]) {
          monteCarlo.data.datasets[0].backgroundColor.push('green')
        } else if (i <= data.results.percentiles[90]) {
          monteCarlo.data.datasets[0].backgroundColor.push('orange')
        } else if (i <= data.results.percentiles[95]) {
          monteCarlo.data.datasets[0].backgroundColor.push('yellow')
        } else {
          monteCarlo.data.datasets[0].backgroundColor.push('red')
        }
      }
      this.$store.dispatch('updateStatistic', {statistic: 'monteCarlo', data: monteCarlo})
    }
  }
}
</script>

<style lang="scss">

  $orange: #f4511e;

  .statistics-modal {

     h4 {
       text-align: center;
     }

    .tabs {
      border-bottom: 1px solid $orange;
      position: relative;
      margin-bottom: 4px;
      padding-left: 6px;

      .tab {
         width: 100px;
         padding: 4px;
         display: inline-block;
         text-align: center;
         background-color: #fff;
         position: relative;
         top: 1px;
         border-bottom: 1px solid $orange;

         &.selected {
           color: #fff;
           background-color: $orange;
           border-top: 1px solid;
           border-left: 1px solid;
           border-right: 1px solid;
           border-bottom: 1px solid $orange;

        }
      }
    }
  }

</style>
