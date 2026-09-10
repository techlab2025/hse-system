<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import type AddIncidentCategoryParams from '../../Core/params/addIncidentCategoryParams'
import AddIncidentCategoryController from '../controllers/addIncidentCategoryController'
import IncidentCategoryForm from './IncidentCategoryForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const formRef = ref<InstanceType<typeof IncidentCategoryForm> | null>(null)
const emit = defineEmits(['update:data'])
const addIncidentCategoryController = AddIncidentCategoryController.getInstance()

const addIncidentCategory = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  await addIncidentCategoryController.addIncidentCategory(
    params.value as AddIncidentCategoryParams,
    router,
  )
  emit('update:data')
}

const saveAndNew = async () => {
  if (!(await formRef.value?.validateRequiredFields())) return
  const state = addIncidentCategoryController.setLoading()
  await addIncidentCategoryController.addIncidentCategory(
    params.value as AddIncidentCategoryParams,
    stayOnPageRouter,
    true,
  )
  if (!state.value.error) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addIncidentCategory">
    <IncidentCategoryForm ref="formRef" :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">
        {{ $t('save') }}
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
