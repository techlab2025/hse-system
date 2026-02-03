<script setup lang="ts">
import MultiImagesDialog from '@/shared/HelpersComponents/dialog/MultiImagesDialog.vue'
import type TicketHistoryModel from '../../../Data/models/TicketHistoryModel'

const { history } = defineProps<{
  history: TicketHistoryModel
}>()
</script>

<template>
  <div class="status-wrapper">
    <div class="status-part">
      <div class="data">
        <div class="title-desc">
          <!-- <h5>Addition of Staff Pantry in Park House English</h5> -->
          <p>
            {{ history.description }}
          </p>
        </div>

        <!--
                    <div class="status">
                      <span :class="getStatusLabel(history.status)">{{
                        getStatusLabel(history.status)
                      }}</span>
                    </div>
                  -->
      </div>

      <div class="date flex items-center justify-between">
        <span>{{ new Date(history.createdAt).toLocaleString() }}</span>
        <MultiImagesDialog :images="history?.attachments || []">
          <div class="imgs">
            <img
              v-for="(img, i) in history?.attachments?.slice(0, 4)"
              :key="i"
              :src="img?.file"
              :class="'img-' + (i + 1)"
              alt="static"
            />
          </div>
        </MultiImagesDialog>
      </div>
    </div>
  </div>
</template>
