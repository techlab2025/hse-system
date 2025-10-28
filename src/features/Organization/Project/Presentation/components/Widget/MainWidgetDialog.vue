<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { ref } from "vue";
import Widget from '@/assets/images/Widget.png';
import HeaderSection from '../Details/DetailsHeader/HeaderSection.vue';
import WidgetForm from './Form/WidgetForm.vue';

const visible = ref(false);
</script>

<template>
  <button @click="visible = true">Add Widget</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '60rem', height: '70%' }">
    <template #header>
      <div class="add-widget-header">
        <HeaderSection :img="Widget" title="Widget Settings & Customization"
          subtitle="Easily customize the dashboard layout for your project needs" />
      </div>
    </template>
    <div class="widget-dialog-data">
      <hr class="add-widget-hr" />
      <WidgetForm />
    </div>
  </Dialog>
</template>
