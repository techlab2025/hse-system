<script setup lang="ts">
import CardEquipment from './CardEquipment.vue'
import HistoryLog from './HistoryLog.vue'
import QrCode from './QrCode.vue'
</script>

<template>
  <div class="show-equipment">
    <CardEquipment />
    <div class="history-qr">
      <HistoryLog />
      <QrCode />
    </div>
  </div>
</template>
