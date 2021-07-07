<template>
  <el-container>
    <el-aside width="200px">
      <el-menu :default-openeds="['1', '2', '3']">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>Pages
          </template>
          <el-menu-item index="1-1" @click="link('/dashboard/pages')"
            >Manage Pages</el-menu-item
          >
          <el-menu-item index="1-2" @click="link('/dashboard/pages/create')"
            >Create Page</el-menu-item
          >
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"
            ><i class="el-icon-user"></i>Information</template
          >
          <el-menu-item index="2-1">Home</el-menu-item>
          <el-menu-item index="2-2">About</el-menu-item>
          <el-menu-item index="2-3">FAQs</el-menu-item>
        </el-submenu>
        <el-submenu v-if="authUser" index="3">
          <template slot="title"><i class="el-icon-user"></i>User</template>
          <el-menu-item index="3-1" @click="logOut">Log Out</el-menu-item>
        </el-submenu>

        <NuxtLink
          v-else
          to="/dashboard/login"
          tag="li"
          role="menuitem"
          tabindex="-1"
          class="el-menu-item"
        >
          Login
        </NuxtLink>
      </el-menu>
    </el-aside>

    <el-main>
      <Nuxt />
    </el-main>
  </el-container>
</template>

<script>
// import firebase from 'firebase/app'
// import 'firebase/auth'
import { mapState } from 'vuex'

export default {
  middleware: 'auth',
  computed: {
    ...mapState({
      authUser: (state) => state.authUser,
    }),
  },
  methods: {
    async logOut() {
      try {
        await this.$fire.auth.signOut()
        this.$router.push('/')
      } catch (e) {
        alert(e)
      }
    },
    link(route) {
      this.$router.push(route)
    },
  },
}
</script>

<style>
body,
html,
#__nuxt,
#__layout {
  height: 100%;
}

.el-main {
  overflow-x: auto;
  overflow-y: inherit;
}
</style>
