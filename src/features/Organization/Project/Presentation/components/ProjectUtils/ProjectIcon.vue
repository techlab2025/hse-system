<script setup lang="ts">
type IconName =
  | 'pulse'
  | 'folder'
  | 'gauge'
  | 'clock'
  | 'grid'
  | 'users'
  | 'equipment'
  | 'arrow-right'
  | 'plus'
defineProps<{ name: IconName }>()
const paths: Record<IconName, string> = {
  pulse: 'M12 3l1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8L12 3z',
  folder: 'M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z',
  gauge: 'M4 16a8 8 0 1 1 16 0M12 12l4-4M6 16h12',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  users: 'M12 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M3 21v-2a6 6 0 0 1 12 0v2M17 11h4M19 9v4',
  equipment: 'M4 6l8-3 8 3-8 3-8-3zM4 6v12l8 3 8-3V6M12 9v12',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
}
</script>
<template>
  <svg
    class="hse-project-icon"
    :class="`hse-project-icon--${name}`"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name]" />
  </svg>
</template>
<style scoped>
.hse-project-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.hse-project-icon--arrow-right:dir(rtl) {
  transform: scaleX(-1);
}
</style>
