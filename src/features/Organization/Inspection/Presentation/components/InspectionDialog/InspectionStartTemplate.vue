<script setup lang="ts">
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import Dialog from 'primevue/dialog'
import { watch } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import TemplateDocument from './TemplateDocument.vue'
import { useI18n } from 'vue-i18n'

const visible = ref(false)

const { templateId } = defineProps<{ templateId: number }>()

const route = useRoute()
const id = route.params.parent_id
const AllDocument = ref<TemplateDetailsModel>()
const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)

const FetchTemplateDocument = async () => {
  const showTemplateParams = new ShowTemplateParams(templateId)
  const Response = await showTemplateController.showTemplate(showTemplateParams)
  if (Response.value.data) {
    AllDocument.value = Response.value.data
  }
}
onMounted(() => {
  FetchTemplateDocument()
})
watch(
  () => showTemplateController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const { locale } = useI18n()
const getTitle = () => {
  return state.value.data?.titles?.find((item) => item.locale === locale.value)?.title
}
</script>

<template>
  <div class="card flex justify-center">
    <button class="card-info-status" @click="visible = true">Start</button>
    <Dialog
      v-model:visible="visible"
      modal
      :header="getTitle ? getTitle() : ''"
      :style="{ width: '60vw' }"
    >
      <TemplateDocument :allData="state.data" />
    </Dialog>
  </div>
</template>
