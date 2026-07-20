<script setup lang="ts">
import { ref, computed } from 'vue'
import UploadImage from '@/shared/icons/UploadImage.vue'
import MultiImagesDialog from './dialog/MultiImagesDialog.vue'

const props = defineProps<{
  initialImages?: string[]
  isUpload?: boolean
  variant?: 'default' | 'evidence'
}>()
const images = ref<string[]>(props.initialImages || [])
const emit = defineEmits(['update:images'])

const handleUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  images.value = []

  Array.from(target.files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      if (!loadEvent.target?.result) return
      images.value.push(loadEvent.target.result as string)
      emit('update:images', [...images.value])
    }
    reader.readAsDataURL(file)
  })
}

const previewImages = computed(() => images.value.slice(0, 3))
const extraCount = computed(() => images.value.length - 3)
</script>

<template>
  <div :class="['multi-image-upload', { 'multi-image-upload--evidence': variant === 'evidence' }]">
    <label v-if="images.length === 0" class="upload-trigger cursor-pointer">
      <span class="upload-icon-shell">
        <UploadImage class="image-upload" />
      </span>
      <span v-if="variant === 'evidence'" class="upload-copy">
        <strong>{{ $t('upload_photos') }}</strong>
        <small>{{ $t('upload_photo_hint') }}</small>
      </span>
      <input type="file" multiple accept="image/*" class="hidden" @change="handleUpload" />
    </label>

    <div v-else class="uploaded-state">
      <MultiImagesDialog :images="images">
        <div v-if="images.length > 1" class="preview-grid">
          <div v-for="(img, i) in previewImages" :key="i" class="preview-tile">
            <img :src="img" alt="" />
          </div>
          <div v-if="images.length >= 4" class="preview-tile preview-more">
            <img :src="images[3]" alt="" />
            <span>+{{ extraCount }}</span>
          </div>
        </div>
        <div v-else class="preview-grid preview-grid--single">
          <div v-for="(img, i) in images" :key="i" class="preview-tile">
            <img :src="img" alt="" />
          </div>
        </div>
      </MultiImagesDialog>

      <label class="replace-trigger cursor-pointer">
        <UploadImage class="image-upload" />
        <span v-if="variant === 'evidence'">{{ $t('replace_photos') }}</span>
        <input type="file" multiple accept="image/*" class="hidden" @change="handleUpload" />
      </label>
    </div>
  </div>
</template>

<style scoped>
.multi-image-upload {
  display: inline-flex;
  align-items: center;
}

.upload-trigger,
.uploaded-state,
.replace-trigger {
  display: flex;
  align-items: center;
}

.multi-image-upload--evidence {
  display: block;
  width: 100%;
}

.multi-image-upload--evidence .upload-trigger {
  width: 100%;
  min-height: 88px;
  gap: 14px;
  padding: 14px 16px;
  border: 1px dashed color-mix(in srgb, var(--brand-primary-600, #1d4ed8) 42%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--brand-primary-600, #1d4ed8) 5%, transparent);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.multi-image-upload--evidence .upload-trigger:hover {
  border-color: var(--brand-primary-600, #1d4ed8);
  background: color-mix(in srgb, var(--brand-primary-600, #1d4ed8) 9%, transparent);
  transform: translateY(-1px);
}

.upload-icon-shell {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  border-radius: 14px;
  background: var(--surface-card, #fff);
  box-shadow: 0 8px 24px rgb(29 78 216 / 12%);
}

.upload-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.upload-copy strong {
  color: var(--text-color, #172033);
  font-size: 0.92rem;
}

.upload-copy small {
  color: var(--text-color-secondary, #667085);
  font-size: 0.78rem;
}

.uploaded-state {
  gap: 12px;
}

.multi-image-upload--evidence .uploaded-state {
  width: 100%;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-600, #1d4ed8) 22%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--brand-primary-600, #1d4ed8) 4%, transparent);
}

.preview-grid {
  display: flex;
  gap: 6px;
}

.preview-tile {
  position: relative;
  width: 54px;
  height: 54px;
  overflow: hidden;
  border-radius: 12px;
}

.preview-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-more span {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgb(0 0 0 / 50%);
  font-weight: 700;
}

.replace-trigger {
  gap: 8px;
  color: var(--brand-primary-700, #1d4ed8);
  font-size: 0.82rem;
  font-weight: 700;
}

.multi-image-upload--evidence .replace-trigger {
  padding: 8px 10px;
  border-radius: 12px;
  background: var(--surface-card, #fff);
}

.replace-trigger .image-upload {
  width: 30px;
  height: 30px;
}
</style>
