<script setup lang="ts">
import DetailsHeader from './DetailsHeader.vue'

// import CloseTicketDialog from './Dialog/CloseTicketDialog.vue'
import { useRoute } from 'vue-router'
// import { UserTypeEnum } from '../../../Core/Enum/userTypeEnum'
import ClientReply from './ClientReply.vue'
import EmployeeReply from './EmployeeReply.vue'
import type TicketDetailsModel from '../../../Data/models/TicketDetailsModel'
import CloseTicketDialog from '../Dialog/CloseTicketDialog.vue'
import { StatusEnum } from '../../../Core/Enums/statusEnum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
const { user } = useUserStore()

const route = useRoute()
const props = defineProps<{ data: TicketDetailsModel }>()

// const getTicketDetails = () => {
//   const params = new ShowTicketParams({
//     id: +route?.params?.id,
//   })
//   showTicketController.getData(params)
// }

// onMounted(() => {
//   getTicketDetails()
// })

/* Breadcrumb */
// const links = [
//   {
//     link: '/tickets',
//     title: 'My Tickets',
//   },
//   {
//     link: '/tickets/add',
//     title: 'Add New Ticket',
//   },
// ]
</script>

<template>
  <!-- {{ data }} -->

  <div class="w-full">
    <!-- <Breadcrumb :links="links" /> -->
    <div class="details-page">
      <!-- Header -->
      <div class="header-details">
        <DetailsHeader :ticket="data" />
      </div>

      <!-- <div v-for="history in data" :key="history?.id"> -->
      <ClientReply :history="data" />
      <EmployeeReply :history="data" />

      <!-- v-if="data.status !== StatusEnum.SOLVED || data.status !== StatusEnum.RESOLVED" -->

      <CloseTicketDialog v-if="user?.type === OrganizationTypeEnum.ADMIN && data.status !== StatusEnum.CLOSED"
        @refresh="$emit('refresh')" :ticketId="data?.id" />

      <!-- </div> -->

      <!-- <CloseTicketDialog v-if="state.data?.status !== StatusEnum.CLOSED" :ticket="state.data" /> -->
    </div>
  </div>
</template>
