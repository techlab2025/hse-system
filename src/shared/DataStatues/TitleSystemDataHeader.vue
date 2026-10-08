<script setup lang="ts">
import AddSystemHeaderData from '@/shared/icons/AddSystemHeaderData.vue'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <button class="system-data-add col-span-3" type="button">
    <AddSystemHeaderData class="icon" />
    <div class="system-data-content">
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </div>
  </button>
</template>

<style scoped>
.system-data-add {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  background-color: var(--surface-1);
  padding: 10px;
  margin-top: 12px;
  border-radius: 12px;
  text-align: start;
}

.icon {
  width: 24px;
  height: 24px;
}

.system-data-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h2 {
  width: 100%;
  color: var(--text-strong);
  font-weight: 700;
  font-size: 14px;
  font-family: 'Regular';
}

p {
  width: 100%;
  color: var(--brand-primary-700);
  font-size: 12px;
}
</style>
