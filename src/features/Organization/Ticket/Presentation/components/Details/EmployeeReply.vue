<script setup lang="ts">
import MultiImagesDialog from '@/shared/HelpersComponents/dialog/MultiImagesDialog.vue'
import type TicketDetailsModel from '../../../Data/models/TicketDetailsModel'
import { StatusEnum } from '../../../Core/Enums/statusEnum'

const { history } = defineProps<{
  history: TicketDetailsModel
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
      return 'unknown-status'
  }
}
</script>

<template>
  <div class="status-wrapper">
    <div class="status-part" v-for="reply in history.replies" :key="reply?.id">
      <div class="status" :data-status="getStatusLabel(reply?.status)">
        <h6 :class="getStatusLabel(reply?.status)">{{ getStatusLabel(reply?.status) }}</h6>
      </div>
      <div class="data">
        <div class="title-desc">
          <h4>{{ reply.reply }}</h4>
          <!-- <p>
            {{ reply.description || 'No description' }}
          </p> -->
        </div>
      </div>

      <div class="date flex items-center justify-between">
        <span>{{ reply.createdAt }}</span>
      </div>
    </div>
  </div>
</template>
