<script setup lang="ts">
import '../../../styles/project.css'

import AddHerikaly from '@/features/Organization/Herikaly/Presentation/components/AddHerikaly.vue'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()
</script>

<template>
  <Dialog
    data-hse-project
    class="hse-project-root hse-project-overlay"
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    :visible="props.visible"
    modal
    :header="$t('Add Position')"
    dismissable-mask
    :style="{ width: '50rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <AddHerikaly @update:data="emit('update:visible', false)" />
  </Dialog>
</template>
