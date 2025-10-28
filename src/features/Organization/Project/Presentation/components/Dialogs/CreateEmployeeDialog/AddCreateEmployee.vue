<script setup lang="ts">
import Dialog from 'primevue/dialog'
import CreateEmployee from '@/assets/images/create_emp.png'
import { ref } from 'vue'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import CreateEmployeeForm from './CreateEmployeeForm.vue'
const visible = ref(false)
</script>

<template>
  <button @click="visible = true">{{ $t('add_employee') }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <div class="add-equipment-header">
        <HeaderSection
          :img="CreateEmployee"
          title="add your employees"
          subtitle="select your employee that matchs your hierarchy in this location"
        />
      </div>
    </template>
    <div class="equipment-dialog-data">
      <hr class="add-equipment-hr" />
      <CreateEmployeeForm />
    </div>
  </Dialog>
</template>
