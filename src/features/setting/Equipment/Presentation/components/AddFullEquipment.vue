<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import FullEquipmentFrom from './FullEquipmentFrom.vue'
import AddEquipmentController from '../controllers/addEquipmentController'
import type AddEquipmentParams from '../../Core/params/addEquipmentParams'
import EmployeeInterfaceCard from '@/features/EmployeeInterface/Presentation/supcomponents/Card/EmployeeInterfaceCard.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof FullEquipmentFrom> | null>(null)

const addEquipmentController = AddEquipmentController.getInstance()
const emit = defineEmits(['update:data', 'close:dialog'])

const addEquipment = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  console.log(params.value, 'params')
  addEquipmentController.setLoading()
  await addEquipmentController.addEquipment(params.value as AddEquipmentParams, router)
  if (addEquipmentController.isDataSuccess()) emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addEquipmentController.setLoading()
  await addEquipmentController.addEquipment(
    params.value as AddEquipmentParams,
    stayOnPageRouter,
    true,
  )
  if (addEquipmentController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-8" @submit.prevent="addEquipment">
    <FullEquipmentFrom ref="formRef" :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <div class="equipment-form-actions create-form-actions">
        <router-link
          v-if="route.path.includes('equipment/add') && !route.path.includes('project-progress')"
          to="/organization/equipments"
          @click.prevent=""
          class="btn btn-danger"
        >
          <span>Cancel</span>
        </router-link>
        <button type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
          {{ $t('save and new') }}
        </button>
        <button type="submit" class="btn btn-primary">
          <span>
            {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
          </span>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
.button-wrapper {
  width: 100%;
}

.equipment-form-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;

  > .btn {
    flex: 1 1 0;
    width: auto;
    min-width: 0;
  }
}
</style>
