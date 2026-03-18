<script lang="ts" setup>
import { ref, watch } from 'vue'
import ExcelIcon from '@/assets/images/excel.png'
import PdfIcon from '@/assets/images/pdf.png'
import WordIcon from '@/assets/images/word.png'
import DwgIcon from '@/assets/images/dwg-file.png'
import RarIcon from '@/assets/images/rar-file.png'
import ExcelSheetIcon from '@/shared/icons/ExcelSheetIcon.vue'

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
  // video: IconVideo,
  // audio: IconAudio,
  dwg: DwgIcon,
  rar: RarIcon,
}

function getPlaceholder(file: File): string {
  // console.log(file, "ss");
  const extension = file.type
  switch (extension) {
    case 'application/pdf':
      return placeholderIcons.pdf
    case 'application/doc':
    case 'application/docx':
      return placeholderIcons.word
    case 'application/xls':
    case 'application/xlsx':
      return placeholderIcons.excel
    case 'application/mp4':
      return placeholderIcons.video
    case 'application/mp3':
      return placeholderIcons.audio
    case 'application/rar':
    case 'application/zip':
      return placeholderIcons.rar
    default:
      return URL.createObjectURL(file)
  }
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] || null

  if (file) {
    // const fileUrl = URL.createObjectURL(file);
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
      <!-- <label :for="`images${index}`" class="input-label-images">
        <span>
          Drag files here to upload images or files, or browse files from here
        </span>
      </label> -->
      <label class="flex flex-col items-center lable-container" :for="`images${index}`">
        <ExcelSheetIcon />
        <p class="title">Upload Your File</p>
        <p class="description">Drag & drop or click to upload your document securely</p>
      </label>
      <input
        :id="`images${index}`"
        :accept="accept"
        class="input"
        type="file"
        @change="onFileChange"
      />
    </div>

    <!-- Preview Images -->
    <!-- <div v-if="fileData" class="image-gallery">
      <div class="image-item">
        <img :src="fileData" alt="Unspported" @error="handleImageError(index)" />
        <button class="remove-btn" type="button" @click="removeImage">
          <IconDeleteAttachment />
        </button>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
/* .multi-image-uploader {
  border: 1px dashed #E5E7EB;
} */

.input-image {
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.lable-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #202020;
}

.description {
  font-size: 18px;
  font-weight: 600;
  color: #9ca3af;
}
</style>
