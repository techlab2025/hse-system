<script lang="ts" setup>
import { markRaw, onMounted, ref } from 'vue'
import Dialog from 'primevue/dialog'

import AddAttach from '@/assets/images/AddAttach.png'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'

import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'

import { useUserStore } from '@/stores/user'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const props = defineProps<{
  images: string[]
}>()

const emit = defineEmits<{
  (e: 'update:data', payload: { title: any; files: any[] }): void
}>()

const visible = ref(false)
const title = ref('')
const Files = ref<any[]>(props.images)

const user = useUserStore()

const setFiles = async (files: File[]) => {
  Files.value = await filesToBase64(files)
}

const SendData = () => {
  emit('update:data', {
    title: title.value,
    files: Files.value,
  })

  visible.value = false
}
const updateTilte = (data: string) => {
  title.value = data.target.value
}
</script>

<template>
  <button class="add-attachment-btn" @click="visible = true">
    <span>Attach file no larger than 3.5MB.</span>
    <img :src="AddAttach" alt="attach" />
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    :dismissableMask="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <HeaderSection title="Upload files" subtitle="Every group of attachment needs a title" />
    </template>

    <div class="investegation-attachment-dialog-content">
      <hr class="attch-hr" />

      <div class="input-wrapper">
        <div class="flex items-center gap-2">
          <label for="title">title</label
          ><FieldHelpIcon
            text="Enter a clear title that identifies this group of investigation attachments."
          />
        </div>
        <input type="text" id="title" v-model="title" class="input" @input="updateTilte" />
      </div>

      <div class="input-wrapper">
        <div class="flex items-center gap-2">
          <span>Files</span
          ><FieldHelpIcon
            text="Upload photos or documents that support the investigation findings. Each file must meet the allowed size and format rules."
          />
        </div>
        <FileUpload
          class="file-upload"
          label="Image"
          id="image"
          placeholder="Select image"
          :multiable="true"
          :initialFileData="images"
          @update:fileData="setFiles"
        />
      </div>
    </div>

    <button class="btn btn-primary w-full" @click="SendData">Confirm</button>
  </Dialog>
</template>
