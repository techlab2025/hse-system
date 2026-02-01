<script lang="ts" setup>
import { CertificateStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/CertificateStatusEnum'
import CertificateImageDialog from './CertificateImageDialog.vue'
import ExpiredIcon from '@/shared/icons/ExpiredIcon.vue'

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
  <div class="expired-certificate">
    <div class="expired">
      <!-- <ExpiredIcon /> -->
      <span class="expired-title">Expired </span>
    </div>
    <!-- <p class="expired-date">Renew</p> -->
    <CertificateImageDialog
      :title="`Renew`"
      @update:data="updateData"
      :certificateId="certificateId"
      :organizationEmployeeId="organizationEmployeeId"
      :is_expire_date="is_expire_date"
      :status="status"
    />
  </div>
</template>
