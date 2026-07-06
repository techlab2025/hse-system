<script setup lang="ts">
import EmployeeBg from '@/assets/images/EmployeeBg.png'
import Yellowback from '@/assets/images/Yellowback.png'
import ShowTemplateIcon from '@/shared/icons/ShowTemplateIcon.vue'
import TemplateDocument from './TemplateDocument.vue'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
const route = useRoute()
const id = route.params.parent_id
const AllDocument = ref<TemplateDetailsModel>()
const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)
const FetchTemplateDocument = async () => {
  const showTemplateParams = new ShowTemplateParams(id)
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
  <DataStatus :controller="state">
    <template #success>
      <div class="show-template-container">
        <div class="left-header-background">
          <img class="left-blue-background" :src="EmployeeBg" alt="bg" />
          <img class="left-yellow-background" :src="Yellowback" alt="bg" />
        </div>
        <div class="template-title">
          <div>
            <h2 class="title">Templet show</h2>
            <p class="subtitle">Live preview of the saved template structure</p>
          </div>
          <ShowTemplateIcon />
        </div>
        <div class="template-document">
          <TemplateDocument @update:data="FetchTemplateDocument" :allData="state.data" />
        </div>

        <div class="right-header-background">
          <img class="right-yellow-background" :src="Yellowback" alt="bg" />
          <img class="right-blue-background" :src="EmployeeBg" alt="bg" />
        </div>
      </div>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped>
.show-template-container {
  position: sticky;
  top: 16px;
  overflow: hidden;
  border: 1px solid rgba(221, 226, 237, 0.82);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 255, 0.94)),
    linear-gradient(90deg, rgba(29, 78, 216, 0.04), rgba(74, 174, 58, 0.04));
  box-shadow: 0 18px 42px rgba(15, 25, 39, 0.07);
}

.template-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 18px 10px;
}

.template-title .title {
  margin: 0;
  color: #041953;
  font-size: var(--xl-size-base);
  font-weight: 900;
}

.template-title .subtitle {
  margin-top: 3px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
}

.template-title :deep(svg) {
  flex: 0 0 auto;
}

.template-document {
  position: relative;
  z-index: 1;
  padding-bottom: 14px;
}

.left-header-background,
.right-header-background {
  pointer-events: none;
  opacity: 0.35;
}
</style>
