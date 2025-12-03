<script setup lang="ts">
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import { ref } from 'vue';
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams';
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController';
import InspectionGeneralForm from './InspectionGeneralForm.vue';
import TitleInterface from '@/base/Data/Models/title_interface'
// import IndexEmployeeParams from '@/features/employee/Core
import InspectionTemplateDialog from '../InspectionDialog/InspectionTemplateDialog.vue'

const emit = defineEmits(['update:data'])
const SelectedEmployee = ref<TitleInterface>()

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()

const indexEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)

const UpdateData = () => {
  emit('update:data', {
    morph: SelectedEmployee.value,
    data: Data.value,
    TempalteIds: TempalteIds.value
  })
}
const setEmployee = (data: TitleInterface) => {
  SelectedEmployee.value = data
  UpdateData()
}
const Data = ref()

const GetGeneralData = (data) => {
  Data.value = data
  UpdateData()
}
const TempalteIds = ref<number>()
const GetTemplateId = (data: number) => {
  TempalteIds.value = data
  UpdateData()
}
</script>

<template>
  <div class="input-wrapper">
    <CustomSelectInput :modelValue="SelectedEmployee" class="input" :controller="indexOrganizatoinEmployeeController"
      :params="indexEmployeeParams" label="Employee" id="employee" placeholder="select your employee"
      @update:modelValue="setEmployee" />
    <!-- Dialog -->
    <InspectionTemplateDialog @update:data="GetTemplateId" />
  </div>
  <InspectionGeneralForm @update:data="GetGeneralData" />
</template>
