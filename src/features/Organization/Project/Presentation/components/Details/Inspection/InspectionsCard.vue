<script setup lang="ts">
import PinIcons from '@/shared/icons/PinIcons.vue'
import InspectionDialog from './InspectionDialog.vue'

const { showHeader, showArrowLink, isAssign } = defineProps<{
  showHeader?: boolean
  showArrowLink?: boolean
  isAssign: boolean
}>()
</script>

<template>
  <div class="inspections-card">
    <div class="card-header" v-if="showHeader">
      <div class="card-header-title">
        <PinIcons />
        <p class="title">Obour City</p>
      </div>
      <div class="tasks-num">
        10
        <span>
          {{ $t('tasks') }}
        </span>
      </div>
    </div>
    <hr class="card-divider" v-if="showHeader" />
    <div class="card-body">
      <div class="content-container">
        <p class="status">non _ complete</p>
        <div class="card-body-content">
          <p class="content-title">device inspection</p>
          <span class="content-date"> 22 july / 10 : 30 AM </span>
        </div>
        <div class="assign-to" v-if="isAssign">
          <span> assigned to :</span>
          <p>Abdallah Mohamed</p>
        </div>
      </div>
      <InspectionDialog
        v-if="showArrowLink"
        :showArrowLink="false"
        :showHeader="false"
        :isAssign="true"
      />
    </div>
  </div>
</template>
