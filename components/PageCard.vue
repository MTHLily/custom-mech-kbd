<template>
  <div>
    <el-popover
      v-if="pageData"
      placement="bottom-start"
      :title="pageData.pageTitle"
      width="200"
      trigger="hover"
      :content="formattedDate"
    >
      <div slot="reference">
        <router-link
          :to="`/page/${pageData.slug}`"
          custom
          v-slot="{ navigate }"
        >
          <a href="#" @click="navigate">
            <el-image
              fit="cover"
              class="page-thumbnail"
              :src="pageData.pageCoverImageUrl"
            ></el-image>
          </a>
        </router-link>
      </div>
    </el-popover>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  computed: {
    formattedDate() {
      return moment(this.pageData.createdAt).format('MMM DD YYYY')
    },
  },
  props: ['pageData'],
}
</script>

<style>
.page-thumbnail {
  aspect-ratio: 16 / 9;
  width: 100%;
}
</style>
