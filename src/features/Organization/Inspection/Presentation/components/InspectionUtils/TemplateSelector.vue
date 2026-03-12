<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import TemplateDocument from '@/features/setting/TemplateItem/Presentation/components/TemplateDocument.vue'
import type TemplateModel from '@/features/setting/Template/Data/models/TemplateModel';
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
import { ref, watch } from 'vue';
import RadioButton from 'primevue/radiobutton'
import wordSlice from '@/base/Presentation/utils/word_slice';
import IconArrowDownNav from '@/shared/icons/IconArrowDownNav.vue';

const emit = defineEmits(['update:data'])
const props = defineProps<{
  data: TemplateModel[]
  selectedTemplates?: number
}>()

const SelectedTemplate = ref<number>(props.selectedTemplates)
const SetSelectedTemplate = (id: number) => {
  SelectedTemplate.value = id
  emit('update:data', id)
}

watch(() => props.selectedTemplates, (newVal) => {
  SelectedTemplate.value = newVal
})

const showMore = ref(false)
const activeaccordion = ref<string | null>(null)

const toggleAccordion = (id: string) => {
  activeaccordion.value = activeaccordion.value === id ? null : id
}
</script>

<template>
  <div class="template-selector">
    <Accordion value="0" :multiple="false">
      <div class="template-selector-container-AccordionPanel">
        <AccordionPanel @click="SetSelectedTemplate(template.id)" class="panel-acc"
          :class="SelectedTemplate == template.id ? 'active' : ''" value="0" v-for="(template, index) in data"
          :key="index">
          <AccordionHeader @click.prevent="toggleAccordion(String(template.id))">
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
                  <p class="header-title" v-else>{{ wordSlice(template?.title, 20) }}</p>
                  <div class="template-details">
                    <p>
                      {{ $t('id') }} : <span>{{ template?.id }}</span>
                    </p>
                  </div>
                </div>
                <div class="header-select">
                  <div class="template-checkbox">
                    <RadioButton :inputId="`${template.id}`" name="template" v-model="SelectedTemplate"
                      :value="template.id" />
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
      </div>

      <!-- <button class="show-more-btn" v-if="data.length > 2" @click="showMore = !showMore">
        <span>{{ showMore ? 'Show Less' : 'Show More' }}</span>
        <IconArrowDownNav :class="showMore ? 'rotate' : ''" />
      </button> -->
    </Accordion>
  </div>
</template>
