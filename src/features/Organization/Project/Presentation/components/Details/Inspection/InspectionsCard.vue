<script setup lang="ts">
import PinIcons from '@/shared/icons/PinIcons.vue'
</script>

<template>
  <div class="inspections-card">
    <div class="card-header">
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
    <hr class="divider" />
  </div>
</template>
