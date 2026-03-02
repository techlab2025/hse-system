<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  title: string
  subTitle: string
  totalInsedant: number | string | null  // ✅ أكثر مرونة
  textClass: string
  link?: string  // ✅ optional عشان الكارد الأول مش بيمرر link
}>()

// computed للتأكد من النوع
const displayValue = computed(() => {
  if (props.totalInsedant === null || props.totalInsedant === undefined) return '—'
  return Number(props.totalInsedant)
})
</script>

<template>
  <!-- ✅ لو link اختياري -->
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
