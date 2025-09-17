<script setup lang="ts">
import { ref, watch } from 'vue'
import ExcelIcon from '@/assets/images/excel.png'
import IconUploadFile from '@/shared/icons/IconFileUpload.vue'
import PdfIcon from '@/assets/images/pdf.png'
import WordIcon from '@/assets/images/word.png'
import IconVideo from '@/shared/icons/IconVideo.vue'
import IconAudio from '@/shared/icons/IconAudio.vue'
import IconDeleteAttachment from '@/shared/icons/IconDeleteAttachment.vue'
import DwgIcon from '@/assets/images/dwg-file.png'
import RarIcon from '@/assets/images/rar-file.png'
import CloudIcon from '../icons/CloudIcon.vue'
import TrashIcon from '../icons/TrashIcon.vue'

const props = defineProps({
  initialFileData: String,
  index: Number,
  canDelete: {
    type: Boolean,
    default: true,
  },
  accept: {
    type: String,
    default: '/*',
  },
})

const emit = defineEmits<{
  (e: 'update:fileData', file: File | null, index?: number): void
}>()

const pdfUrl = ref<string>(props.initialFileData || '')
const fileData = ref<File | null>(null)

const placeholderIcons = {
  pdf: PdfIcon,
  word: WordIcon,
  excel: ExcelIcon,
  generic: PdfIcon,
  video: IconVideo,
  audio: IconAudio,
  dwg: DwgIcon,
  rar: RarIcon,
}

function getPlaceholder(file: File): string {
  const extension = file.type
  switch (extension) {
    case 'pdf':
      return placeholderIcons.pdf
    case 'doc':
    case 'docx':
      return placeholderIcons.word
    case 'xls':
    case 'xlsx':
      return placeholderIcons.excel
    case 'mp4':
      return placeholderIcons.video
    case 'mp3':
      return placeholderIcons.audio
    default:
      return URL.createObjectURL(file)
  }
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] || null

  if (file) {
    fileData.value = getPlaceholder(file)
    emit('update:fileData', file, props.index)
  } else {
    fileData.value = null
    emit('update:fileData', null, props.index)
  }
}

watch(
  () => props.initialFileData,
  (newValue) => {
    pdfUrl.value = newValue || ''
  },
)
const deleteImage = () => {
  pdfUrl.value = ''
  fileData.value = null
  emit('update:fileData', null)
}

const handleImageError = (url: string) => {
  if (url) {
    pdfUrl.value = url
  } else {
    pdfUrl.value = ''
  }
}

const removeImage = () => {
  pdfUrl.value = ''
  fileData.value = null
  emit('update:fileData', null)
}
</script>

<template>
  <div class="col-span-4 md:col-span-4 multi-image-uploader">
    <!-- Upload Button -->
    <div class="input-image">
      <label :for="`images${index}`" class="input-label-images">
        <CloudIcon />

        <span> Attach an image no larger than 3.5MB. </span>
      </label>

      <input
        type="file"
        :accept="accept"
        :id="`images${index}`"
        class="input"
        @change="onFileChange"
      />
    </div>

    <!-- Preview Images -->
    <div class="image-gallery" v-if="fileData">
      <div class="image-item">
        <img class="preview-img" :src="fileData" @error="handleImageError(index)" alt="Previewed Image" />
        <div class="overlay" @click="removeImage">
          <TrashIcon />
          <span>Delete</span>
        </div>
        <!-- <button class="remove-btn" type="button" @click="removeImage">
          <IconDeleteAttachment />
        </button> -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
