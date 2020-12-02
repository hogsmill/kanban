<template>
  <div class="other-skills">
    <div class="other-skills-header">
      Other Skills
    </div>
    <p><i>5 days not your speciality = 1:1 effort</i></p>
    <div v-for="(pairday, index) in pairing" :key="index">
      <div v-if="pairday.name.id == myName.id">
        <div v-for="(column, col) in pairday.columns" :key="col" class="other-skill">
          <div v-if="column.days.length < 5">
            <div class="skill">
              {{ columnName(column.column) }}
            </div>
            <div class="skill-circles">
              <div v-for="n in 5" :key="n" :class="{'done' : n <= column.days.length}" class="skill-circle rounded-circle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stringFuns from '../../lib/stringFuns.js'

export default {
  computed: {
    myName() {
      return this.$store.getters.getMyName
    },
    pairing() {
      return this.$store.getters.getPairing
    },
  },
  methods: {
    columnName(col) {
      return stringFuns.properCase(col)
    }
  }
}
</script>

<style lang="scss">

   $skill-circle-done: #fff;

  .other-skills {

    p {
      font-size: smaller;
    }

    .other-skills-header {
      font-weight: bold;
      width: 100%;
      margin-top: 20px;
    }

    .other-skill {
      text-align: left;
      width: 84%;
      margin: 0 auto;

      .skill {
        width: 64px;
        display: inline-block;
      }

      .skill-circles {
        display: inline-block;

        .skill-circle {
          display: inline-block;
          border: 1px solid #ddd;
          margin-left: 1px;
          width: 8px;
          height: 8px;
          font-size: 8px;
          padding-left: 2px;

          &.done {
            background-color: $skill-circle-done;
            border-color: $skill-circle-done;
          }
        }
      }
    }
  }

</style>
