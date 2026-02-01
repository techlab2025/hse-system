<script lang="ts" setup>
import { CertificateStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/CertificateStatusEnum'
import CertificateImageDialog from './CertificateImageDialog.vue'

const props = defineProps<{
  certificateId: number
  organizationEmployeeId: number
  is_expire_date: boolean
  status: CertificateStatusEnum
}>()

const emit = defineEmits(['update:data'])
const updateData = () => {
  emit('update:data')
}
</script>
<template>
  <div class="invalid-certificate invalid-certificate-container">
    <div class="invalid">
      <span class="invalid-title">invalid</span>
    </div>
    <CertificateImageDialog
      @update:data="updateData"
      :certificateId="certificateId"
      :organizationEmployeeId="organizationEmployeeId"
      :is_expire_date="is_expire_date"
      :status="status"
    />
  </div>
</template>
