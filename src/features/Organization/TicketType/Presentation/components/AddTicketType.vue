<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AddTicketTypeController from '@/features/Organization/TicketType/Presentation/controllers/addTicketTypeController.ts'
import AddTicketTypeParams from '@/features/Organization/TicketType/Core/params/addTicketTypeParams.ts'
import type Params from '@/base/core/params/params'
import TicketTypeForm from './TicketTypeForm.vue'

const router = useRouter()
const emit = defineEmits(['close:data'])
const params = ref<Params | null>(null)

const addTicketTypeController = AddTicketTypeController.getInstance()

const addTicketType = async () => {
  await addTicketTypeController.addTicketType(params.value as AddTicketTypeParams, router)
  emit('close:data')
}
const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="addTicketType">
    <TicketTypeForm @update:data="setParams" />

    <div class="col-span-4 button-wrapper">
      <button type="submit" class="btn btn-primary">Add</button>
    </div>
  </form>
</template>

<style scoped></style>
