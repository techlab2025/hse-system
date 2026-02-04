<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
import ResolveTickeDialog from './ResolveTickeDialog.vue'
import { useRoute } from 'vue-router'
import ShowTicketParams from '../../../Core/params/showTicketParams'
import ShowTicketController from '../../controllers/showTicketController'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'
import ReplaceTicketParams from '../../../Core/params/replaceTicketParams'
import ReplaceTicketController from '../../controllers/replaceTicketController'
import { StatusEnum } from '../../../Core/Enums/statusEnum'
import CloseTicketParams from '../../../Core/params/closeTicketParams'
import CloseTicketController from '../../controllers/CloseTicketController'

const route = useRoute()

const { ticketId } = defineProps<{
  ticketId?: number
}>()

const visible = ref(false)

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const closeTicket = () => {
  const params = new CloseTicketParams({
    ticketId: ticketId ? ticketId : +route?.params?.ticket_id,
    status: StatusEnum.CLOSED,
  })

  CloseTicketController.getInstance().closeTicket(params)

  emit('refresh')
  visible.value = false
}
</script>

<template>
  <div class="card flex justify-center">
    <button class="btn btn-primary w-full mt-2" @click="visible = true">
      {{ $t('close ticket') }}
    </button>
    <Dialog
      v-model:visible="visible"
      modal
      header="Header"
      :style="{ width: '50vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <HeaderSection
          title="Your problem has been successfully solved"
          subtitle="If the problem has been fully resolved, close the ticket. If it hasn't been resolved, please let us know about the issue."
        />
      </template>

      <div class="flex items-center justify-center gap-3">
        <button class="btn !bg-[#22C197] !text-white w-full" @click="closeTicket">
          {{ $t('close') }}
        </button>

        <ResolveTickeDialog :ticketId="ticketId" @refresh="$emit('refresh')" />
      </div>
    </Dialog>
  </div>
</template>
