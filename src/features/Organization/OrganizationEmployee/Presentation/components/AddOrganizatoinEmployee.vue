<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddOrganizatoinEmployeeController from '../controllers/addOrganizatoinEmployeeController'
import type AddOrganizatoinEmployeeParams from '../../Core/params/addOrganizatoinEmployeeParams'
import OrganizatoinEmployeeForm from './OrganizatoinEmployeeForm.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  heirarchyId?: number
}>()
const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof OrganizatoinEmployeeForm> | null>(null)

const addOrganizatoinEmployeeController = AddOrganizatoinEmployeeController.getInstance()

const addOrganizatoinEmployee = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  console.log(params.value, 'params value')
  addOrganizatoinEmployeeController.setLoading()
  const state = await addOrganizatoinEmployeeController.addOrganizatoinEmployee(
    params.value as AddOrganizatoinEmployeeParams,
    router,
  )
  const isSuccess =
    state &&
    (state.value.error?.title?.includes('successfully') ||
      addOrganizatoinEmployeeController.isDataSuccess())
  if (isSuccess) emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  addOrganizatoinEmployeeController.setLoading()
  const state = await addOrganizatoinEmployeeController.addOrganizatoinEmployee(
    params.value as AddOrganizatoinEmployeeParams,
    stayOnPageRouter,
    true,
  )
  const isSuccess =
    state &&
    (state.value.error?.title?.includes('successfully') ||
      addOrganizatoinEmployeeController.isDataSuccess())

  if (isSuccess) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addOrganizatoinEmployee">
    <OrganizatoinEmployeeForm
      ref="formRef"
      :key="formKey"
      :heirarchy-id="props.heirarchyId"
      @update:data="setParams"
    />
    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :class="route.path.includes('project-progress') ? 'w-1/2' : 'w-full'"
      >
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
