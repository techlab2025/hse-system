<script lang="ts" setup>
import Dialog from 'primevue/dialog'
import AddAttach from '@/assets/images/AddAttach.png'
import { markRaw, onMounted, ref } from 'vue'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import FileUpload from '@/shared/FormInputs/FileUpload.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import LangTitleInput from '@/shared/HelpersComponents/LangTitleInput.vue'
import { LangsMap } from '@/constant/langs'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import { useUserStore } from '@/stores/user'
import TranslationsParams from '@/base/core/params/translations_params'

const emit = defineEmits(['update:data'])
const visible = ref(false)
const title = ref()
const Files = ref()


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
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 0,
) => {
  // console.log(user.user, 'user')
  if (user?.user?.languages.length) {
    langDefault.value = user?.user?.languages.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
    return
  }
  const params = new IndexLangParams(query, pageNumber, perPage, withPage)
  const indexPartnerController = await IndexLangController.getInstance().getData(params)

  const response = indexPartnerController.value

  if (response?.data?.length) {
    langDefault.value = response.data.map((item: any) => ({
      locale: item.code,
      title: '',
      icon: markRaw(LangsMap[item.code as keyof typeof LangsMap]?.icon),
    }))
  } else {
    langDefault.value = [
      { locale: 'en', icon: USA, title: '' },
      { locale: 'ar', icon: SA, title: '' },
    ]
  }
}


onMounted(async () => {
  await fetchLang()
})

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

  const translationsParams = new TranslationsParams()

  // titles
  langs.value.forEach((lang) => {
    translationsParams.setTranslation('title', lang.locale, lang.title)
  })
  emit('update:data', {
    title: translationsParams,
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
        <LangTitleInput :langs="langDefault" :modelValue="langs" @update:modelValue="(val) => (langs = val)" />
      </div>

      <FileUpload class="file-upload" @update:fileData="setFiles" label="Image" id="image" placeholder="Select image"
        :multiple="false" />
    </div>
    <button class="btn btn-primary w-full" @click="SendData">Add</button>
  </Dialog>

</template>
