<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import ImportantIcon from '@/shared/icons/ImportantIcon.vue'
import Dialog from 'primevue/dialog'
import InspectionTemplateImage from '@/assets/images/check-list.png'

import { onMounted, ref, watch } from 'vue'
import ArrowsLeft from '@/shared/icons/arrowsLeft.vue'
import ArrowLeftCurved from '@/shared/icons/arrowLeftCurved.vue'
import TemplateDocument from '@/features/setting/TemplateItem/Presentation/components/TemplateDocument.vue'
import IndexTemplateController from '@/features/setting/Template/Presentation/controllers/indexTemplateController'
import IndexTemplateParams from '@/features/setting/Template/Core/params/indexTemplateParams'

const visible = ref(false)

const indexTemplateController = IndexTemplateController.getInstance()
const state = ref(indexTemplateController.state.value)

const selectedTemplates = ref<string[]>([])

const fetchTemplateItem = async () => {
  const deleteTemplateItemTypeParams = new IndexTemplateParams('', 0, 0, 0, 0)
  await indexTemplateController.getData(deleteTemplateItemTypeParams)
}

onMounted(() => {
  if (visible) fetchTemplateItem()
})

watch(
  () => indexTemplateController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
  { deep: true },
)

const emit = defineEmits(['update:data'])
const sendTemplatesId = () => {
  emit('update:data', selectedTemplates.value)
  visible.value = false
}
</script>

<template>
  <div class="inspection-template-dialog-container">
    <div class="flex flex-col gap-1">
      <div class="title">
        <span>{{ $t('inspection template') }}</span>
        <ImportantIcon />
      </div>

      <button type="button" @click="visible = true" class="inspection-template-button">
        {{ $t('select inspection template') }}
      </button>
    </div>

    <Dialog v-model:visible="visible" modal :dissmissible-mask="true" :style="{ width: '50vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" class="inspection-template-dialog">
      <template #header>
        <div class="add-equipment-header">
          <HeaderSection :img="InspectionTemplateImage" title="inspection template"
            subtitle="Select from the available templates." />
        </div>
      </template>

      <div class="inspection-template-dialog-data">
        <hr class="inspection-template-dialog-divider" />
        <div class="my-template-selection">
          <div class="title">
            <ArrowsLeft />
            <span>{{ $t('my templates') }}</span>
          </div>

          <p class="selected-template-number">
            {{ selectedTemplates.length }}
            <span>{{ $t('select') }}</span>
          </p>
        </div>

        <div class="inspection-templates-items">
          <div class="item" v-for="template in state.data" :key="template.id">
            <div class="item-header">
              <div class="item-header-title">
                <ArrowLeftCurved />
                <span>{{ template.title }}</span>
              </div>

              <div class="select-input input-wrapper check-box">
                <input type="checkbox" :id="`template-${template.id}`" class="input" :value="template.id"
                  v-model="selectedTemplates" />

                <label :for="`template-${template.id}`">
                  {{ $t('select') }}
                </label>
              </div>
            </div>

            <!-- template preview component -->
            <TemplateDocument :allData="template" />
          </div>
        </div>

        <button class="btn btn-primary w-full !mt-4" @click="sendTemplatesId">
          {{ $t('confirm') }}
        </button>
      </div>
    </Dialog>
  </div>
</template>
