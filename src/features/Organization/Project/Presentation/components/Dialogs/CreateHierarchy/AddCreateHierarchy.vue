<script setup lang="ts">
import Dialog from 'primevue/dialog'
import CreateHierarchy from '@/assets/images/add_Hierarchy.png'
import { ref } from 'vue'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import CreateHierarchyForm from './CreateHierarchyForm.vue'
const visible = ref(false)
</script>

<template>
  <button @click="visible = true">{{ $t('add_Hierarchy') }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <div class="add-equipment-header">
        <HeaderSection
          :img="CreateHierarchy"
          title="functional Hierarchy"
          subtitle="add & delete in your hierarchy for this location"
        />
      </div>
    </template>
    <div class="equipment-dialog-data">
      <hr class="add-equipment-hr" />
      <CreateHierarchyForm />
    </div>
  </Dialog>
</template>
