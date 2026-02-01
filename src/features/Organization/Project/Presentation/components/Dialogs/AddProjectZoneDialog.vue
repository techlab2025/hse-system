<script setup lang="ts">
import Dialog from 'primevue/dialog';
import AddEmployee from '@/assets/images/AddEmployee.png';
import { ref } from "vue";
import AddProjectZone from '@/features/Organization/ProjectZone/Presentation/components/AddProjectZone.vue';
import HeaderSection from '../Details/DetailsHeader/HeaderSection.vue';

const emit = defineEmits(['update:data'])
const visible = ref(false);
const updateData = () => {
  visible.value = false
  emit('update:data')
}
</script>

<template>
  <button @click.prevent="visible = true" class="add-dialog">new</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem', height: '65%' }">
    <template #header>
      <div class="add-employee-header">
        <HeaderSection :img="AddEmployee" :title="$t('add your Zone')" :subtitle="$t('follow the steps to add your Zone easly')" />
      </div>
    </template>

    <AddProjectZone @update:data="updateData" />

  </Dialog>
</template>

<style scoped>
.add-dialog {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  cursor: pointer;
  color: #1d4ed8;
  text-decoration: underline;
  font-family: 'Regular';

  svg {
    width: 18px;
    height: 18px;
  }
}
</style>
