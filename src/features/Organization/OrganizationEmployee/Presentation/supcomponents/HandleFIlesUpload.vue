<script setup lang="ts">
import { ref } from 'vue'

interface UploadedFile {
  id: string
  name: string
  type: string
  size: string
  url: string
  base64: string
}

interface Props {
  label?: string
  accept?: string
  maxFiles?: number
  className?: string
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Upload Files',
  accept: '*',
  maxFiles: Infinity,
  multiple: false,
})

const emit = defineEmits<{
  change: [files: UploadedFile[]]
}>()

const files = ref<UploadedFile[]>([])

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const remaining = props.maxFiles - files.value.length
  const incoming = Array.from(input.files).slice(0, remaining)

  for (const file of incoming) {
    const base64 = await fileToBase64(file)

    files.value.push({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      url: URL.createObjectURL(file),
      base64,
    })
  }

  emit('change', files.value)
  input.value = ''
}

const downloadFile = (file: UploadedFile) => {
  const a = document.createElement('a')
  a.href = file.url
  a.download = file.name
  a.click()
}

const removeFile = (id: string) => {
  const index = files.value.findIndex((f) => f.id === id)
  if (index !== -1) {
    URL.revokeObjectURL(files.value[index].url)
    files.value.splice(index, 1)
    emit('change', files.value)
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileExt = (name: string): string => name.split('.').pop()?.toUpperCase() ?? 'FILE'

const isMaxReached = () => files.value.length >= props.maxFiles
</script>

<template>
  <div class="file-upload-wrapper">
    <label class="upload-label">{{ label }}</label>

    <label
      :class="{
        disabled: isMaxReached(),
        [className]: className || 'upload-area',
      }"
      for="file-upload-input"
    >
      <span class="upload-icon">↑</span>
      <span class="upload-text">
        {{ isMaxReached() ? `Max ${maxFiles} files reached` : 'Click to upload' }}
      </span>
      <input
        id="file-upload-input"
        type="file"
        :accept="accept"
        :disabled="isMaxReached()"
        :multiple="multiple"
        hidden
        @change="handleFileUpload"
      />
    </label>

    <div v-if="files.length" class="preview-grid">
      <div
        v-for="file in files"
        :key="file.id"
        class="preview-item"
        title="Click to download"
        @click="downloadFile(file)"
      >
        <template v-if="file.type.startsWith('image/')">
          <img :src="file.url" :alt="file.name" class="preview-thumb" />
        </template>

        <template v-else>
          <div class="preview-icon">
            {{ getFileExt(file.name) }}
          </div>
        </template>

        <div class="preview-overlay">
          <span class="preview-filename">{{ file.name }}</span>
          <span class="preview-size">{{ file.size }}</span>
        </div>

        <div class="download-badge">↓</div>

        <button type="button" class="remove-btn" title="Remove" @click.stop="removeFile(file.id)">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 20px;
  border: 1.5px dashed #d1d5db;
  border-radius: 10px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
  background: #fafafa;
}

.upload-area:hover:not(.disabled) {
  border-color: #6366f1;
  background: #f5f3ff;
}

.upload-area.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.upload-icon {
  font-size: 16px;
  color: #9ca3af;
}

.upload-text {
  font-size: 13px;
  color: #6b7280;
}

.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  cursor: pointer;
  background: #f3f4f6;
  flex-shrink: 0;
  transition:
    border-color 0.15s,
    transform 0.15s;
}

.preview-item:hover {
  border-color: #6366f1;
  transform: translateY(-2px);
}

.preview-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
  padding: 20px 6px 5px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  opacity: 0;
  transition: opacity 0.15s;
}

.preview-item:hover .preview-overlay {
  opacity: 1;
}

.preview-filename {
  font-size: 10px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.preview-size {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.75);
}

.download-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.85);
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s;
}

.preview-item:hover .download-badge {
  opacity: 1;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition:
    opacity 0.15s,
    background 0.15s;
  z-index: 10;
}

.preview-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: #ef4444;
}

</style>
