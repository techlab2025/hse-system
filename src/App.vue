<script setup lang="ts">
import LoaderDialog from './base/Presentation/Dialogs/LoaderDialogs/LoaderDialog.vue'
import MainDialog from './base/Presentation/Dialogs/MainDialogs/MainDialog.vue'
import Toast from 'primevue/toast'
import TicketIcon from './shared/icons/TicketIcon.vue';
import { ref } from 'vue';
import { useTicketStore } from './stores/TicketStor';
import TicketDialog from './features/Organization/Ticket/Presentation/components/TicketDialog/TicketDialog.vue';
import { useRoute } from 'vue-router';


const ticketStore = useTicketStore()
const route = useRoute()
</script>

<template>
  <Toast />
  <MainDialog />
  <LoaderDialog />
  <RouterView />
  <TicketIcon v-if="!route.path.includes('ticket')" class="ticket-icon" @click="ticketStore.captureScreen" />
  <TicketDialog />
</template>
