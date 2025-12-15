<script setup lang="ts">
import { ref, watch } from 'vue';
import { EmployeeNameStatus } from '../../../Core/Enums/EmplyeeNameStatus';

const props = defineProps<{
  selectedstatus?: EmployeeNameStatus
}>();
const emit = defineEmits(['update:data'])
const employeeStatus = ref<EmployeeNameStatus>(props.selectedstatus || EmployeeNameStatus.Select);

watch(employeeStatus, () => {
  emit('update:data', employeeStatus.value)
})
</script>
<template>
  <div class="employee-select-container">
    <div class="employee-select" :class="employeeStatus == EmployeeNameStatus.Select ? 'selected' : ''">
      <label for="select">{{ $t('select') }}</label>
      <input id="select" type="radio" v-model="employeeStatus" :value="EmployeeNameStatus.Select">
    </div>
    <div class="employee-select" :class="employeeStatus == EmployeeNameStatus.Name ? 'selected' : ''">
      <label for="add_name">{{ $t('add_name') }}</label>
      <input id="add_name" type="radio" v-model="employeeStatus" :value="EmployeeNameStatus.Name">
    </div>
  </div>
</template>
