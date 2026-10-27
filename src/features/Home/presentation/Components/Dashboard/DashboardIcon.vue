<script setup lang="ts">
withDefaults(defineProps<{ name: string }>(), { name: 'shield' })
const paths: Record<string, string> = {
  shield: 'M12 3 4 6v5c0 5 8 10 8 10s8-5 8-10V6l-8-3Zm-4 9 3 3 5-6',
  incident: 'm12 3 10 18H2L12 3Zm0 6v5m0 3h.01',
  risk: 'M12 3 3 7v6c0 4 9 8 9 8s9-4 9-8V7l-9-4Zm0 5v5m0 3h.01',
  inspection: 'M9 4H5v17h14V4h-4M9 2h6v5H9V2Zm-1 9 2 2 3-3m-5 7h8',
  corrective: 'M4 4h16v16H4V4Zm4 8 3 3 5-6',
  refresh: 'M20 7V3m0 4h-4M4 17v4m0-4h4M5 8a8 8 0 0 1 13-3l2 2M4 17l2 2a8 8 0 0 0 13-3',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  project: 'M3 6h7l2 3h9v11H3V6Zm0 3h9',
  people:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-4M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 0a4 4 0 0 1 0 8',
  equipment: 'M14 3a5 5 0 0 0-5 7L3 16a3 3 0 0 0 5 5l6-6a5 5 0 0 0 7-5l-4 3-4-4 3-4-2-2Z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2',
}
</script>
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name] || paths.shield" />
  </svg>
</template>
