<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import { ref } from 'vue';
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams';
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController';
import InspectionGeneralForm from './InspectionGeneralForm.vue';

const emit = defineEmits(['update:data'])
const SelectedEmployee = ref<TitleInterface>()
const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()

const indexEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)

const UpdateData = () => {
  emit('update:data', {
    employee: SelectedEmployee.value,
    data: Data.value

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

</script>
<template>
  <div class="input-wrapper">
    <CustomSelectInput :modelValue="SelectedEmployee" class="input" :controller="indexOrganizatoinEmployeeController"
      :params="indexEmployeeParams" :label="$t('employee')" id="employee" placeholder="select your employee"
      @update:modelValue="setEmployee" />
  </div>
  <!-- Dialog -->
  <InspectionGeneralForm @update:data="GetGeneralData" />
</template>
