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

const visible = ref(false)

const route = useRoute()
const id = route.params.parent_id
const AllDocument = ref<TemplateDetailsModel>()
const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)

const FetchTemplateDocument = async () => {
  const showTemplateParams = new ShowTemplateParams(26)
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
</script>

<template>
  <div class="card flex justify-center">
    <button class="card-info-status" @click="visible = true">Start</button>
    <Dialog
      v-model:visible="visible"
      modal
      header="Header"
      :style="{ width: '50vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <TemplateDocument :allData="state.data" />
    </Dialog>
  </div>
</template>
