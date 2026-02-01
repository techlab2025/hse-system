<script lang="ts" setup>
import NotValidIcon from '@/shared/icons/NotValidIcon.vue'
import CertificateImageDialog from './CertificateImageDialog.vue'

const props = defineProps<{
  certificateId: number
  organizationEmployeeId: number
  notRequired: boolean
}>()

const emit = defineEmits(['update:data'])
const updateData = () => {
  emit('update:data')
}
</script>
<template>
  <div class="invalid-certificate not-required-container">
    <div class="invalid">
      <!-- <NotValidIcon /> -->
      <span class="not-req-span">Not Required</span>
    </div>
    <CertificateImageDialog
      @update:data="updateData"
      :certificateId="certificateId"
      :organizationEmployeeId="organizationEmployeeId"
      :notRequired="true"
    />
  </div>
</template>
