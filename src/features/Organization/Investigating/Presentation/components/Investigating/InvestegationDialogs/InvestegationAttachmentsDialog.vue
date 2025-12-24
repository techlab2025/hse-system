<script lang="ts" setup>
import { markRaw, onMounted, ref } from 'vue'
import Dialog from 'primevue/dialog'

import AddAttach from '@/assets/images/AddAttach.png'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'

import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import { LangsMap } from '@/constant/langs'

import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import TranslationsParams from '@/base/core/params/translations_params'

import { useUserStore } from '@/stores/user'

const emit = defineEmits<{
  (e: 'update:data', payload: { title: any; files: any[] }): void
}>()

const visible = ref(false)
const Files = ref<any[]>([])
const langs = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const langDefault = ref<
  {
    locale: string
    icon?: any
    title: string
  }[]
>([])

const user = useUserStore()

const fetchLang = async (
  query = '',
  pageNumber = 1,
  perPage = 10,
  withPage = 0,
) => {
  if (user?.user?.languages?.length) {
    langDefault.value = user.user.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }

  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const controller = await IndexLangController.getInstance().getData(params)
  const response = controller.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  }
}

const setFiles = async (files: File[]) => {
  Files.value = await filesToBase64(files)
}

const SendData = () => {
  const translationsParams = new TranslationsParams()

  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })

  emit('update:data', {
    title: translationsParams,
    files: Files.value,
  })

  visible.value = false
}

onMounted(fetchLang)
</script>

<template>
  <button class="add-attachment-btn" @click="visible = true">
    <span>Attach file no larger than 3.5MB.</span>
    <img :src="AddAttach" alt="attach" />
  </button>

  <Dialog v-model:visible="visible" modal :dismissableMask="true" :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header>
      <HeaderSection title="Upload files" subtitle="Every group of attachment needs a title" />
    </template>

    <div class="investegation-attachment-dialog-content">
      <hr class="attch-hr" />

      <div class="input-wrapper">
        <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs.value = val)" />
      </div>

      <FileUpload class="file-upload" label="Image" id="image" placeholder="Select image" :multiple="false"
        @update:fileData="setFiles" />
    </div>

    <button class="btn btn-primary w-full" @click="SendData">
      Add
    </button>
  </Dialog>
</template>
