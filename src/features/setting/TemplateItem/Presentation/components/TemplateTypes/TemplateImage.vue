<script setup lang="ts">
import UploadImage from '@/shared/icons/UploadImage.vue'
import { ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'

const emit = defineEmits(['update:data'])
const ImageType = ref()

const props = defineProps<{
  IdIndex?: number | string
  isUpdloadImage?: boolean
}>()
const isUpdloadImage = ref(props.isUpdloadImage)

const UpdateData = () => {
  if (isUpdloadImage.value) {
    emit('update:data', { isUpdloadImage: isUpdloadImage.value, ImageType: ImageType.value })
  } else {
    emit('update:data', { isUpdloadImage: isUpdloadImage.value, ImageType: '' })
  }
}

const updateImageType = (value: string) => {
  ImageType.value = value
  UpdateData()
}

watch(
  () => props.isUpdloadImage,
  () => {
    isUpdloadImage.value = props.isUpdloadImage
  },
)
</script>
<template>
  <div class="template-upload-img" :class="{ 'is-enabled': isUpdloadImage }">
    <div class="template-upload-header">
      <div class="template-upload-copy">
        <span class="template-upload-icon">
          <UploadImage class="icon" />
        </span>
        <div>
          <p class="title">Do you want to upload photo</p>
          <p class="subtitle">Ask inspectors to attach image evidence for this item.</p>
        </div>
      </div>
      <label class="template-upload-switch">
        <span>{{ isUpdloadImage ? 'Enabled' : 'Off' }}</span>
        <Checkbox
          binary
          type="checkbox"
          class="input"
          v-model="isUpdloadImage"
          @change="UpdateData"
        />
      </label>
    </div>

    <div class="template-image-type-container" v-if="isUpdloadImage">
      <div
        class="template-image-type"
        :class="{ selected: ImageType === '2' }"
        @click="updateImageType('2')"
      >
        <label :for="`requierd-${IdIndex}`">Required</label>
        <span class="type-hint">Must attach image</span>
        <RadioButton
          type="radio"
          value="2"
          v-model="ImageType"
          :name="`image-type-${IdIndex ?? 'template'}`"
          :inputId="`requierd-${IdIndex}`"
          @change="UpdateData"
        />
      </div>
      <div
        class="template-image-type"
        :class="{ selected: ImageType === '1' }"
        @click="updateImageType('1')"
      >
        <label :for="`optional-${IdIndex}`">Optional</label>
        <span class="type-hint">Attach when needed</span>
        <RadioButton
          type="radio"
          value="1"
          v-model="ImageType"
          :name="`image-type-${IdIndex ?? 'template'}`"
          :inputId="`optional-${IdIndex}`"
          @change="UpdateData"
        />
      </div>
      <!-- <div class="template-image-type">
        <label for="danger-req">required in danger case</label>
        <RadioButton type="radio" value="3" v-model="ImageType" name="image-type" inputId="danger-req"
          @change="UpdateData" />
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.template-upload-img {
  position: relative;
  isolation: isolate;
  width: 100%;
  margin-top: 14px;
  padding: 16px;
  overflow: hidden;
  border: 1px solid var(--brand-primary-100);
  border-radius: 16px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface-1) 96%, transparent), color-mix(in srgb, var(--brand-primary-50) 96%, transparent)),
    var(--surface-1);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.template-upload-img::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--brand-primary-100);
  transition:
    width 0.25s ease,
    background 0.25s ease;
  z-index: -1;
}

.template-upload-img:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 42px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.template-upload-img.is-enabled {
  border-color: color-mix(in srgb, var(--brand-primary-500) 28%, transparent);
  box-shadow: 0 18px 42px color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
}

.template-upload-img.is-enabled::before {
  width: 6px;
  background: var(--brand-primary-500);
}

.template-upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.template-upload-copy {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.template-upload-icon {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 12%, transparent);
  border-radius: 14px;
  background: var(--brand-primary-50);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 85%, transparent);
}

.template-upload-icon .icon {
  width: 30px;
  height: 30px;
}

.title {
  margin: 0;
  color: var(--brand-primary-900);
  font-size: var(--md-size);
  font-weight: 900;
  line-height: 1.25;
}

.subtitle {
  margin-top: 4px;
  color: var(--text-soft);
  font-size: var(--sm-size);
  font-weight: 600;
  line-height: 1.4;
}

.template-upload-switch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  gap: 10px;
  min-height: 40px;
  padding: 6px 8px 6px 12px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 999px;
  background: var(--surface-1);
  color: var(--brand-primary-500);
  font-size: 12px !important;
  font-weight: 800 !important;
  cursor: pointer;
}

.is-enabled .template-upload-switch {
  border-color: color-mix(in srgb, var(--brand-primary-500) 24%, transparent);
  background: var(--brand-primary-50);
  color: var(--brand-primary-500);
}

.template-image-type-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid color-mix(in srgb, var(--brand-primary-100) 78%, transparent);
  animation: slideIn 0.22s ease-out;
}

.template-image-type {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  min-height: 58px;
  padding: 11px 12px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 14px;
  background: var(--brand-primary-50);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.template-image-type:hover {
  border-color: color-mix(in srgb, var(--brand-primary-500) 28%, transparent);
  background: var(--brand-primary-50);
}

.template-image-type.selected {
  border-color: color-mix(in srgb, var(--brand-primary-500) 46%, transparent);
  background: var(--brand-primary-50);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.template-image-type label {
  grid-column: 1;
  color: var(--brand-primary-900) !important;
  font-size: var(--sm-size) !important;
  font-weight: 900 !important;
  cursor: pointer;
}

.type-hint {
  grid-column: 1;
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.25;
}

.template-image-type :deep(.p-radiobutton) {
  grid-column: 2;
  grid-row: 1 / span 2;
}

:deep(.p-checkbox) {
  width: 24px;
  height: 24px;
}

:deep(.p-checkbox-box),
:deep(.p-radiobutton-box) {
  border-color: color-mix(in srgb, var(--brand-primary-500) 30%, transparent) !important;
  box-shadow: none !important;
}

:deep(.p-checkbox-box) {
  width: 24px !important;
  height: 24px !important;
  border-radius: 999px !important;
  background: var(--surface-1) !important;
}

:deep(.p-radiobutton-box) {
  background: var(--surface-1) !important;
}

:deep(.p-checkbox-checked .p-checkbox-box),
:deep(.p-radiobutton-checked .p-radiobutton-box) {
  border-color: var(--brand-primary-500) !important;
  background: var(--brand-primary-500) !important;
}

:deep(.p-checkbox-checked .p-checkbox-box svg) {
  color: var(--text-on-brand) !important;
}

:deep(.p-radiobutton-checked .p-radiobutton-box .p-radiobutton-icon) {
  background: var(--surface-1) !important;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .template-upload-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .template-upload-switch {
    align-self: flex-start;
  }

  .template-image-type-container {
    grid-template-columns: 1fr;
  }
}
</style>
