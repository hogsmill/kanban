<template>
  <table class="estimates">
    <tr>
      <td>Days to complete the entire project: </td>
      <td>
        <input v-if="!projectEstimate || editingEstimate" type="text" id="project-estimate" class="form-control" :value="projectEstimate">
        <span v-if="projectEstimate && !editingEstimate"><b>{{ projectEstimate }}</b></span>
      </td>
      <td>
        <button v-if="!projectEstimate || editingEstimate" class="btn btn-sm btn-site-primary" :disabled="!gameName || !teamName" @click="saveEstimate">
          Save
        </button>
        <button v-if="projectEstimate && !editingEstimate && currentDay < 2" class="btn btn-sm btn-site-primary" :disabled="!gameName || !teamName" @click="editEstimate">
          Change
        </button>
      </td>
      <td>
        <span v-if="!projectActual">Actual: TBD</span>
        <span v-if="projectEstimate && projectActual">Actual: <b>{{ projectActual }}</b></span>
      </td>
    </tr>
    <tr>
      <td>Days to complete the MVP (Cards 1-{{ mvpCards }}): </td>
      <td>
        <input v-if="!mvpEstimate || editingMVP" type="text" id="mvp-estimate" class="form-control" :value="mvpEstimate">
        <span v-if="mvpEstimate && !editingMVP"><b>{{ mvpEstimate }}</b></span>
      </td>
      <td>
        <button v-if="!mvpEstimate || editingMVP" class="btn btn-sm btn-site-primary" @click="saveMVP()">
          Save
        </button>
        <button v-if="mvpEstimate && !editingMVP && currentWorkCard < mvpCards" class="btn btn-sm btn-site-primary" @click="editMVP()">
          Change
        </button>
      </td>
      <td>
        <span v-if="!mvpActual">Actual: TBD</span>
        <span v-if="mvpEstimate && mvpActual">Actual: <b>{{ mvpActual }}</b></span>
      </td>
    </tr>
    <tr>
      <td>Re-estimate of days to <br> complete the entire project: </td>
      <td>
        <input v-if="!reEstimate || editingReEstimate" type="text" id="re-estimate" class="form-control" :value="reEstimate">
        <span v-if="reEstimate && !editingReEstimate"><b>{{ reEstimate }}</b></span>
      </td>
      <td>
        <button v-if="!reEstimate || editingReEstimate" class="btn btn-sm btn-site-primary" @click="saveReEstimate">
          Save
        </button>
        <button v-if="reEstimate && !editingReEstimate" class="btn btn-sm btn-site-primary" @click="editReEstimate">
          Change
        </button>
      </td>
      <td>
        <span v-if="reEstimate && !projectActual">Actual: TBD</span>
        <span v-if="reEstimate && projectActual">Actual: <b>{{ projectActual }}</b></span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      editingEstimate: false,
      editingMVP: false,
      editingReEstimate: false,
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    projectEstimate() {
      return this.$store.getters.getProjectEstimate
    },
    projectActual() {
      return this.$store.getters.getProjectActual
    },
    mvpCards() {
      return this.$store.getters.getMvpCards
    },
    mvpEstimate() {
      return this.$store.getters.getMvpEstimate
    },
    mvpActual() {
      return this.$store.getters.getMvpActual
    },
    reEstimate() {
      return this.$store.getters.getReEstimate
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    currentWorkCard() {
      return this.$store.getters.getCurrentWorkCard
    },
  },
  methods: {
    editEstimate() {
      this.editingEstimate = true
    },
    saveEstimate() {
      const estimate = document.getElementById('project-estimate').value
      this.socket.emit('updateProjectEstimate', {gameName: this.gameName, teamName: this.teamName, projectEstimate: estimate})
      this.editingEstimate = false
    },
    editMVP() {
      this.editingMVP = true
    },
    saveMVP() {
      const estimate = document.getElementById('mvp-estimate').value
      this.socket.emit('updateMVPEstimate', {gameName: this.gameName, teamName: this.teamName, mvpEstimate: estimate})
      this.editingMVP = false
    },
    editReEstimate() {
      this.editingReEstimate = true
    },
    saveReEstimate() {
      const estimate = document.getElementById('re-estimate').value
      this.socket.emit('updateReEstimate', {gameName: this.gameName, teamName: this.teamName, reEstimate: estimate})
      this.editingReEstimate = false
    }
  }
}
</script>

<style lang="scss">
  .estimates {
    width: 90%;
    margin: 0 auto;
    span {
      height: 36px;
      line-height: 36px;
    }
  }
</style>
