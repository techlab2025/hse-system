<script lang="ts" setup>
const props = defineProps<{
  title: string
  subTitle: string
  totalInsedant: string
  textClass: string
}>()
</script>
<template>
  <div class="total-insedent-card">
    <div class="titlte">
      <p>{{ props.title }}</p>
    </div>
    <div class="data">
      <p :class="props.textClass">0</p>
      <h6>| {{ props.subTitle }}</h6>
    </div>
  </div>
</template>
