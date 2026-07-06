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
watch(
  () => props.isUpdloadImage,
  () => {
    isUpdloadImage.value = props.isUpdloadImage
  },
)
</script>
<template>
  <div class="template-upload-img">
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
      <Checkbox
        binary
        type="checkbox"
        class="input"
        v-model="isUpdloadImage"
        @change="UpdateData"
      />
    </div>
    <hr class="template-hr" />
    <div class="template-image-type-container" v-if="isUpdloadImage">
      <div class="template-image-type">
        <label :for="`requierd-${IdIndex}`">Required</label>
        <RadioButton
          type="radio"
          value="2"
          v-model="ImageType"
          name="image-type"
          :inputId="`requierd-${IdIndex}`"
          @change="UpdateData"
        />
      </div>
      <div class="template-image-type">
        <label :for="`optional-${IdIndex}`">optional</label>
        <RadioButton
          type="radio"
          value="1"
          v-model="ImageType"
          name="image-type"
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
  margin-top: 14px;
  padding: 14px;
  border: 1px solid rgba(221, 226, 237, 0.8);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(15, 25, 39, 0.04);
}

.template-upload-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.template-upload-copy {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.template-upload-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 15px;
  background: rgba(29, 78, 216, 0.08);
}

.template-upload-icon .icon {
  width: 24px;
  height: 24px;
}

.title {
  margin: 0;
  color: #041953;
  font-size: var(--sm-size);
  font-weight: 900;
}

.subtitle {
  margin-top: 2px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
}

.template-hr {
  width: 100%;
  margin: 12px 0;
  border: 0;
  border-top: 1px solid rgba(221, 226, 237, 0.78);
}

.template-image-type-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.template-image-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 7px 10px;
  border: 1px solid rgba(221, 226, 237, 0.86);
  border-radius: 12px;
  background: #f8fafc;
}

.template-image-type label {
  color: #3d4c5e !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  cursor: pointer;
}

:deep(.p-checkbox-box),
:deep(.p-radiobutton-box) {
  border-color: rgba(29, 78, 216, 0.28) !important;
}

:deep(.p-checkbox-checked .p-checkbox-box),
:deep(.p-radiobutton-checked .p-radiobutton-box) {
  border-color: #1d4ed8 !important;
  background: #1d4ed8 !important;
}

@media (max-width: 640px) {
  .template-upload-header {
    align-items: flex-start;
  }

  .template-image-type-container {
    grid-template-columns: 1fr;
  }
}
</style>
