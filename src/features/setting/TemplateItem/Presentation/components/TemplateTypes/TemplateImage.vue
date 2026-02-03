<script setup lang="ts">
import UploadImage from '@/shared/icons/UploadImage.vue';
import { ref, watch } from 'vue';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';

const emit = defineEmits(['update:data'])
const ImageType = ref();

const props = defineProps<{
  IdIndex: number
  isUpdloadImage: boolean
}>()
const isUpdloadImage = ref(props.isUpdloadImage);

const UpdateData = () => {
  if (isUpdloadImage.value) {
    emit("update:data", { isUpdloadImage: isUpdloadImage.value, ImageType: ImageType.value })
  }
  else {
    emit("update:data", { isUpdloadImage: isUpdloadImage.value, ImageType: "" })
  }
}
watch(() => props.isUpdloadImage, () => {
  isUpdloadImage.value = props.isUpdloadImage
})

</script>
<template>
  <div class="template-upload-img">
    <div class="template-upload-header">
      <UploadImage class="icon" />
      <p class="title">Do you want to upload photo</p>
      <Checkbox binary type="checkbox" class="input" v-model="isUpdloadImage" @change="UpdateData" />
    </div>
    <hr class="template-hr">
    <div class="template-image-type-container" v-if="isUpdloadImage">
      <div class="template-image-type">
        <label :for="`requierd-${IdIndex}`">Required</label>
        <RadioButton type="radio" value="2" v-model="ImageType" name="image-type" :inputId="`requierd-${IdIndex}`"
          @change="UpdateData" />
      </div>
      <div class="template-image-type">
        <label :for="`optional-${IdIndex}`">optional</label>
        <RadioButton type="radio" value="1" v-model="ImageType" name="image-type" :inputId="`optional-${IdIndex}`"
          @change="UpdateData" />
      </div>
      <!-- <div class="template-image-type">
        <label for="danger-req">required in danger case</label>
        <RadioButton type="radio" value="3" v-model="ImageType" name="image-type" inputId="danger-req"
          @change="UpdateData" />
      </div> -->
    </div>
  </div>
</template>
