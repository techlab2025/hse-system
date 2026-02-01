<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditTicketController from '@/features/Organization/Ticket/Presentation/controllers/editTicketController.ts'
import ShowTicketParams from '@/features/Organization/Ticket/Core/params/showTicketParams.ts'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import TicketForm from './TicketForm.vue'
import ShowTicketController from '../controllers/showTicketController'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showTicketController = ShowTicketController.getInstance()
const state = ref(showTicketController.state.value)
const fetchTicketDetails = async () => {
  const TicketParams = new ShowTicketParams(Number(id))

  await showTicketController.showTicket(TicketParams)
}

onMounted(() => {
  fetchTicketDetails()
})

const EditTicket = async (draft: boolean) => {
  if (draft) {
    await EditTicketController.getInstance().editTicket(params.value!, router)
  } else {
    await EditTicketController.getInstance().editTicket(params.value!, router)
  }
}

watch(
  () => showTicketController.state.value,
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
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditTicket">
        <TicketForm @update:data="setParams" :data="state.data!" />
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
