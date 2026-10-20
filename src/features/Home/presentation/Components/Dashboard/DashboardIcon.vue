<script setup lang="ts">
export type DashboardIconName =
  | 'shield'
  | 'activity'
  | 'clipboard'
  | 'arrow'
  | 'folder'
  | 'equipment'
  | 'certificate'
  | 'target'
  | 'clock'
  | 'check'
  | 'users'
  | 'alert'
defineProps<{ name: DashboardIconName }>()
const paths: Record<DashboardIconName, string> = {
  shield: 'M12 3 4 6v6c0 4 4 7 8 9 4-2 8-5 8-9V6l-8-3Z M8 12l3 3 5-6',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  clipboard: 'M8 5H5v16h14V5h-3 M8 3h8v5H8z M8 12h8 M8 16h5',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  folder: 'M3 7h6l2 2h10v11H3V7Z M3 7V4h7l2 3',
  equipment: 'M4 6l8-3 8 3-8 3-8-3Z M4 6v12l8 3 8-3V6 M12 9v12',
  certificate: 'M6 3h12v12H6V3Z M9 7h6 M9 10h4 M8 15v7l4-3 4 3v-7',
  target: 'M12 3a9 9 0 1 0 9 9 M12 7a5 5 0 1 0 5 5 M12 12l8-8 M16 4h4v4',
  clock: 'M12 7v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  check: 'M5 12l4 4L19 6',
  users: 'M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M5 21v-3a7 7 0 0 1 14 0v3 M18 5a3 3 0 0 1 3 5',
  alert: 'm12 3 10 18H2L12 3Z M12 9v5 M12 17v.1',
}
</script>
<template>
  <svg
    class="dashboard-icon"
    :class="{ 'dashboard-icon--arrow': name === 'arrow' }"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name]" />
  </svg>
</template>
