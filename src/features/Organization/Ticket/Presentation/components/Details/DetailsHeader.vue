<script setup lang="ts">
import { StatusEnum } from '../../../Core/Enums/statusEnum'
import type TicketDetailsModel from '../../../Data/models/TicketDetailsModel'

const { ticket } = defineProps<{
  ticket: TicketDetailsModel
}>()

const getStatusLabel = (status: StatusEnum | undefined) => {
  switch (status) {
    case StatusEnum.PENDING:
      return 'pending'
    case StatusEnum.OPEN:
      return 'open'
    case StatusEnum.SOLVED:
      return 'solved'
    case StatusEnum.RESOLVED:
      return 'solved'
    case StatusEnum.CLOSED:
      return 'solved'
    default:
      return 'unknown'
  }
}
</script>

<template>
  <div class="ticket-header">
    <div class="status" :data-status="getStatusLabel(ticket?.status)">
      <h6 :class="getStatusLabel(ticket?.status)">{{ getStatusLabel(ticket?.status) }}</h6>
    </div>
    <div class="content">
      <p>
        {{ ticket.type || 'Technical' }}
        <span>{{ ticket?.category?.name || 'FGt-9' }}</span>
      </p>
      <h4>{{ ticket?.description }}</h4>
    </div>
  </div>
</template>
