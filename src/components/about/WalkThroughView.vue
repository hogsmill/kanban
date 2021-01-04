<template>
  <div>
    <button
      v-if="walkThrough && !showFacilitator"
      class="btn btn-sm btn-info explain"
      @click="help"
    >
      Explain this for me...
    </button>
    <modal name="walk-through" id="walk-through" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4" v-if="step == 1">
        <h4>Welcome to the Kanban Playground</h4>
        <div>
          <div class="under-construction">
            <i class="fas fa-tools" />
          </div>
          <p>
            This activity is under construction, but feel free to have a play and give us
            feedback to help the future direction. It is very much based on the
            <a href="../no-estimates?walkThrough">No Estimates</a> game, so if you are
            familiar with that, this should make some sense.
          </p>
          <p>
            If you'd like to be kept up to date with progress, or have any feedback, send us your email
            in the box below, and we can discuss your needs.
          </p>
          <div>
            Email: <input type="email" id="email" placeholder="Email address">
            <button class="btn btn-info btn-sm" @click="facilitate()">
              Submit
            </button>
          </div>
        </div>
      </div>
      <div class="mt-4" v-if="step == 2">
        <h4>Welcome to the Kanban Playground</h4>
        <div>
          <p>
            To see what the game can do, just add <b>?host</b> to the end of the
            URL, i.e. <a href="http://agilesimulations.co.uk/kanban/?host">http://agilesimulations.co.uk/kanban/?host</a>
            and go to the facilitator tab. There, you can set all kinds of things like:
          </p>
          <ul>
            <li>Number and order of columns</li>
            <li>Whether to use WIP limits and whether they are 'hard'</li>
            <li>Whether to have split columns</li>
            <li>Number of teams (<em>to simulate dependencies...</em>)</li>
          </ul>
          <p>
            ...etc., etc.
          </p>
          <p>
            Please give us feedback on what features you'd like to see - the idea is
            to provide everything you might need so you can explore the effect of
            different set ups and policies on the efficiency of your Kanban boards.
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 3">
        <h4>Welcome to the Kanban Playground</h4>
        <div>
          <p>
            To get started...
          </p>
          <p>Click <b>Set Up</b> to set up a game. You can play as a single team or
            multiple teams - just set up in <b>Facilitator</b> once you've created
            your game.
          </p>
          <p>
            To play the game, just click on the card stack in <b>Backlog</b>, and
            start playing. Every member has 4 units of efort per day.
          </p>
          <p>
            Click the <b>Statistics</b> button when you've completed
            some cards to see analyses of how you're doing.
          </p>
        </div>
      </div>
      <div class="buttons" v-if="step < noOfScreens()">
        <button class="btn btn-info" @click="incrementStep">
          Next
        </button>
        <button class="btn btn-info" @click="hide()">
          Skip
        </button>
      </div>
      <div class="buttons" v-if="step == noOfScreens()">
        <button class="btn btn-info" @click="hide()">
          Play Game
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import mailFuns from '../../lib/mail.js'
import params from '../../lib/params.js'

export default {
  data() {
    return {
      step: 1,
      default: { width: 650, height: 260 },
      positions: {
        1: {},
        2: {},
        3: {}
      }
    }
  },
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    }
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough') || params.isParam('walkThrough')) {
      self.$store.dispatch('updateWalkThrough', true)
      self.$modal.show('walk-through')
    }
  },
  methods: {
    noOfScreens() {
      return Object.keys(this.positions).length
    },
    setDefault() {
      const elem = document.getElementsByClassName('vm--modal')[0].getBoundingClientRect()
      this.default = {
        top: elem.top,
        left: elem.left,
        width: elem.width,
        height: elem.height
      }
    },
    show() {
      this.$modal.show('walk-through')
    },
    hide() {
      this.$modal.hide('walk-through')
    },
    help() {
      this.step = 1
      this.show()
    },
    incrementStep() {
      if (this.step == 1) {
        this.setDefault()
      }
      this.step = this.step + 1
      const elem = document.getElementsByClassName('vm--modal')[0]
      let target, positions = {}
      if (this.positions[this.step].target) {
        target = document.getElementById(this.positions[this.step].target)
        target = target.getBoundingClientRect()
        positions.left = target.left + 30
        positions.top = target.top + 30
      } else {
        positions = this.default
      }
      if (this.positions[this.step].width) {
        positions.width = this.positions[this.step].width
      }
      if (this.positions[this.step].height) {
        positions.height = this.positions[this.step].height
      }
      elem.style.left = positions.left + 'px'
      elem.style.top = positions.top + 'px'
      elem.style.width = positions.width + 'px'
      elem.style.height = positions.height +'px'
    },
    facilitate() {
      mailFuns.post({
        action: 'Facilitation request from ' + this.thisGame,
        email: encodeURIComponent(document.getElementById('email').value),
        comments: 'Facilitation Request'
        },
        'Thanks for your request - we\'ll get back to you as soon as we can with details'
      )
    }
  },
}
</script>

<style lang="scss">

  .buttons {
    padding: 24px 0 6px 0;
  }

  .explain {
    margin-bottom: 6px;
  }

  #email {
    width: 50%;
    margin: 6px;
  }

  #walk-through {

    .vm--modal {
      height: 460px !important;
    }

    p {
      margin-left: 12px;
      margin-right: 12px;
      text-align: left;
    }

    .under-construction {
      width: 80px;
      height: 80px;
      border-radius: 40px;
      border: 6px solid;
      margin: 12px auto;
      background-color: yellow;

      .fas {
        font-size: xxx-large;
        margin-top: 9px;
      }
    }

    ul {
      margin: 12px;

      li {
        text-align: left;
      }
    }
 }

</style>
