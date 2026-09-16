<script setup lang="ts">
import type TemplateModel from '@/features/setting/Template/Data/models/TemplateModel'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import TemplateDocument from '@/features/Organization/Inspection/Presentation/components/InspectionDialog/TemplateDocument.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data: TemplateModel[]
  selectedTemplates?: number
}>()

const route = useRoute()

const SelectedTemplate = ref<number | undefined>(Number(route.query.template_id))

const TemplateDetailsCOntroller = ShowTemplateController.getInstance()
const state = ref(TemplateDetailsCOntroller.state.value)
const showTemplateParams = new ShowTemplateParams(SelectedTemplate.value)
const FetchTemplateDetails = async () => {
  await TemplateDetailsCOntroller.showTemplate(showTemplateParams)
}
onMounted(FetchTemplateDetails)
</script>

<template>
  <!-- <InspectionStartTemplate
    :templateId="Number(route?.query?.template_id)"
    :taskId="Number(route?.query?.template_id)"
  /> -->
  <TemplateDocument :all-data="state" />
</template>

<style lang="scss" scoped>
.template-selector-container-AccordionPanel .active.panel-acc {
  border: 2px dashed color-mix(in srgb, var(--brand-primary-500) 60%, transparent) !important;
  background-color: color-mix(in srgb, var(--brand-primary-200) 6%, transparent);
}
.template-selector-container-AccordionPanel .panel-acc {
  background-color: color-mix(in srgb, #1d4ed8 6%, #ffffff);
  max-height: 20rem;
  overflow-y: scroll;
}
</style>
