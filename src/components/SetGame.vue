<template>
  <span>

    <button class="btn btn-sm btn-secondary smaller-font" @click="show()">
      Set Up
    </button>

    <modal name="set-up" :height="385" class="rounded">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide()" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Game Set Up</h4>
        <table class="setup-table">

          <!-- Game Name -->

          <tr class="rounded" :class="{ 'error': gameNameError }">
            <td>Game Name: </td>
            <td>
              <div v-if="gameName && !gameNameEditing">{{ gameName }}</div>
              <input v-if="!gameName || gameNameEditing" type="text" id="game-name" class="form-control" :value="gameName">
              <div v-if="gameNameEditing && availableGames.length">
                <select id="available-games" @change="setGameNameFromAvailable()">
                  <option> -- Select -- </option>
                  <option v-for="(game, index) in availableGames" :key="index">{{ game }}</option>
                </select>
              </div>
            </td>
            <td class="button">
              <i v-if="gameName && !gameNameEditing" class="fas fa-edit" @click="changeGameName()" />
            </td>
          </tr>

          <!-- My Name -->

          <tr :class="{ 'error': myNameError }">
            <td>My Name: </td>
            <td>
              <div v-if="myName.id && !myNameEditing" class="my-name">{{ myName.name }}</div>
              <div v-if="!myName.id || myNameEditing" class="my-name-edit">
                <input type="text" id="my-name" class="form-control" :value="myName.name">
              </div>
              <div>
                <input type="checkbox" id="captain" :disabled="!myNameEditing" :checked="myName.captain"> Team Captain?
              </div>
            </td>
            <td class="button">
              <i v-if="myName.id && !myNameEditing" class="fas fa-edit" @click="changeMyName()" />
            </td>
          </tr>

          <!-- Team Name -->

          <tr :class="{ 'error': teamNameError }">
            <td>Team: </td>
            <td>
              <div v-if="teamName && !teamNameEditing">{{ teamName }}</div>
              <select v-if="!teamName || teamNameEditing" :class="{ 'hidden': activeTeams.length == 0}" id="team-name-select" class="form-control">
                <option value=""> -- Select -- </option>
                <option v-for="(team, index) in activeTeams" :key="index" :selected="team.name == teamName">
                  {{ team.name }}
                </option>
              </select>
            </td>
            <td class="button">
              <i v-if="teamName && !teamNameEditing && canRestructure()" class="fas fa-edit" @click="changeTeamName()" />
            </td>
          </tr>

          <!-- Role -->

          <tr :class="{ 'error': myRoleError }">
            <td>My Role: </td>
            <td>
              <div v-if="myRole && !myRoleEditing">{{ myRole }}</div>
              <select v-if="!myRole || myRoleEditing" id="role-select" class="form-control">
                <option value=""> -- Select -- </option>
                <option v-for="(role, index) in roles" :key="index" :selected="role == myRole">
                  {{ role }}
                </option>
              </select>
            </td>
            <td class="button">
              <i v-if="myRole && !myRoleEditing && canRestructure()" class="fas fa-edit" @click="changeMyRole()" />
            </td>
          </tr>
        </table>
        <button class="btn btn-sm btn-primary smaller-font" @click="save()">
          Done
        </button>
      </div>
    </modal>

  </span>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import params from '../lib/params.js'
