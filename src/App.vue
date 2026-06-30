<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import MainDialog from './base/Presentation/Dialogs/MainDialogs/MainDialog.vue'
import Toast from 'primevue/toast'
import TicketIcon from './shared/icons/TicketIcon.vue'
import { useTicketStore } from './stores/TicketStor'
import { useRoute } from 'vue-router'
import ErrorDialog from './base/Presentation/Dialogs/MainDialogs/ErrorDialog.vue'

const LoaderDialog = defineAsyncComponent(
  () => import('./base/Presentation/Dialogs/LoaderDialogs/LoaderDialog.vue'),
)
const TicketDialog = defineAsyncComponent(
  () =>
    import('./features/Organization/Ticket/Presentation/components/TicketDialog/TicketDialog.vue'),
)

const ticketStore = useTicketStore()
const route = useRoute()
const showTicketTools = computed(() => {
  const path = route.path

  return (path.startsWith('/organization') || path.startsWith('/admin')) && !path.includes('ticket')
})
</script>

<template>
  <Toast />
  <MainDialog />
  <ErrorDialog />
  <LoaderDialog />
  <RouterView />
  <TicketIcon v-if="showTicketTools" class="ticket-icon" @click="ticketStore.captureScreen" />
  <TicketDialog v-if="showTicketTools && ticketStore.OpenTicketDialog" />
</template>
