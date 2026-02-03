<script setup lang="ts">
import MultiImagesDialog from '@/shared/HelpersComponents/dialog/MultiImagesDialog.vue'
import type TicketDetailsModel from '../../../Data/models/TicketDetailsModel'

const { history } = defineProps<{
  history: TicketDetailsModel
}>()
</script>

<template>
  <div class="attach-wrapp">
    <div class="attachments-part">
      <!--
                  <div class="title">
                    {{ history.title }}
                  </div>
                -->

      <div class="description">
        <p>{{ history.description }}</p>
        <MultiImagesDialog :images="history?.media || []">
          <div class="imgs">
            <img
              v-for="(img, i) in history?.media?.slice(0, 4)"
              :key="i"
              :src="img.url"
              :class="'img-' + (i + 1)"
              alt="static"
            />
          </div>
        </MultiImagesDialog>
      </div>

      <div class="date">
        <span>{{ new Date(history.createdAt).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>