import stringFuns from '../lib/stringFuns.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      gameNameEditing: false,
      gameNameError: false,
      myNameEditing: false,
      myNameError: false,
      teamNameEditing: false,
      teamNameError: false,
      myRoleEditing: false,
      myRoleError: false
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    capabilities() {
      return this.$store.getters.getCapabilities
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    activeTeams() {
      return this.$store.getters.getActiveTeams
    },
    roles() {
      return this.$store.getters.getRoleNames
    },
    myRole() {
      return this.$store.getters.getMyRole
    },
    currentDay() {
      return this.$store.getters.getCurrentDay
    },
    availableGames() {
      return this.$store.getters.getAvailableGames
    }
  },
  created() {
    this.gameNameEditing = !this.gameName
    this.myNameEditing = !this.myName.id
    this.teamNameEditing = !this.teamName
    this.myRoleEditing = !this.myRole
  },
  methods: {
    show() {
      this.socket.emit('getGames')
      this.$modal.show('set-up')
    },
    hide() {
      this.$modal.hide('set-up')
    },
    reset() {
      this.gameNameEditing = false,
      this.gameNameError = false,
      this.myNameEditing = false,
      this.myNameError = false,
      this.teamNameEditing = false,
      this.teamNameError = false,
      this.myRoleEditing = false,
      this.myRoleError = false
    },
    canRestructure() {
      return this.currentDay == 1 || this.capabilities.recharting
    },
    changeGameName() {
      this.gameNameEditing = true
      this.gameNameError = false
    },
    changeMyName() {
      this.myNameEditing = true
      this.myNameError = false
    },
    changeTeamName() {
      this.teamNameEditing = true
      this.teamNameError = false
    },
    changeMyRole() {
      this.myRoleEditing = true
      this.myRoleError = false
    },
    setGameNameFromAvailable() {
      const name = document.getElementById('available-games').value
      document.getElementById('game-name').value = name
    },
    getGameName() {
      let gameName = ''
      if (document.getElementById('game-name')) {
        gameName = document.getElementById('game-name').value
        gameName = stringFuns.sanitize(gameName)
      } else if (this.gameName) {
        gameName = this.gameName
      }
      return gameName
    },
    getMyName() {
      let myNameData
      if (this.myName && this.myName.id) {
        myNameData = this.myName
      } else {
        const uuid = uuidv4()
        myNameData = {id: uuid, name: '', captain: false}
      }
      myNameData.host = params.isParam('host')
      if (document.getElementById('my-name')) {
        const myName = document.getElementById('my-name').value
        const captain = document.getElementById('captain').checked
        myNameData.name = stringFuns.sanitize(myName)
        myNameData.captain = captain
      }
      return myNameData
    },
    getTeamName() {
      let teamName = ''
      if (document.getElementById('team-name-select')) {
        teamName = document.getElementById('team-name-select').value
      } else {
        teamName = this.teamName
      }
      return teamName
    },
    getMyRole() {
      let myRole = ''
      if (document.getElementById('role-select')) {
        myRole = document.getElementById('role-select').value
      } else {
        myRole = this.myRole
      }
      return myRole
    },
    showErrors(gameName, myName, teamName) {
      if (! gameName || gameName == '') { this.gameNameError = true }
      if (!myName.name || myName.name == '') { this.myNameError = true }
      if (! teamName) { this.teamNameError = true }
    },
    setLocalStorage(gameName, myName, teamName, myRole) {
      console.log('Setting localStorage', gameName, myName, teamName, myRole)
      localStorage.setItem('gameName', gameName)
      localStorage.setItem('myName', JSON.stringify(myName))
      localStorage.setItem('teamName', teamName)
      localStorage.setItem('myRole', myRole)
    },
    save() {
      const oldTeam = this.teamName
      const gameName = this.getGameName()
      const myName = this.getMyName()
      const teamName =  this.getTeamName()
      const myRole = this.getMyRole()
      const data = {
        gameName: gameName,
        teamName: teamName,
        myName: myName,
        myRole: myRole
      }
      if (oldTeam && oldTeam != teamName) {
        data.oldTeam = oldTeam
      }
      this.showErrors(gameName, myName, teamName)
      if (this.gameNameError || this.myNameError || this.teamNameError) {
        alert('Please set all required fields before saving')
      } else {
        this.setLocalStorage(gameName, myName, teamName, myRole)
        this.$store.dispatch('updateGameName', gameName)
        this.$store.dispatch('updateMyName', myName)
        this.$store.dispatch('updateTeamName', teamName)
        this.socket.emit('loadGame', data)
        this.reset()
        this.hide()
      }
    }
  }
}
</script>

<style lang="scss">

  .setup-table {
    margin: 0 auto 20px auto;
    border: 1px solid #ccc;

    td {
      height: 45px;
      border: 1px solid #ccc;

      div {
        padding: 6px;
        text-align: left;

        &.my-name {
        margin-top: 6px;
        margin-bottom: 6px;
        }

        &.my-name-edit {
          padding-bottom: 0;
        }
      }

      &:nth-child(1) {
        padding: 2px 10px;
      }
      &:nth-child(2) {
        width: 200px; ;
      }

      select {
        padding: 0;
      }

      &.button {
        width: 50px;
      }

      .fas {
        color: #888;
        font-size: x-large;

        &:hover {
          cursor: pointer;
          color: #5a6268
        }
      }
    }

    .error {
      background-color: red;
      color: #fff;
    }
  }

</style>
