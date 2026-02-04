<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ReplaceTicketParams from '../../../Core/params/replaceTicketParams'
import ReplaceTicketController from '../../controllers/replaceTicketController'
import HeaderSection from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderSection.vue'

const visible = ref(false)

const route = useRoute()

const reply = ref('')

const { ticketId } = defineProps<{
  ticketId?: number
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const resolveTicket = () => {
  const params = new ReplaceTicketParams({
    ticketId: ticketId ? ticketId : +route?.params?.ticket_id,
    reply: reply.value,
  })

  ReplaceTicketController.getInstance().ReplaceTicket(params)

  emit('refresh')
  visible.value = false
}
</script>

<template>
  <div class="card flex justify-center w-full">
    <button class="btn !bg-[#A63343] !text-white w-full" @click="visible = true">
      {{ $t('resolve') }}
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
          subtitle="If the problem has been fully resolved, Resolve the ticket. If it hasn't been resolved, please let us know about the issue."
        />
      </template>

      <div class="input-wrapper">
        <label for="reply">{{ $t('reply') }}</label>
        <textarea id="reply" v-model="reply" :placeholder="$t('reply')"></textarea>
      </div>

      <button class="btn btn-primary w-full !mt-4" @click="resolveTicket">{{ $t('Send') }}</button>
    </Dialog>
  </div>
</template>
