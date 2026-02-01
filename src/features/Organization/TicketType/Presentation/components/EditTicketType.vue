<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditTicketTypeController from '@/features/Organization/TicketType/Presentation/controllers/editTicketTypeController.ts'
import ShowTicketTypeParams from '@/features/Organization/TicketType/Core/params/showTicketTypeParams.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import TicketTypeForm from './TicketTypeForm.vue'
import ShowTicketTypeController from '../controllers/showTicketTypeController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showTicketTypeController = ShowTicketTypeController.getInstance()
const state = ref(showTicketTypeController.state.value)
const fetchTicketTypeDetails = async () => {
  const TicketTypeParams = new ShowTicketTypeParams(Number(id))

  await showTicketTypeController.showTicketType(TicketTypeParams)
}

onMounted(() => {
  fetchTicketTypeDetails()
})

const EditTicketType = async (draft: boolean) => {
  if (draft) {
    await EditTicketTypeController.getInstance().editTicketType(params.value!, router)
  } else {
    await EditTicketTypeController.getInstance().editTicketType(params.value!, router)
  }
}

watch(
  () => showTicketTypeController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditTicketType">
        <TicketTypeForm @update:data="setParams" :data="state.data!" />
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
