<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  title: string
  subTitle: string
  totalInsedant: number | string | null
  textClass: string
  link?: string
}>()

const displayValue = computed(() => {
  if (props.totalInsedant === null || props.totalInsedant === undefined) return '—'
  return Number(props.totalInsedant)
})
</script>

<template>
  <component :is="props.link ? 'router-link' : 'div'" :to="props.link">
    <div class="total-insedent-card">
      <div class="titlte">
        <p>{{ props.title }}</p>
      </div>
      <div class="data">
        <p :class="props.textClass">{{ displayValue }}</p>
        <h6>| {{ props.subTitle }}</h6>
      </div>
    </div>
  </component>
</template>
