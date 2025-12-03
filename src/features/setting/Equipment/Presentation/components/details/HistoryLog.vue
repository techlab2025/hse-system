<script setup lang="ts">
import HistoryLog from '@/shared/icons/HistoryLog.vue'
import Filter from './filter.vue'
import PendingHistoryCard from './PendingHistoryCard.vue'
</script>

<template>
  <div class="history-log">
    <div class="title">
      <HistoryLog />
      <h4>{{ $t('History Log') }}</h4>
    </div>

    <Filter />

    <PendingHistoryCard />
  </div>
</template>
