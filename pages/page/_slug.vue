<template>
  <div class="container">
    <el-image
      class="page-image"
      :src="pageDetails.pageCoverImageUrl"
    ></el-image>

    <h1>{{ pageDetails.pageTitle }}</h1>
    <div class="ql-container ql-snow" style="border: none">
      <div class="ql-editor" v-html="pageDetails.pageContent"></div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, redirect, app }) {
    let pageDetails

    // eslint-disable-next-line
    await app.$utils
      .getPageFromFirebase(params.slug)
      .then((data) => {
        pageDetails = data
      })
      .catch((err) => {
        redirect('/dashboard/pages')
      })

    return {
      pageDetails,
    }
  },
  mounted() {
    if (this.error) console.log('ERROR')
    else console.log('No error')
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-image {
  aspect-ratio: 16 / 9;
  width: 80%;
}

.ql-container {
  width: 100%;
}
</style>
