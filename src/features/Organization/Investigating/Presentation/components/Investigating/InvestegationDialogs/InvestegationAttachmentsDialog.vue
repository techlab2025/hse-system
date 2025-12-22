<script lang="ts" setup>
import Dialog from 'primevue/dialog'
import AddAttach from '@/assets/images/AddAttach.png'
import { ref } from 'vue'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
const emit = defineEmits(['update:data'])
const visible = ref(false)
const title = ref()
const Files = ref()

const UpdateData = () => {
  emit('update:data', {
    title: title.value,
    files: Files.value || [],
  })
}
const setFiles = async (files) => {
  // Files.value = files
  Files.value = await filesToBase64(files)

  UpdateData()
}

const SendData = () => {
  emit('update:data', {
    title: title.value,
    files: Files.value || [],
  })
  visible.value = false
}
</script>
<template>
  <button class="add-attachment-btn" @click="visible = true">
    <span>Attach file no larger than 3.5MB.</span>
    <img :src="AddAttach" alt="" />
  </button>
  <Dialog v-model:visible="visible" modal :dissmissible-mask="true" :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <div>
        <HeaderSection title="upload files" subtitle="every group of attachment need a title " />
      </div>
    </template>
    <div class="investegation-attachment-dialog-content">
      <hr class="attch-hr" />
      <div class="input-wrapper">
        <label for="title">title</label>
        <input @input="UpdateData" type="text" class="input" v-model="title" placeholder="enter title" />
      </div>

      <FileUpload @update:fileData="setFiles" label="Image" id="image" placeholder="Select image" :multiple="false" />
    </div>
    <button class="btn btn-primary w-full" @click="SendData">Add</button>
  </Dialog>
</template>
