<template>
  <section>
    <client-only>
      <quill-editor
        ref="editor"
        v-model="content"
        :class="{ error: error }"
        :options="editorOption"
        @ready="onEditorReady"
      />

      <el-dialog
        title="Insert Embedded Video"
        width="30%"
        :visible.sync="dialog.embedVideo"
      >
        <el-input
          v-model="form.embedVideo"
          autocomplete="off"
          placeholder="Video URL"
        ></el-input>
        <span slot="footer">
          <el-button @click="dialog.embedVideo = false">Cancel</el-button>
          <el-button type="primary" @click="insertEmbeddedVideo"
            >Confirm</el-button
          >
        </span>
      </el-dialog>
    </client-only>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    editor() {
      if (this.$refs.editor) return this.$refs.editor.quill
      else return undefined
    },
    content: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  data() {
    return {
      editorOption: {
        // Some Quill options...
        theme: 'snow',
        placeholder: 'Start writing your post here...',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: [] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['clean'],
              ['link', 'image', 'video'],
            ],
            handlers: {
              image: this.onImage,
              video: this.onVideo,
            },
          },
          blotFormatter: {},
          imageDrop: true,
        },
      },
      dialog: {
        embedVideo: false,
      },
      form: {
        embedVideo: '',
        lastSelection: 0,
      },
    }
  },
  methods: {
    onEditorReady(editor) {
      console.log('EDITOR READY')
      const loadingInstance = this.$loading()
      loadingInstance.close()
    },
    onImage() {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.click()

      input.onchange = async () => {
        const file = input.files[0]

        let loadingInstance = this.$loading({
          text: `Uploading image...`,
        })

        await this.$customUtils
          .uploadImageToFirebase(file, `documents/pagePostImages/${file.name}`)
          .then((image) => {
            this.editor.insertEmbed(
              this.editor.getSelection().index,
              'image',
              image.url
            )
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
    onVideo() {
      this.dialog.embedVideo = true
      this.lastSelection = this.editor.getSelection()
    },
    insertEmbeddedVideo() {
      this.editor.insertEmbed(
        this.lastSelection.index,
        'video',
        this.form.embedVideo
      )
      this.form.embedVideo = ''
      this.dialog.embedVideo = true
    },
  },
  mounted() {
    this.$loading({
      text: 'Loading page...',
    })
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0;
  .quill-editor {
    display: flex;
    flex-direction: column;
    min-height: 30rem;
    .ql-container {
      height: 100%;
      flex-grow: 1;
    }
  }
}

.error {
  border: 1px red solid;
}
</style>
