<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RootCausesForm from '@/features/setting/RootCauses/Presentation/components/RootCausesForm.vue'
import AddRootCausesController from '@/features/setting/RootCauses/Presentation/controllers/addRootCausesController.ts'
import AddRootCausesParams from '@/features/setting/RootCauses/Core/params/addRootCausesParams.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const emit = defineEmits(['close:data', 'update:data'])
const params = ref<Params | null>(null)
const formKey = ref(0)

const addRootCausesController = AddRootCausesController.getInstance()

const addRootCauses = async () => {
  addRootCausesController.setLoading()
  await addRootCausesController.addRootCauses(params.value as AddRootCausesParams, router)
  if (addRootCausesController.isDataSuccess()) {
    emit('close:data')
    emit('update:data')
  }
}

const saveAndNew = async () => {
  addRootCausesController.setLoading()
  await addRootCausesController.addRootCauses(
    params.value as AddRootCausesParams,
    stayOnPageRouter,
    true,
  )
  if (addRootCausesController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addRootCauses">
    <RootCausesForm :key="formKey" @update:data="setParams" />

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
