<script lang="ts" setup>
import { CertificateStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/CertificateStatusEnum'
import CertificateImageDialog from './CertificateImageDialog.vue'
import ValidCertificate from './ValidCertificate.vue'
import ValidIcon from '@/shared/icons/ValidIcon.vue'

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
      <h1>
        {{
          employee?.employee_certificates?.find((el) => el.certificate_id == cert.id)?.expired_at
        }}
      </h1>
      <ValidCertificate
        :expiry_date="
         
        "
        :status="getCertificateStatus(employee, cert.id)"
      />
    </div>
  </div>
</template>
