<script setup lang="ts">
import '../../../styles/project.css'

import AddOrganizatoinEmployee from '@/features/Organization/OrganizationEmployee/Presentation/components/AddOrganizatoinEmployee.vue'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  visible: boolean
  heirarchyId?: number
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
    :header="$t('Add Employee')"
    dismissable-mask
    :style="{ width: '50rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <AddOrganizatoinEmployee
      :heirarchy-id="props.heirarchyId"
      @update:data="emit('update:visible', false)"
    />
  </Dialog>
</template>
