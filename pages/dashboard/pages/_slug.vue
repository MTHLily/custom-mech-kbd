<template>
  <!--  TODO: Messagebox the editor
      TODO: Set slug to static if existing page
-->
  <div>
    <page-form
      v-if="pageDetails"
      :title="pageDetails.pageTitle"
      :content="pageDetails.pageContent"
      :url="pageDetails.pageCoverImageUrl"
      @formSubmit="update"
    ></page-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  layout: 'dashboard',
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
  methods: {
    update(data) {
      this.$utils
        .updatePageInFirebase(this.$route.params.slug, data)
        .then((message) => {
          this.$message({
            type: 'success',
            message: message,
          })
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err,
          })
        })
    },
  },
}
</script>

<style></style>
