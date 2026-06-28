<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import ShowShiftController from '../controllers/ShowShiftController'
import ShowShiftParams from '../../Core/params/ShowShiftParams'
import EditShiftController from '../controllers/EditShiftController'
import ShiftForm from './ShiftForm.vue'
import type EditShiftParams from '../../Core/params/EditShiftParams.ts'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<EditShiftParams>()

const showShiftController = ShowShiftController.getInstance()
const state = ref(showShiftController.state.value)
const fetchShiftDetails = async () => {
  const ShiftParams = new ShowShiftParams(Number(id))

  await showShiftController.showShift(ShiftParams)
}

onMounted(() => {
  fetchShiftDetails()
})

const EditShift = async () => {
  await EditShiftController.getInstance().editShift(params.value!, router)
}

watch(
  () => showShiftController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
)

const setParams = (data: EditShiftParams) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <form @submit.prevent="EditShift" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ShiftForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>
