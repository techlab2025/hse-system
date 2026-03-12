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
// hidden contant
const showMore = ref(false)
const activeaccordion = ref<string | null>(null)
</script>

<template>
  <div class="template-selector">
    <Accordion v-model:value="activeaccordion" :multiple="false">
      <div class="template-selector-container-AccordionPanel">

        <AccordionPanel class="panel-acc"  :value="String(template.id)" v-for="(template, index) in (showMore ? data : data.slice(0, 2))"
          :key="index">
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

                  <p class="header-title" v-else>{{ wordSlice(template?.title, 20) }}</p>
                  <div class="template-details">

                    <p>
                      {{ $t('id') }} : <span>{{ template?.id }}</span>
                    </p>
                    <!-- <p>{{ $t('location') }} :<span>{{ $t('example') }}</span></p>
                    <p>{{ $t('zone') }} :<span>{{ $t('example') }}</span></p> -->
                  </div>
                </div>
                <div class="header-select">
                  <div class="template-checkbox" :class="SelectedTemplate == template.id ? 'active' : ''">
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
      </div>
      <button class="show-more-btn" v-if="data.length > 2" @click="showMore = !showMore">
        {{ showMore ? 'Show Less' : 'Show More' }}
      </button>



    </Accordion>
  </div>
</template>
