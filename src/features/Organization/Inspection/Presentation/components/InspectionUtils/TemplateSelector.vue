<script setup lang="ts">
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

const SelectedTemplate = ref<number | undefined>(props.selectedTemplates)
const SetSelectedTemplate = (id: number) => {
  SelectedTemplate.value = id
  emit('update:data', id)
}

watch(() => props.selectedTemplates, (newVal) => {
  SelectedTemplate.value = newVal
})

const showMore = ref(false)
</script>

<template>
  <div class="template-selector">
    <div class="template-selector-container-AccordionPanel">
      <div @click="SetSelectedTemplate(template.id)" class="panel-acc"
        :class="SelectedTemplate == template.id ? 'active' : ''" v-for="(template, index) in data"
        :key="index">
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
        <div class="template-document-content">
          <TemplateDocument :isActions="false" :allData="template" :headerDisplay="false" />
        </div>
      </div>
    </div>

    <!-- <button class="show-more-btn" v-if="data.length > 2" @click="showMore = !showMore">
      <span>{{ showMore ? 'Show Less' : 'Show More' }}</span>
      <IconArrowDownNav :class="showMore ? 'rotate' : ''" />
    </button> -->
  </div>
</template>

<style lang="scss" scoped>
.template-selector-container-AccordionPanel .active.panel-acc{
  border: 2px dashed rgba(52,67,198,.6) !important;
  background-color: rgba(165, 174, 253, 0.06);
}
</style>
