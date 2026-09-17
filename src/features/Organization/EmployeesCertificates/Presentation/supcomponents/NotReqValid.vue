<script lang="ts" setup>
import { CertificateStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/CertificateStatusEnum'
import ValidIcon from '@/shared/icons/ValidIcon.vue'

defineProps<{
  certificateId: number
  organizationEmployeeId: number
  is_expire_date: boolean
  status: CertificateStatusEnum
}>()
</script>

<template>
  <div class="valid-not-required-renew">
    <div class="valid-certificate">
      <div class="valid">
        <span class="not-required-date">
          <span>Not Required</span>
        </span>
        <span class="not-required">
          <ValidIcon />
        </span>
      </div>
    </div>
  </div>
</template>
