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
        <div class="preview-glow preview-glow-blue"></div>
        <div class="preview-glow preview-glow-green"></div>
        <div class="left-header-background" aria-hidden="true">
          <img class="left-blue-background" :src="EmployeeBg" alt="bg" />
          <img class="left-yellow-background" :src="Yellowback" alt="bg" />
        </div>
        <div class="template-title">
          <div class="template-title-copy">
            <span class="preview-kicker">Live template</span>
            <h2 class="title">Template preview</h2>
            <p class="subtitle">Live preview of the saved template structure</p>
          </div>
          <div class="preview-icon">
            <ShowTemplateIcon />
          </div>
        </div>
        <div class="template-document">
          <TemplateDocument @update:data="FetchTemplateDocument" :allData="state.data" />
        </div>

        <div class="right-header-background" aria-hidden="true">
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
  min-width: 0;
  border: 1px solid rgba(189, 199, 217, 0.74);
  border-radius: 26px;
  background:
    radial-gradient(circle at 12% 8%, rgba(29, 78, 216, 0.12), transparent 28%),
    radial-gradient(circle at 88% 4%, rgba(74, 174, 58, 0.12), transparent 30%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(246, 249, 254, 0.96));
  box-shadow:
    0 24px 55px rgba(15, 25, 39, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.show-template-container::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background-image:
    linear-gradient(rgba(29, 78, 216, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 78, 216, 0.045) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.72), transparent 72%);
}

.preview-glow {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  filter: blur(2px);
  opacity: 0.8;
}

.preview-glow-blue {
  inset-inline-start: -80px;
  top: 72px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(29, 78, 216, 0.1);
}

.preview-glow-green {
  inset-inline-end: -90px;
  bottom: 80px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(74, 174, 58, 0.12);
}

.template-title {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 20px 20px 12px;
}

.template-title-copy {
  min-width: 0;
}

.preview-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border: 1px solid rgba(74, 174, 58, 0.2);
  border-radius: 999px;
  color: #287b22;
  font-size: 11px;
  font-weight: 900;
  background: rgba(74, 174, 58, 0.1);
}

.template-title .title {
  margin: 9px 0 0;
  color: #041953;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.12;
}

.template-title .subtitle {
  max-width: 310px;
  margin-top: 6px;
  color: #607086;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
}

.preview-icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(29, 78, 216, 0.14);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.12);
}

.preview-icon :deep(svg) {
  width: 28px;
  height: 28px;
}

.template-document {
  position: relative;
  z-index: 2;
  max-height: calc(100vh - 190px);
  min-height: 320px;
  overflow: auto;
  padding: 0 14px 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(29, 78, 216, 0.38) transparent;
}

.template-document::-webkit-scrollbar {
  width: 7px;
}

.template-document::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(29, 78, 216, 0.32);
}

.left-header-background,
.right-header-background {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
}

.left-header-background {
  inset-inline-start: -160px;
  top: -110px;
}

.right-header-background {
  inset-inline-end: -170px;
  bottom: -120px;
}

.left-header-background img,
.right-header-background img {
  max-width: 260px;
}

@media (max-width: 768px) {
  .show-template-container {
    position: relative;
    top: auto;
  }

  .template-title {
    padding: 16px 16px 10px;
  }

  .template-document {
    max-height: none;
    padding-inline: 10px;
  }
}
</style>
