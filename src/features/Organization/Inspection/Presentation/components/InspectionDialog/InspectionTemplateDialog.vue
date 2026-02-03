<script setup lang="ts">
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import ImportantIcon from '@/shared/icons/ImportantIcon.vue'
import Dialog from 'primevue/dialog'
import InspectionTemplateImage from '@/assets/images/check-list.png'
import { onMounted, ref, watch } from 'vue'
import IndexTemplateController from '@/features/setting/Template/Presentation/controllers/indexTemplateController'
import IndexTemplateParams from '@/features/setting/Template/Core/params/indexTemplateParams'
import TemplateSelector from '../InspectionUtils/TemplateSelector.vue'
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
import DeleteTemplateIcon from '@/shared/icons/DeleteTemplateIcon.vue'
import AddNewTemplateDialog from './AddNewTemplateDialog.vue'



const visible = ref(false)

const indexTemplateController = IndexTemplateController.getInstance()
const state = ref(indexTemplateController.state.value)

const selectedTemplates = ref<number>()

const fetchTemplateItem = async () => {
  const deleteTemplateItemTypeParams = new IndexTemplateParams('', 1, 1000, 1, null, true)
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

const emit = defineEmits(['update:data', 'update:isInLibrary'])
const sendTemplatesId = () => {
  emit('update:data', selectedTemplates.value)
  emit('update:isInLibrary', isInLibrary.value)
  visible.value = false
}

const selectedTemplateHeader = ref()
const GetTemplateId = (data: number) => {
  selectedTemplates.value = data
  selectedTemplateHeader.value = state.value.data?.find((item) => item.id === data)
  emit('update:data', selectedTemplates.value || TemplateId.value)
  emit('update:isInLibrary', isInLibrary.value)
  // visible.value = false
  ShowTemplate.value = true
}

const clearSelectedTemplate = () => {
  selectedTemplates.value = undefined
  TemplateId.value = undefined
  emit('update:data', selectedTemplates.value || TemplateId.value)
  emit('update:isInLibrary', isInLibrary.value)
  ShowTemplate.value = false
  visible.value = false
}

const TemplateId = ref()
const TemplateTitle = ref()
const isInLibrary = ref()
const GetTemplateInfo = (data: { templateId: number, isInLibrary: number, teamplateTitle: string }) => {
  TemplateId.value = data.templateId
  isInLibrary.value = data.isInLibrary
  TemplateTitle.value = data.teamplateTitle
  emit('update:data', data.templateId)
  emit('update:isInLibrary', data.isInLibrary)
  visible.value = false
}

const ShowTemplate = ref(true)
</script>

<template>
  <div class="inspection-template-dialog-container ">


    <div class="input-wrapper col-span-6 pt-15 md:col-span-3">
      <div class="title">
        <span>{{ $t('inspection template') }}</span>
        <ImportantIcon />
      </div>

      <button type="button" @click="visible = true" class="inspection-template-button">
        {{ $t('select inspection template') }}
      </button>


      <div class="template-header" v-if="(selectedTemplates || TemplateTitle) && ShowTemplate">
        <button class="delete" @click.prevent="clearSelectedTemplate">
          <DeleteTemplateIcon class="delete-icon" />
        </button>
        <p class="header-title">
          {{
            selectedTemplateHeader?.title || TemplateTitle
          }}
        </p>
        <img :src="DocumnetHeader" alt="header" />

      </div>
    </div>


    <Dialog v-model:visible="visible" modal :dissmissible-mask="true" :style="{ width: '70vw', height: '80vh' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" class="inspection-template-dialog">

      <template #header>
        <div class="add-equipment-header">
          <HeaderSection :img="InspectionTemplateImage" :title="$t('inspection template')"
            :subtitle="$t('Select from the available templates.')" />
        </div>
      </template>

      <div class="inspection-template-dialog-data">
        <hr class="inspection-template-dialog-divider" />

        <div class="add-new-template">
          <AddNewTemplateDialog :visible="visible" @update:templateId="GetTemplateInfo" />
        </div>



        <!-- <div class="my-template-selection">
          <div class="title">
            <ArrowsLeft />
            <span>{{ $t('my templates') }}</span>
          </div>
        </div> -->

        <div class="inspection-templates-items">
          <TemplateSelector :data="state.data" @update:data="GetTemplateId" :selectedTemplates="selectedTemplates" />
        </div>


      </div>
      <button class="confirm-btn btn btn-primary w-full !mt-4" @click="sendTemplatesId">
        {{ $t('confirm') }}
      </button>
    </Dialog>
  </div>
</template>

<style scoped>
.confirm-btn {
  width: 95%;
  border-radius: 10px;
  margin: auto;
  /* margin-inline: 12px; */
}
</style>
