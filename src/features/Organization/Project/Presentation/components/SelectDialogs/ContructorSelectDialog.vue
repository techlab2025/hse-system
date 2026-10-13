<script setup lang="ts">
import '../../../styles/project.css'

import Dialog from 'primevue/dialog'
import AddContractor from '@/features/setting/contractor/Presentation/components/AddContractor.vue'

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
    :header="$t('Add Contractor')"
    dismissable-mask
    :style="{ width: '50rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <AddContractor @update:data="emit('update:visible', false)" />
  </Dialog>
</template>
