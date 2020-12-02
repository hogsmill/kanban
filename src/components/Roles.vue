<template>
  <div>
    <table class="roles">
      <tr>
        <td class="role" :class="role.role.toLowerCase()" v-for="(role, index) in roles" :key="index">
          <div v-for="(name, m) in roles[index].names" :key="'name-' + m">
            <div v-if="!(name.host && stealth)" :class="{ 'me': name.id == myName.id }">
              {{ name.name }}
              <span v-if="name.captain" class="captain">&#9733;</span>
              <span>({{ name.effort ? name.effort.available : '?' }})</span>
            </div>
          </div>
          <div v-for="(otherName, n) in roles[index].otherNames" :key="'otherName-' + n">
            (<i>{{ otherName.name }}</i>)
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    stealth() {
      return this.$store.getters.getStealth
    },
    myName() {
      return this.$store.getters.getMyName
    },
    roles() {
      return this.$store.getters.getRoles
    }
  }
}
</script>

<style lang="scss">

  table.roles {
    margin-bottom: 12px;
    width: 90%;
    text-align: center;
    width: 100%;
    font-weight: bold;

    td {
      vertical-align: top;
    }
  }

  .role {
    background-color: #fff;
    color: #444;
    display: inline-block;
    padding-top: 76px;
    width: 105px;
    margin: 0 6px;
    background-repeat: no-repeat;
    background-size: contain;
    box-shadow: 2px 2px 3px #444;

    &.designer {
      background-image: url("../assets/img/designer.png");
    }
    &.developer {
      background-image: url("../assets/img/developer.png");
    }
    &.tester {
      background-image: url("../assets/img/tester.png");
    }
    &.deployer {
      background-image: url("../assets/img/deployer.png");
    }

    .me {
      background-color: #888;
      color: #fff;
    }

    .captain {
      color: darkorange;
    }
  }

</style>
