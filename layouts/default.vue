<template>
  <el-container style="min-height: 100vh">
    <el-aside :is="isMobile ? 'el-header' : 'el-aside'">
      <el-menu
        style="height: 100%"
        :mode="isMobile ? 'horizontal' : 'vertical'"
      >
        {{ $mq }}
        <router-link to="/" custom v-slot="{ isExactActive, navigate }">
          <el-menu-item
            @click="navigate"
            index="home"
            :class="{ 'is-active': isExactActive }"
          >
            <i class="el-icon-house"></i>
            <span slot="title">Home</span>
          </el-menu-item>
        </router-link>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">Portfolio</span>
          </template>
          <router-link
            v-for="page in latestPages"
            :key="page.slug"
            :to="`/page/${page.slug}`"
            custom
            v-slot="{ isExactActive, navigate }"
          >
            <el-menu-item
              :class="{ 'is-active': isExactActive }"
              @click="navigate"
            >
              <span slot="title">{{ page.title }}</span></el-menu-item
            >
          </router-link>
        </el-submenu>
        <router-link to="/archive" custom v-slot="{ isExactActive, navigate }">
          <el-menu-item
            @click="navigate"
            :class="{ 'is-active': isExactActive }"
            index="archive"
            ><i class="el-icon-files"></i>
            <span slot="title">Archive</span></el-menu-item
          >
        </router-link>
        <router-link to="/faq" custom v-slot="{ isExactActive, navigate }">
          <el-menu-item
            @click="navigate"
            :class="{ 'is-active': isExactActive }"
            ><i class="el-icon-question"></i>
            <span slot="title">FAQs</span></el-menu-item
          >
        </router-link>
        <router-link to="/contact" custom v-slot="{ isExactActive, navigate }">
          <el-menu-item
            @click="navigate"
            :class="{ 'is-active': isExactActive }"
            ><i class="el-icon-user"></i>
            <span slot="title">About Me</span></el-menu-item
          >
        </router-link>
      </el-menu>
    </el-aside>

    <el-main>
      <Nuxt />
    </el-main>
  </el-container>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return this.$mq === 'mobile' || this.$mq === 'tablet'
    },
  },
  data: () => ({
    latestPages: null,
  }),
  mounted() {
    this.latestPages = this.$utils.latestPages
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
}
</style>
