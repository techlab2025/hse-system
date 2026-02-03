<script setup lang="ts">
import Breadcrumb from '@/shared/LayoutComponents/BreadCrumb.vue'
import DetailsHeader from './DetailsHeader.vue'

// import CloseTicketDialog from './Dialog/CloseTicketDialog.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import MultiImagesDialog from '@/shared/HelpersComponents/dialog/MultiImagesDialog.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
// import { UserTypeEnum } from '../../../Core/Enum/userTypeEnum'
import ClientReply from './ClientReply.vue'
import EmployeeReply from './EmployeeReply.vue'
import ShowTicketController from '@/features/Organization/Ticket/Presentation/controllers/showTicketController'
import ShowTicketParams from '../../../Core/params/showTicketParams'
import type TicketDetailsModel from '../../../Data/models/TicketDetailsModel'

const route = useRoute()
const props = defineProps<{ data: TicketDetailsModel[] }>()

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
      <!-- <ClientReply v-if="history.userType == UserTypeEnum.CLIENT" :history="history" /> -->
      <ClientReply :history="data" />

      <!-- <EmployeeReply :history="history" /> -->
      <!-- </div> -->

      <!-- <CloseTicketDialog v-if="state.data?.status !== StatusEnum.CLOSED" :ticket="state.data" /> -->
    </div>
  </div>
</template>
