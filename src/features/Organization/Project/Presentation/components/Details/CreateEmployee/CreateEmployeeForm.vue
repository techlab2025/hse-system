<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
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

const employees = ref<TitleInterface[]>(
  props.employess?.map((item) => ({ id: item?.employeeId, title: item?.name }) as TitleInterface) ||
    [],
)

const updateEmployee = (value: TitleInterface[] | []) => {
  employees.value = value
  emit('update:employee', employees.value.length > 0 ? employees.value : [])
}

const EmployeeVisable = ref<boolean>()
const ShowEmployeeDialog = () => {
  EmployeeVisable.value = true
}

onMounted(() => {
  updateEmployee(employees.value)
})
</script>

<template>
  <div class="equipment-form employee-selector">
    <form>
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput
            :modelValue="employees"
            :params="indexEmployeeTypeParams"
            :controller="indexEmployeeTypeController"
            class="input"
            :label="$t('employee')"
            :type="2"
            id="employee"
            :placeholder="$t('employee')"
            @update:modelValue="updateEmployee"
            :onclick="ShowEmployeeDialog"
          />
        </div>
      </div>
      <div class="selected-employees" v-if="employees.length">
        <div class="selection-header">
          <span>{{ $t('Assigned employees') }}</span>
          <strong>{{ employees.length }}</strong>
        </div>
        <div class="employee-chips">
          <span v-for="employee in employees" :key="employee.id" class="employee-chip">
            <i>{{ employee.title?.trim()?.charAt(0) || 'E' }}</i>
            <span>{{ employee.title }}</span>
          </span>
        </div>
      </div>
      <div class="selection-empty" v-else>
        <span class="empty-icon" aria-hidden="true">+</span>
        <span>
          <strong>{{ $t('No employees assigned') }}</strong>
          <small>{{ $t('Open the employee selector to build this position team.') }}</small>
        </span>
      </div>
      <EmployeeSelectDialog v-model:visible="EmployeeVisable" :heirarchy-id="props.heirarchyId" />
    </form>
  </div>
</template>

<style scoped lang="scss">
.employee-selector {
  width: 100%;
  padding: 12px !important;
}
.employee-selector form,
.input-container,
.input-wrapper {
  width: 100%;
}
.input-container {
  margin: 0 !important;
  padding: 0 !important;
}
.selected-employees,
.selection-empty {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: var(--surface-1);
}
.selection-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  color: var(--text-soft);
  font-size: 0.59rem;
  font-weight: 800;
}
.selection-header strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 25px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
  font-family: 'Bold';
}
.employee-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.employee-chip {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 6px;
  padding: 5px 8px 5px 5px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 10px;
  color: var(--text-strong);
  background: color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-1));
  font-size: 0.61rem;
  font-weight: 750;
}
.employee-chip > i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 8px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-800));
  font-family: 'Bold';
  font-size: 0.58rem;
  font-style: normal;
  text-transform: uppercase;
}
.employee-chip > span {
  overflow: hidden;
  max-width: 145px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selection-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 62px;
  gap: 8px;
  border-style: dashed;
  background: color-mix(in srgb, var(--surface-2) 46%, var(--surface-1));
}
.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 9px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  font-size: 1rem;
}
.selection-empty > span:last-child {
  display: flex;
  flex-direction: column;
}
.selection-empty strong {
  color: var(--text-strong);
  font-size: 0.64rem;
}
.selection-empty small {
  color: var(--text-soft);
  font-size: 0.55rem;
  line-height: 1.4;
}
</style>
