<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ObserverationTypeForm from '@/features/setting/ObserverationType/Presentation/components/ObserverationTypeForm.vue'
import AddObserverationTypeController from '@/features/setting/ObserverationType/Presentation/controllers/addObserverationTypeController.ts'
import AddObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/addObserverationTypeParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])
const addObserverationTypeController = AddObserverationTypeController.getInstance()

const addObserverationType = async () => {
  console.log(params.value, 'params')
  addObserverationTypeController.setLoading()
  await addObserverationTypeController.addObserverationType(
    params.value as AddObserverationTypeParams,
    router,
  )
  if (addObserverationTypeController.isDataSuccess()) emit('update:data')
}

const saveAndNew = async () => {
  addObserverationTypeController.setLoading()
  await addObserverationTypeController.addObserverationType(
    params.value as AddObserverationTypeParams,
    stayOnPageRouter,
    true,
  )
  if (addObserverationTypeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addObserverationType">
    <ObserverationTypeForm :key="formKey" @update:data="setParams" />

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
