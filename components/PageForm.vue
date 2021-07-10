<template>
  <el-container
    direction="vertical"
    style="padding: 2rem; border: solid 1px #ccc; border-radius: 4px"
  >
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
              <el-col :span="4">
                <el-popover
                  v-if="!form.pageTitle"
                  placement="top-start"
                  title="Page Title missing"
                  width="200"
                  trigger="hover"
                  content="Please put in a page title before you upload a cover image."
                >
                  <el-button
                    slot="reference"
                    size="small"
                    type="info"
                    plain
                    icon="el-icon-close"
                    >Upload</el-button
                  >
                </el-popover>

                <el-button
                  v-else
                  size="small"
                  type="primary"
                  icon="el-icon-upload2"
                  @click="uploadCover"
                  :disabled="!form.pageTitle"
                  >Upload</el-button
                >
              </el-col>
              <el-col :span="3" v-if="form.pageCoverImageUrl">
                <el-button
                  size="mini"
                  @click="dialog.showCoverPreview = true"
                  icon="el-icon-picture-outline"
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
      <el-form-item prop="pageContent" label="Page Content">
        <quill-editor v-model="form.pageContent" :error="errors.pageContent" />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center" style="margin-top: 2rem">
      <el-col :offset="4" :span="8">
        <el-button
          @click="resetForm"
          type="danger"
          plain
          icon="el-icon-refresh-left"
          >Reset</el-button
        >
        <el-button @click="submitForm" type="primary" icon="el-icon-edit"
          >Save</el-button
        >
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
        if (rules.pageContent) this.errors.pageContent = true
        else this.errors.pageContent = false

        if (valid) {
          this.$emit('formSubmit', { slug: this.titleSlug, ...this.form })
          return
        }

        this.$message({
          message: 'Fill in all the fields.',
          type: 'error',
        })
      })
    },

    resetForm() {
      this.$refs.form.resetFields()
      this.errors.pageContent = false
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

        await this.$utils
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
