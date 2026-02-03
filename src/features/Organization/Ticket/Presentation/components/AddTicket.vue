<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AddTicketController from '@/features/Organization/Ticket/Presentation/controllers/addTicketController.ts'
import AddTicketParams from '@/features/Organization/Ticket/Core/params/addTicketParams.ts'
import type Params from '@/base/core/params/params'
import TicketForm from './TicketForm.vue'

const router = useRouter()
const emit = defineEmits(['close:data'])
const params = ref<Params | null>(null)

const addTicketController = AddTicketController.getInstance()

const addTicket = async () => {
  console.log(params.value, 'params.value')
  await addTicketController.addTicket(params.value as AddTicketParams, router)
  emit('close:data')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addTicket">
    <TicketForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
