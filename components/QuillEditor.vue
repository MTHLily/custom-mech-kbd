<template>
  <section class="container">
    <client-only>
      <quill-editor
        ref="editor"
        v-model="content"
        :class="{ error: error }"
        :options="editorOption"
        @ready="onEditorReady"
      />
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
        placeholder: 'Start writing your page here...',
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

        await this.$utils
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
      const lastSelection = this.editor.getSelection()
      this.$prompt('Insert embedded video.', {
        confirmButtonText: 'Insert',
        cancelButtonText: 'Cancel',
      }).then(({ value }) => {
        this.editor.insertEmbed(lastSelection.index, 'video', value)
      })
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
  border-radius: 4px;
  .quill-editor {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    .ql-container {
      height: 100%;
      flex-grow: 1;
      border-radius: 4px;
    }
  }
}

.error {
  border: 1px red solid;
}
</style>
