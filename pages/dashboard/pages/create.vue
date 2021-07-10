<template>
  <div>
    <page-form @formSubmit="savePage"></page-form>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  methods: {
    savePage(pageDetails) {
      this.$utils
        .newPageToFirebase(pageDetails)
        .then((message) => {
          console.log(message)
          this.$message({
            message: message,
            type: 'success',
          })
          this.$router.push('/dashboard/pages')
        })
        .catch((err) => {
          this.$message({
            message: err,
            type: 'error',
          })
        })
    },
  },
}
</script>

<style lang="scss"></style>
