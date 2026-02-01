<script setup lang="ts">
import AddOrganizatoinEmployee from '@/features/Organization/OrganizationEmployee/Presentation/components/AddOrganizatoinEmployee.vue';
import Dialog from 'primevue/dialog'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()
</script>

<template>
  <Dialog :visible="props.visible" modal :header="$t('Add Contractor')" dismissable-mask :style="{ width: '50rem' }"
    @update:visible="emit('update:visible', $event)">
    <AddOrganizatoinEmployee @update:data="emit('update:visible', false)" />
  </Dialog>
</template>
