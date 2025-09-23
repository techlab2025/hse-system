<script setup lang="ts">
import { computed, ref } from 'vue'
import UploadAppend from '@/shared/icons/UploadAppend.vue'
import TrashIcon from '@/shared/icons/TrashIcon.vue'
import RemoveImageIcon from '../icons/RemoveImageIcon.vue'

interface Props {
  modelValue?: string
  id?: string
  name?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', file: File): void
  (e: 'remove'): void
}

const props = withDefaults(defineProps<Props>(), {
  id: 'file',
  name: 'file',
})

const emit = defineEmits<Emits>()

// Track the current file for name and size info
const currentFile = ref<File | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const maxSize = 3.5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size exceeds 3.5MB. Please choose a smaller file.')
      target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      target.value = ''
      return
    }

    currentFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      emit('update:modelValue', file)
      emit('change', file)
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  emit('update:modelValue', '')
  emit('remove')
  currentFile.value = null

  const fileInput = document.getElementById(props.id) as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const fileName = computed(() => {
  return currentFile.value?.name || 'Uploaded image'
})

function getFileNameFromUrl(url: string): string {
  try {
    return url.split('/').pop() || ''
  } catch {
    return ''
  }
}
</script>

<template>
  <div class="file-append">
    <input type="file" hidden :id="id" :name="name" accept="image/*" @change="handleFileChange" />

    <!-- Upload area -->
    <label
      :for="id"
      v-if="!modelValue"
      class="flex justify-center gap-4 file-label items-center cursor-pointer"
    >
      <UploadAppend />
      <p class="text-gray-500">Attach an image no larger than 3.5MB.</p>
    </label>

    <!-- File preview -->
    <div v-if="modelValue" class="file-preview">
      <div class="file-info flex justify-between items-center" v-if="currentFile">
        <div class="file-name text-[#242424]">
          {{ currentFile.name }}
        </div>
        <RemoveImageIcon @click="removeImage" class="cursor-pointer close-icon" />
      </div>
      <div class="file-info flex justify-between items-center" v-else-if="modelValue">
        <div class="file-name text-[#242424]">
          {{ getFileNameFromUrl(modelValue) }}
        </div>
        <RemoveImageIcon @click="removeImage" class="cursor-pointer close-icon" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
