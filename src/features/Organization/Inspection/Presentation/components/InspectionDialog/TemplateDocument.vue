<script setup lang="ts">
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
// import TitleInterface from '@/base/Data/Models/title_interface'
import { watch } from 'vue'
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import TemplateDocumentCheckboxShow from './TemplateDocumentTypes/TemplateDocumentCheckboxShow.vue'
import TemplateDocumentRadioButtonShow from './TemplateDocumentTypes/TemplateDocumentRadioButtonShow.vue'
import TemplateDocumentSelectShow from './TemplateDocumentTypes/TemplateDocumentSelectShow.vue'
import TemplateDocumentTextAreaShow from './TemplateDocumentTypes/TemplateDocumentTextAreaShow.vue'
import { ActionsEnum } from '@/features/setting/TemplateItem/Core/Enum/ActionsEnum'

const props = defineProps<{
  allData: TemplateDetailsModel
}>()

watch(
  () => props.allData,
  (newState) => {
    if (newState) {
      console.log(newState)
    }
  },
  {
    deep: true,
  },
)
</script>
<template>
  <div class="template-document-container">
    <div class="template-document-header">
      <div class="template-header">
        <p class="header-title" v-if="allData.titles && allData?.titles.length > 0">
          {{
            allData?.titles
              ?.filter((item) => item.locale === 'en')
              .map((item) => item.title)
              .join('')
          }}
        </p>

        <p class="header-title" v-else>{{ allData?.title }}</p>

        <div class="template-details">
          <p>
            Id : <span>{{ allData?.id }}</span>
          </p>
          <p>location :<span>example</span></p>
          <p>Zone :<span>example</span></p>
        </div>
      </div>
      <img :src="DocumnetHeader" alt="header" />
    </div>
    <div class="template-document-content-container">
      <div
        class="template-document-content"
        v-for="(item, index) in allData?.templateItems"
        :key="index"
      >
        <TemplateDocumentCheckboxShow
          v-if="item?.action == ActionsEnum.CHECKBOX"
          :key="index"
          :title="item.name"
          :options="item.options"
          :require_image="item.requiredImage"
        />
        <TemplateDocumentRadioButtonShow
          v-if="item?.action == ActionsEnum.RADIOBUTTON"
          :title="item.name"
          :options="item.options"
          :require_image="item.requiredImage"
        />
        <TemplateDocumentSelectShow
          v-if="item?.action == ActionsEnum.DROPDOWN"
          :title="item.name"
          :key="index"
          :options="item.options"
          :require_image="item.requiredImage"
        />
        <TemplateDocumentTextAreaShow
          v-if="item?.action == ActionsEnum.TEXTAREA"
          :title="item.name"
          :require_image="item.requiredImage"
        />
      </div>
    </div>
  </div>
</template>
