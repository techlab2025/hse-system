<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EquipmentTypeForm from '@/features/setting/EquipmentType/Presentation/components/EquipmentTypeForm.vue'
import AddEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/addEquipmentTypeController.ts'
import AddEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/addEquipmentTypeParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const emit = defineEmits(['close:data', 'update:data'])
const params = ref<Params | null>(null)
const formKey = ref(0)

const addEquipmentTypeController = AddEquipmentTypeController.getInstance()

const addEquipmentType = async () => {
  addEquipmentTypeController.setLoading()
  await addEquipmentTypeController.addEquipmentType(params.value as AddEquipmentTypeParams, router)
  if (addEquipmentTypeController.isDataSuccess()) {
    emit('close:data')
    emit('update:data')
  }
}

const saveAndNew = async () => {
  addEquipmentTypeController.setLoading()
  await addEquipmentTypeController.addEquipmentType(
    params.value as AddEquipmentTypeParams,
    stayOnPageRouter,
    true,
  )
  if (addEquipmentTypeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addEquipmentType">
    <EquipmentTypeForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.button-wrapper {
  display: flex;
  gap: 1rem;
  flex-direction: row !important;
  width: 100% !important;
  button {
    &.w-full {
      width: 100%;
    }
    &.w-1\/2 {
      width: 50%;
    }
  }
}
</style>
