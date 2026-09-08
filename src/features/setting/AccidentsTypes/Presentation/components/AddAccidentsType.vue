<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddHazardTypeParams from '@/features/setting/HazardType/Core/params/addHazardTypeParams.ts'
import type Params from '@/base/core/params/params'
import AddAccidentsTypeController from '../controllers/addAccidentsTypeController'
import AccidentsTypeForm from './AccidentsTypeForm.vue'

const router = useRouter()
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])
const addAccidentsTypeController = AddAccidentsTypeController.getInstance()

const addAccidentsType = async () => {
  addAccidentsTypeController.setLoading()
  await addAccidentsTypeController.addAccidentsType(params.value as AddHazardTypeParams, router)
  if (addAccidentsTypeController.isDataSuccess()) emit('update:data')
}

const saveAndAdd = async () => {
  addAccidentsTypeController.setLoading()
  await addAccidentsTypeController.addAccidentsType(
    params.value as AddHazardTypeParams,
    router,
    true,
  )
  if (addAccidentsTypeController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addAccidentsType">
    <AccidentsTypeForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button
        v-if="route.path.includes('project-progress')"
        type="button"
        @click.prevent="saveAndAdd"
        class="btn btn-primary w-1/2"
      >
        {{ $t('save and add') }}
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
    &.w-full { width: 100%; }
    &.w-1\/2 { width: 50%; }
  }
}
</style>
