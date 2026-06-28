<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type Params from '@/base/core/params/params'
import AddShiftController from '../controllers/AddShiftController'
import type AddShiftParams from '../../Core/params/AddShiftParams'
import ShiftForm from './ShiftForm.vue'

const router = useRouter()
const params = ref<Params | null>(null)

const emit = defineEmits(['close:dialog'])
const addShiftController = AddShiftController.getInstance()

const addShift = async () => {
  await addShiftController.addShift(params.value as AddShiftParams, router)
  emit('close:dialog')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addShift">
    <ShiftForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style scoped></style>
