<template>
  <div>
    <el-row
      type="flex"
      :gutter="20"
      width="100%"
      v-for="(chunk, chunkIndex) in pagesChunks"
      :style="chunkIndex === 0 ? '' : 'margin-top: 20px'"
      :key="chunkIndex"
    >
      <el-col v-for="page in chunk" :key="page.slug" :span="isMobile ? 8 : 6">
        <page-card :pageData="page"></page-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return this.$mq === 'mobile' || this.$mq === 'tablet'
    },
    pagesChunks() {
      const chunkSize = this.isMobile ? 3 : 4
      return this.$utils.sliceIntoChunks(this.pagesData, chunkSize)
    },
  },
  data: () => ({
    pagesData: [],
  }),
  mounted() {
    this.$loading({
      text: 'Loading...',
    })
    this.$utils.getPagesFromFirebase().then((data) => {
      this.pagesData = data
      this.$loading().close()
      // console.log(data)
    })
  },
}
</script>

<style></style>
