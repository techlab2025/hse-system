<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import TemplateDocument from '@/features/setting/TemplateItem/Presentation/components/TemplateDocument.vue'
import type TemplateModel from '@/features/setting/Template/Data/models/TemplateModel';
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
import { onMounted, ref, watch } from 'vue';
import RadioButton from 'primevue/radiobutton'
import TemplateItemTagController from '@/features/setting/Template/Presentation/controllers/TemplateItemTagController';
import TemplateItemTagParams from '@/features/setting/Template/Core/params/TemplateItemTagParams';

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data: TemplateModel[]
  selectedTemplates?: number
}>()

const SelectedTemplate = ref<number>(props.selectedTemplates)
const SetSelectedTemplate = (id: number) => {
  SelectedTemplate.value = id
  fetchTemplateItemTag()
  emit('update:data', id)
}
watch(() => props.selectedTemplates, (newVal) => {
  SelectedTemplate.value = newVal
  fetchTemplateItemTag()
})
const templateItemTagController = TemplateItemTagController.getInstance()
const templateItemTagState = ref(templateItemTagController.state.value)

const fetchTemplateItemTag = async () => {
  const templateItemTagParams = new TemplateItemTagParams(SelectedTemplate.value)
  await templateItemTagController.TemplateItemTag(templateItemTagParams)
}
onMounted(() => {
  fetchTemplateItemTag()
})

watch(
  () => templateItemTagController.state.value,
  (newState) => {
    if (newState) {
      templateItemTagState.value = newState
    }
  },
  { deep: true },
)

</script>

<template>
  <div class="template-selector">
    <Accordion value="0">
      <AccordionPanel :value="template.id" v-for="(template, index) in data" :key="index">
        <AccordionHeader>
          <!-- :class="SelectedTemplate == template.id ? 'active' : ''" -->
          <div class="template-document-container">
            <div class="template-document-header">
              <div class="template-header">
                <p class="header-title" v-if="template.titles && template?.titles?.length > 0">
                  {{
                    template?.titles
                      ?.filter((item) => item.locale === 'en')
                      .map((item) => item.title)
                      .join('')
                  }}
                </p>

                <p class="header-title" v-else>{{ template?.title }}</p>
                <div class="template-details">

                  <p>
                    {{ $t('id') }} : <span>{{ template?.id }}</span>
                  </p>
                  <!-- <p>{{ $t('location') }} :<span>{{ $t('example') }}</span></p>
                  <p>{{ $t('zone') }} :<span>{{ $t('example') }}</span></p> -->
                </div>
              </div>
              <div class="header-select">
                <div class="template-checkbox">
                  <RadioButton @change="SetSelectedTemplate(template.id)" :inputId="`${template.id}`" name="template"
                    v-model="SelectedTemplate" :value="template.id" />
                  <label :for="`${template.id}`">{{ $t('select') }}</label>
                </div>
                <img :src="DocumnetHeader" alt="header" />
              </div>

            </div>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <TemplateDocument :isActions="false" :allData="template" :headerDisplay="false" />
        </AccordionContent>
      </AccordionPanel>

    </Accordion>
  </div>
</template>
