<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexEmployeeParams from '@/features/employee/Core/params/indexEmployeeParams'
import IndexEmployeeController from '@/features/employee/Presentation/controllers/indexEmployeeController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import { ref } from 'vue'
import InspectionTypeSelection from '../InspectionUtils/InspectionTypeSelection.vue'
import InspectionTemplateDialog from '../InspectionDialog/InspectionTemplateDialog.vue'

const emit = defineEmits(['update:data'])
const SelectedEmployee = ref<TitleInterface>()
const indexEmployeeController = IndexEmployeeController.getInstance()
const indexEmployeeParams = new IndexEmployeeParams('', 1, 10, 1)

const UpdateData = () => {
  emit('update:data', {
    employee: SelectedEmployee.value,
  })
}
const setEmployee = (data: TitleInterface) => {
  SelectedEmployee.value = data
  UpdateData()
}

const inspectionType = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'day' }),
  new TitleInterface({ id: 2, title: 'period' }),
])
</script>
<template>
  <div class="input-wrapper">
    <CustomSelectInput
      :modelValue="SelectedEmployee"
      class="input"
      :controller="indexEmployeeController"
      :params="indexEmployeeParams"
      label="Employee"
      id="employee"
      placeholder="select your employee"
      @update:modelValue="setEmployee"
    />
    <!-- Dialog -->
    <InspectionTemplateDialog  @update:data="UpdateData"/>

    <InspectionTypeSelection :options="inspectionType" :title="`inspect type`" />
  </div>
</template>
