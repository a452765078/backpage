<template>
  <div>
    <home-vue v-if="curPath!=='/login'"></home-vue>
    <login-vue v-else></login-vue>
  </div>

</template>
<script>
import homeVue from './views/home.vue';
import loginVue from './views/login.vue';
export default {
  name: 'App',
  components: {
    homeVue,
    loginVue
  },
  computed: {
    curPath() {
      return this.$route.path
    }
  },  
  mounted() {

  }
}
</script>
<style lang="scss">
@import url('./assets/reset.scss');
</style>
