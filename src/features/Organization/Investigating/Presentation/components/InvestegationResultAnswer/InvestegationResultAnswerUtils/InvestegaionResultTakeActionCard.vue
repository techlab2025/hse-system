<script setup lang="ts">
const props = defineProps<{
  action: any
}>()

</script>
<template>
  <div class="investegaion-take-action-card">
    <p class="corrective-action">{{ $t('correct_action') }}</p>
    <p class="description">{{ action }}</p>
  </div>
</template>
