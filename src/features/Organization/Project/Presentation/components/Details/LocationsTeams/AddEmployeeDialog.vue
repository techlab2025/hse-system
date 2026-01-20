<script setup lang="ts">
import { ref } from "vue";
import HeaderSection from '../DetailsHeader/HeaderSection.vue';
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import Dialog from 'primevue/dialog';
import CustomSelectInput from "@/shared/FormInputs/CustomSelectInput.vue";
import type TitleInterface from "@/base/Data/Models/title_interface";
import IndexHerikalyController from "@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController";
import IndexHerikalyParams from "@/features/Organization/Herikaly/Core/params/indexHerikalyParams";
import IndexOrganizatoinEmployeeController from "@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController";
import IndexOrganizatoinEmployeeParams from "@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams";

const props = defineProps<{

}>()
const SelectedHierarchy = ref<TitleInterface>()
const setSelectedHierarchy = (data: TitleInterface) => {
  SelectedHierarchy.value = data
  indexOrganizatoinEmployeeParams.value = new IndexOrganizatoinEmployeeParams("", 1, 10, 0, SelectedHierarchy.value?.id)
}
const SelectedEmployee = ref<TitleInterface>()
const setSelectedEmployee = (data: TitleInterface) => {
  SelectedEmployee.value = data
}
const visible = ref(false);

const indexHerikalyController = IndexHerikalyController.getInstance()
const HerikalyParams = new IndexHerikalyParams("", 1, 10, 0, false)

const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexOrganizatoinEmployeeParams = ref(new IndexOrganizatoinEmployeeParams("", 1, 10, 0, SelectedHierarchy.value?.id))




</script>
<template>

  <button @click.prevent="visible = true" class="btn btn-primary">{{ $t('add_employee') }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <HeaderSection :img="ZoneDialog" title="Select Employees"
        subtitle="At least 1 Employees required for every location" />
    </template>

    <div class="input-wrapper">
      <CustomSelectInput :required="false" :modelValue="SelectedHierarchy" :controller="indexHerikalyController"
        :params="HerikalyParams" label="Hierarchy" id="Hierarchy" placeholder="Select Hierarchy"
        @update:modelValue="setSelectedHierarchy" />
    </div>
    <div class="input-wrapper">
      <CustomSelectInput :required="false" :modelValue="SelectedEmployee"
        :controller="indexOrganizatoinEmployeeController" :params="indexOrganizatoinEmployeeParams" label="Employee"
        id="Employee" placeholder="Select Employee" @update:modelValue="setSelectedEmployee" />
    </div>

  </Dialog>
</template>

<style scoped>
.btn-primary {
  margin-top: 10px;
}
</style>
