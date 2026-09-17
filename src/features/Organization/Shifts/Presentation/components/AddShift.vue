<script lang="ts" setup>
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddShiftController from '../controllers/AddShiftController'
import type AddShiftParams from '../../Core/params/AddShiftParams'
import ShiftForm from './ShiftForm.vue'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const params = ref<Params | null>(null)
const formKey = ref(0)

const emit = defineEmits(['close:dialog'])
const addShiftController = AddShiftController.getInstance()

const addShift = async () => {
  await addShiftController.addShift(params.value as AddShiftParams, router)
  emit('close:dialog')
}

const saveAndNew = async () => {
  addShiftController.setLoading()
  await addShiftController.addShift(params.value as AddShiftParams, stayOnPageRouter)
  if (addShiftController.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addShift">
    <ShiftForm :key="formKey" @update:data="setParams" />

    <div class="col-span-4 button-wrapper create-form-actions">
      <button type="button" class="btn btn-secondary" @click.prevent="saveAndNew">
        {{ $t('save and new') }}
      </button>
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
