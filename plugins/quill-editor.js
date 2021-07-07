import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import Quill from 'quill'

import BlotFormatter from 'quill-blot-formatter-new'
import { ImageDrop } from 'quill-image-drop-module'

// Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/blotFormatter', BlotFormatter)
Quill.register('modules/imageDrop', ImageDrop)

Vue.use(VueQuillEditor)
