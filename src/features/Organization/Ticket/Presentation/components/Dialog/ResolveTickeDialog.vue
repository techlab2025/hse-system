<script setup lang="ts">
import ResolveTicketParams from '@/features/Organization/Tickets/Core/params/resolveTicketParams'
import HeaderSection from '@/shared/LayoutComponents/HeaderSection.vue'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ResolveTicketController from '../../../controllers/resolveTicketController'

const visible = ref(false)

const route = useRoute()

const description = ref('')

const { ticketId } = defineProps<{
  ticketId?: number
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const resolveTicket = () => {
  const params = new ResolveTicketParams({
    ticketId: ticketId ? ticketId : +route?.params?.ticket_id,
    description: description.value,
  })

  ResolveTicketController.getInstance().ResolveTicket(params)

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
        <label for="description">{{ $t('description') }}</label>
        <textarea
          id="description"
          v-model="description"
          :placeholder="$t('description')"
        ></textarea>
      </div>

      <button class="btn btn-primary w-full !mt-4" @click="resolveTicket">{{ $t('Send') }}</button>
    </Dialog>
  </div>
</template>
