<script setup lang="ts">
withDefaults(
  defineProps<{
    name: 'mail' | 'server' | 'sender' | 'folder' | 'shield' | 'arrow' | 'save' | 'refresh'
    size?: number
  }>(),
  { size: 22 },
)
const paths = {
  mail: ['M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z', 'm3 7 9 6 9-6'],
  server: ['M4 3h16v7H4z', 'M4 14h16v7H4z', 'M8 6.5h.01M8 17.5h.01M12 6.5h5M12 17.5h5'],
  sender: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    'm17 9 2 2 4-4',
  ],
  folder: [
    'M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z',
    'm8 13 3 3 5-5',
  ],
  shield: ['M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7l-9-4Z', 'm8 12 3 3 5-5'],
  arrow: ['M19 12H5m6-6-6 6 6 6'],
  save: [
    'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z',
    'M7 3v6h9V3M7 21v-8h10v8',
  ],
  refresh: ['M20 11a8 8 0 1 0-2.5 7', 'M20 4v7h-7'],
}
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="email-icon"
  >
    <path v-for="(path, index) in paths[name]" :key="index" :d="path" />
  </svg>
</template>
