<template>
  <el-table :data="pagesData" style="width: 100%">
    <el-table-column prop="slug" label="Slug"> </el-table-column>
    <el-table-column prop="pageTitle" label="Page Title"> </el-table-column>
    <el-table-column prop="createdAt" label="Date Created"> </el-table-column>
    <el-table-column label="Actions">
      <template v-slot:="{ row, column, $index }">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          @click="link(`/dashboard/pages/${row.slug}`)"
        ></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click="deletePage(row.slug)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  layout: 'dashboard',
  data() {
    return {
      pagesData: [],
    }
  },
  methods: {
    deletePage(slug) {
      const loadingRef = this.$loading({
        text: 'Contacting the server...',
      })
      this.$utils
        .deletePageFromFirebase(slug)
        .then((message) => {
          loadingRef.close()
          this.$message({
            message: message,
            type: 'error',
          })
        })
        .catch((err) => {
          loadingRef.close()
          this.$message({
            message: err,
            type: 'warning',
          })
        })
    },
    link(routeLink) {
      this.$router.push(routeLink)
    },
  },
  mounted() {
    this.$utils.getPagesFromFirebase().then((data) => {
      this.pagesData = data
    })
  },
}
</script>

<style></style>
