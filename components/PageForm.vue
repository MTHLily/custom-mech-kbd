<template>
  <el-container direction="vertical">
    <el-form ref="form" :rules="rules" :model="form" label-width="auto">
      <el-row type="flex" :gutter="20">
        <el-col>
          <el-form-item label="Page Title" prop="pageTitle">
            <el-input v-model="form.pageTitle">
              <template v-slot:suffix>
                <span style="transform: translateY(-10px)">{{
                  titleSlug
                }}</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="Page Cover Image" prop="pageCoverImageUrl">
            <!-- <input type="hidden" v-model="pageCoverImageUrl" /> -->
            <el-row type="flex">
              <el-col :span="3">
                <el-popover
                  v-if="!form.pageTitle"
                  placement="top-start"
                  title="Page Title missing"
                  width="200"
                  trigger="hover"
                  content="Please put in a page title before you upload a cover image."
                >
                  <el-button slot="reference" size="small" type="danger"
                    >Upload</el-button
                  >
                </el-popover>

                <el-button
                  v-else
                  size="small"
                  type="primary"
                  @click="uploadCover"
                  :disabled="!form.pageTitle"
                  >Upload</el-button
                >
              </el-col>
              <el-col :span="3" v-if="form.pageCoverImageUrl">
                <el-button size="mini" @click="dialog.showCoverPreview = true"
                  >Preview Cover Image</el-button
                >
                <el-dialog
                  :visible.sync="dialog.showCoverPreview"
                  width="30%"
                  title="Image Preview"
                >
                  <el-row type="flex" justify="center">
                    <el-image :src="form.pageCoverImageUrl" fit="fill"
                      >This is a message</el-image
                    >
                  </el-row>
                </el-dialog>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="pageContent">
        <quill-editor v-model="form.pageContent" :error="errors.pageContent" />
      </el-form-item>
      {{ form.pageContent }}
    </el-form>
    <el-row type="flex" justify="center" style="margin-top: 2rem">
      <el-col :offset="4" :span="8">
        <el-button @click="resetForm">Reset</el-button>
        <el-button @click="submitForm">Save</el-button>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import QuillEditor from './QuillEditor'
import slugify from 'slugify'

export default {
  components: { QuillEditor },
  computed: {
    titleSlug() {
      return slugify(this.form.pageTitle, {
        lower: true,
        strict: true,
      })
    },
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    form: {
      pageTitle: '',
      pageCoverImageUrl: '',
      pageContent: '',
    },
    rules: {
      pageTitle: [
        {
          required: true,
          message: 'Please put in a page title',
          trigger: 'blur',
        },
      ],
      pageContent: [
        {
          required: true,
          message: 'Please put in page content',
          trigger: 'change',
        },
      ],
      pageCoverImageUrl: [
        {
          required: true,
          message: 'Please put in a page cover image',
          trigger: 'input',
        },
      ],
    },
    errors: {
      pageContent: false,
    },
    dialog: { showCoverPreview: false },
    previewURL: null,
  }),
  methods: {
    submitForm() {
      this.$refs.form.validate((valid, rules) => {
        console.log('FROM SUBMIT FORM', valid, rules)
        this.$message({
          message: 'Your input is not valid.',
          type: 'error',
        })

        if (rules.pageContent) this.errors.pageContent = true
        else this.errors.pageContent = false
      })
    },

    resetForm() {
      this.$refs.form.resetFields()
    },

    uploadCover() {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.click()

      input.onchange = async () => {
        const file = input.files[0]

        let loadingInstance = this.$loading({
          text: `Uploading image...`,
        })

        await this.$customUtils
          .uploadImageToFirebase(
            file,
            `documents/pagePostCover/${this.titleSlug}.${file.name
              .split('.')
              .pop()}`
          )
          .then((image) => {
            this.form.pageCoverImageUrl = image.url
            loadingInstance.close()
          })
          .catch((error) => {
            this.$message({
              message: error,
              type: 'error',
            })
            loadingInstance.close()
          })
      }
    },

    onEditorInput(event) {
      this.form.pageContent = event
    },
  },
  mounted() {
    this.form.pageTitle = this.title
    this.form.pageCoverImageUrl = this.url
    this.form.pageContent = this.content
  },
}
</script>

<style lang="scss"></style>
