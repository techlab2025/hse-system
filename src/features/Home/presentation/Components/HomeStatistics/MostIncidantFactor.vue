<script lang="ts" setup>
//example
interface Data {
  value: number;
  label: string;
  spanClass?: string;
  divClass?: string;
}

const props = defineProps<{
  title: string
  data: Data[]
}>()


</script>
<template>
  <div class="incidant-factor-container">
    <div class="incidant-factor-header-container">
      <div class="incidant-factor-header">
        <span class="static">{{ $t('static') }}</span>
        <p class="static-title">{{ title }} </p>
      </div>
    </div>
    <div class="static-data" v-for="item in data" :key="item.label">
      <p :class="item.divClass">
        <span :class="item.spanClass">{{ item.value }}</span>
        {{ item.label }}
      </p>
    </div>
  </div>
</template>
