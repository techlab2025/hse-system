<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

import PinIcons from '@/shared/icons/PinIcons.vue'
import InspectionDialog from './InspectionDialog.vue'

const { showHeader, showArrowLink, isAssign } = defineProps<{
  showHeader?: boolean
  showArrowLink?: boolean
  isAssign: boolean
}>()
</script>

<template>
  <div
    data-hse-project
    v-project-panels
    class="hse-project-panel hse-project-root inspections-card"
  >
    <div class="card-header" v-if="showHeader">
      <div class="card-header-title">
        <PinIcons />
        <p class="title">{{ $t('Obour City') }}</p>
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
        <p class="status">{{ $t('non _ complete') }}</p>
        <div class="card-body-content">
          <p class="content-title">{{ $t('device inspection') }}</p>
          <span class="content-date"> {{ $t('22 july / 10 : 30 AM') }} </span>
        </div>
        <div class="assign-to" v-if="isAssign">
          <span> {{ $t('assigned to') }} :</span>
          <p>{{ $t('Abdallah Mohamed') }}</p>
        </div>
      </div>

      <InspectionDialog
        v-if="showArrowLink"
        :showArrowLink="showArrowLink"
        :showHeader="showHeader"
        :isAssign="isAssign"
      />
    </div>
  </div>
</template>
