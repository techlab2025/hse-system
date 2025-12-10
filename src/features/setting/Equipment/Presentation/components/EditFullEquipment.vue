<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import FullEquipmentFrom from './FullEquipmentFrom.vue'
import ShowEquipmentController from '../controllers/showEquipmentController'
import EditEquipmentController from '../controllers/editEquipmentController'
import ShowEquipmentParams from '../../Core/params/showEquipmentParams'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showEquipmentController = ShowEquipmentController.getInstance()
const state = ref(showEquipmentController.state.value)


const fetchEquipmentDetails = async () => {
  const params = new ShowEquipmentParams(Number(id))
  await showEquipmentController.showEquipmentType(params)
}

onMounted(() => {
  fetchEquipmentDetails()
})

const EditEquipment = async (draft: boolean) => {
  if (draft) {
    await EditEquipmentController.getInstance().editEquipment(params.value!, router)
  } else {
    await EditEquipmentController.getInstance().editEquipment(params.value!, router)
  }
}

watch(
  () => showEquipmentController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditEquipment">
        <FullEquipmentFrom @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
