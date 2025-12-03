<script setup lang="ts">
import { ref } from 'vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'

const props = defineProps<{
  heirarchyId?: number
}>()
const indexEmployeeTypeController = IndexOrganizatoinEmployeeController.getInstance()
const indexEmployeeTypeParams = new IndexOrganizatoinEmployeeParams('', 0, 0, 0, props.heirarchyId)
const emit = defineEmits(['update:employee'])


const employees = ref<TitleInterface[] | []>([])

const updateEmployee = (value: TitleInterface[] | []) => {
  employees.value = value
  emit('update:employee', value)
}
</script>

<template>
  <div class="equipment-form">
    <form>
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="employees" :params="indexEmployeeTypeParams"
            :controller="indexEmployeeTypeController" class="input" :label="$t('employee')" :type="2" id="employee"
            :placeholder="$t('employee')" @update:modelValue="updateEmployee" />
        </div>
      </div>
    </form>
  </div>
</template>
