<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, watch } from 'vue'
import MainDialog from './base/Presentation/Dialogs/MainDialogs/MainDialog.vue'
import Toast from 'primevue/toast'
import TicketIcon from './shared/icons/TicketIcon.vue'
import { useTicketStore } from './stores/TicketStor'
import { useRoute } from 'vue-router'
import ErrorDialog from './base/Presentation/Dialogs/MainDialogs/ErrorDialog.vue'
import { useThemeMode } from '@/composables/useThemeMode'
import { useSystemIdentity } from '@/composables/useSystemIdentity'
import { USE_SYSTEM_IDENTITY_API } from '@/views/Organization/SystemIdentity.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const LoaderDialog = defineAsyncComponent(
  () => import('./base/Presentation/Dialogs/LoaderDialogs/LoaderDialog.vue'),
)
const TicketDialog = defineAsyncComponent(
  () =>
    import('./features/Organization/Ticket/Presentation/components/TicketDialog/TicketDialog.vue'),
)

const ticketStore = useTicketStore()
const route = useRoute()
const { initThemeMode } = useThemeMode()
const userStore = useUserStore()
const { loadOrganizationIdentity, clearOrganizationIdentity, setIdentityStorageMode } =
  useSystemIdentity()
setIdentityStorageMode(USE_SYSTEM_IDENTITY_API)
watch(
  () =>
    [
      userStore.isAuth,
      userStore.user?.type,
      userStore.user?.organizationId,
      userStore.user?.apiToken,
    ] as const,
  ([authenticated, type]) => {
    if (authenticated && type === OrganizationTypeEnum.ORGANIZATION) {
      void loadOrganizationIdentity()
    } else {
      clearOrganizationIdentity()
    }
  },
  { immediate: true },
)
const showTicketTools = computed(() => {
  const path = route.path

  return (path.startsWith('/organization') || path.startsWith('/admin')) && !path.includes('ticket')
})

onMounted(() => {
  initThemeMode()
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
