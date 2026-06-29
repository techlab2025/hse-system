<script setup lang="ts">
const props = defineProps<{
  action: any
  isCorrect: number
}>()
</script>
<template>
  <div class="investegaion-take-action-card" :class="isCorrect == 1 ? '' : 'wrong-action'">
    <p class="corrective-action" :class="isCorrect == 1 ? '' : 'wrong-action'">
      {{ isCorrect == 1 ? $t('correct_action') : $t('wrong_action') }}
    </p>
    <p class="description">{{ action }}</p>
  </div>
</template>
<style scoped lang="scss">
.wrong-action {
  color: red !important;
}
.wrong-action::before {
  background-color: red !important;
}
.investegaion-take-action-card.wrong-action {
  background: linear-gradient(180deg, #f4dddd, #ffffff);
  border: none !important;
}
</style>
