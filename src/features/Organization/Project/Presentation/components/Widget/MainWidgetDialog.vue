<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { ref, watch } from "vue";
import WidgetIcon from '@/assets/images/WidgetIcon.png';
import HeaderSection from '../Details/DetailsHeader/HeaderSection.vue';
import Widget from './Form/Widget.vue';
import ZoneIcon from '@/shared/icons/ZoneIcon.vue';

const visible = ref(false);
const SelectedWidget = ref<boolean>(false);

watch(visible, (newValue) => {
  if (!newValue) {
    SelectedWidget.value = false;
  }
});


</script>

<template>
  <button @click="visible = true" class="widget-btn">
    <ZoneIcon />
    <span>{{ $t('add_and_update_your_widget') }}</span>
  </button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true"
    :style="{ width: `60rem`, height: `${SelectedWidget ? '100%' : '50%'}` }">
    <template #header>
      <div class="add-widget-header">
        <HeaderSection :img="WidgetIcon" title="Widget Settings & Customization"
          subtitle="Easily customize the dashboard layout for your project needs" />
      </div>
    </template>
    <div class="widget-dialog-data">
      <hr class="add-widget-hr" />
      <Widget @selected:widget="SelectedWidget = $event" />
    </div>
  </Dialog>
</template>
