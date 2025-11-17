<script setup lang="ts">
import DocumnetHeader from '@/assets/images/DocumnetHeader.png'
import TemplateDocumentRadioButtonShow from './TemplateDocumentTypes/TemplateDocumentRadioButtonShow.vue';
import TemplateDocumentCheckboxShow from './TemplateDocumentTypes/TemplateDocumentCheckboxShow.vue';
import TemplateDocumentSelectShow from './TemplateDocumentTypes/TemplateDocumentSelectShow.vue';
import TemplateDocumentTextAreaShow from './TemplateDocumentTypes/TemplateDocumentTextAreaShow.vue';
import TitleInterface from '@/base/Data/Models/title_interface';


const CheckBoxData = [
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      { label: 'option 1', value: 1 },
      { label: 'option 2', value: 2 },
      { label: 'option 3', value: 3 },
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      { label: 'option 1', value: 1 },
      { label: 'option 2', value: 2 },
      { label: 'option 3', value: 3 },
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      { label: 'option 1', value: 1 },
      { label: 'option 2', value: 2 },
      { label: 'option 3', value: 3 },
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      { label: 'option 1', value: 1 },
      { label: 'option 2', value: 2 },
      { label: 'option 3', value: 3 },
    ],
  },
];
const RadioButtonData = [
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 2 },
      { label: 'N/A', value: 3 },
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 2 },
      { label: 'N/A', value: 3 },
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 2 },
      { label: 'N/A', value: 3 },
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 2 },
      { label: 'N/A', value: 3 },
    ],
  },

];
const SelectData = [
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      new TitleInterface({ title: 'option 1', id: 1 }),
      new TitleInterface({ title: 'option 2', id: 2 }),
      new TitleInterface({ title: 'option 3', id: 3 }),
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      new TitleInterface({ title: 'option 1', id: 1 }),
      new TitleInterface({ title: 'option 2', id: 2 }),
      new TitleInterface({ title: 'option 3', id: 3 }),
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      new TitleInterface({ title: 'option 1', id: 1 }),
      new TitleInterface({ title: 'option 2', id: 2 }),
      new TitleInterface({ title: 'option 3', id: 3 }),
    ],
  },
  {
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    options: [
      new TitleInterface({ title: 'option 1', id: 1 }),
      new TitleInterface({ title: 'option 2', id: 2 }),
      new TitleInterface({ title: 'option 3', id: 3 }),
    ],
  },


];

</script>
<template>
  <div class="template-document-container">
    <div class="template-document-header">
      <div class="template-header">
        <p class="header-title">vehicle ABC - 4589</p>
        <div class="template-details">
          <p>Id : <span>example</span></p>
          <p>location :<span>example</span></p>
          <p>Zone :<span>example</span></p>
        </div>
      </div>
      <img :src="DocumnetHeader" alt="header" />
    </div>
    <div class="template-document-content">
      <TemplateDocumentCheckboxShow v-for="(item, index) in CheckBoxData" :key="index" :title="item.title"
        :options="item.options" />
      <TemplateDocumentRadioButtonShow v-for="(item, index) in RadioButtonData" :key="index" :title="item.title"
        :options="item.options" />
      <TemplateDocumentSelectShow v-for="(select, index) in SelectData" :title="select.title" :key="index"
        :options="select.options" />
      <TemplateDocumentTextAreaShow title="Lorem Ipsum is simply dummy text of the printing and typesetting industry" />
    </div>
  </div>
</template>
