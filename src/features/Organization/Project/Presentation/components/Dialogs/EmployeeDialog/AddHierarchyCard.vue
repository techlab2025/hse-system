<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import LocationIcon from '@/shared/icons/LocationIcon.vue';
import { ref } from 'vue';
const employee = ref<TitleInterface>()
const employees = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Employee 1', subtitle: '' }),
  new TitleInterface({ id: 2, title: 'Employee 2', subtitle: '' }),
  new TitleInterface({ id: 3, title: 'Employee 3', subtitle: '' }),
])
const setEmployee = (data: TitleInterface) => {
  employee.value = data
}

</script>
<template>
  <div class="add-employee-cards-container">
    <div class="add-employee-cards">
      <div class="add-employee-card">
        <div class="add-employee-card-header">
          <LocationIcon />
          <p class="title">Alexandria</p>
        </div>
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="employee" :static-options="employees" class="input"
            label="functional Hierarchy" id="Employee" placeholder="select your functional Hierarchy"
            @update:modelValue="setEmployee" />
        </div>
      </div>
      <div class="add-employee-card">
        <div class="add-employee-card-header">
          <LocationIcon />
          <p class="title">Cairo</p>
        </div>
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="employee" :static-options="employees" class="input"
            label="functional Hierarchy" id="Employee" placeholder="select your functional Hierarchy"
            @update:modelValue="setEmployee" />
        </div>
      </div>
      <div class="add-employee-card">
        <div class="add-employee-card-header">
          <LocationIcon />
          <p class="title">Cairo</p>
        </div>
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="employee" :static-options="employees" class="input"
            label="functional Hierarchy" id="Employee" placeholder="select your functional Hierarchy"
            @update:modelValue="setEmployee" />
        </div>
      </div>
    </div>
    <div class="submit-btn">
      <button class="btn btn-ptimary">confirm</button>
    </div>
  </div>
</template>
