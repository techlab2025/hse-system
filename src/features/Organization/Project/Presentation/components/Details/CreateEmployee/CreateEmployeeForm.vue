<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import EmployeeSelectDialog from '../../SelectDialogs/EmployeeSelectDialog.vue'
import type ProjectLocationEmployeeModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEmployeeModel'

const props = defineProps<{
  heirarchyId?: number
  employess: ProjectLocationEmployeeModel[]
}>()
const indexEmployeeTypeController = IndexOrganizatoinEmployeeController.getInstance()
const indexEmployeeTypeParams = new IndexOrganizatoinEmployeeParams('', 0, 0, 0, props.heirarchyId)
const emit = defineEmits(['update:employee'])


const employees = ref<TitleInterface[] | []>(props.employess?.map((item) => new TitleInterface({ id: item?.employeeId, title: item?.name })) || [])

const updateEmployee = (value: TitleInterface[] | []) => {
  employees.value = value
  // console.log(employees.value, "employees.value")
  emit('update:employee', employees.value.length > 0 ? employees.value : [])
}

const EmployeeVisable = ref<boolean>()
const ShowEmployeeDialog = () => {
  EmployeeVisable.value = true
}

onMounted(() => {
  updateEmployee(employees.value)
})

// watch(() => props.employess, (newvalue) => {
//   employees.value = newvalue?.map((item) => new TitleInterface({ id: item?.employeeId, title: item?.name })) || []ك
//   updateEmployee(employees.value)
// })

</script>

<template>
  <div class="equipment-form">
    <form>
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="employees" :params="indexEmployeeTypeParams"
            :controller="indexEmployeeTypeController" class="input" :label="$t('employee')" :type="2" id="employee"
            :placeholder="$t('employee')" @update:modelValue="updateEmployee" :onclick="ShowEmployeeDialog" />
        </div>
      </div>
      <EmployeeSelectDialog v-model:visible="EmployeeVisable" />
    </form>
  </div>
</template>
