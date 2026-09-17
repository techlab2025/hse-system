<script setup lang="ts">
const props = defineProps<{
  action: any
  isCorrect: number
}>()
</script>
<template>
  <div class="investegaion-take-action-card" :class="isCorrect == 1 ? '' : 'wrong-action'">
    <p class="corrective-action" :class="isCorrect == 1 ? '' : 'wrong-action'">
      {{ isCorrect == 1 ? $t('effective_action') : $t('ineffective_action') }}
    </p>
    <p class="description">{{ action }}</p>
  </div>
</template>
<style scoped lang="scss">
.wrong-action {
  color: var(--status-danger) !important;
}
.wrong-action::before {
  background-color: var(--status-danger) !important;
}
.investegaion-take-action-card.wrong-action {
  background: linear-gradient(180deg, var(--status-danger-soft), var(--surface-1));
  border: none !important;
}
</style>
