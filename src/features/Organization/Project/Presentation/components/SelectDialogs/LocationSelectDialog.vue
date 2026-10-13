<script setup lang="ts">
import '../../../styles/project.css'

import Dialog from 'primevue/dialog'
import AddLocationArea from '@/features/setting/Location/Presentation/components/Area/AddLocationArea.vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'location-added'): void
}>()

const handleLocationAdded = () => {
  emit('location-added')
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    data-hse-project
    class="hse-project-root hse-project-overlay"
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    :visible="props.visible"
    modal
    :header="$t('Add Contractor')"
    dismissable-mask
    :style="{ width: '50rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <AddLocationArea @update:data="handleLocationAdded" />
  </Dialog>
</template>
