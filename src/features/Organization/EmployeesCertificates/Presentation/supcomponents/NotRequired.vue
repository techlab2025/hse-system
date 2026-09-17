<script lang="ts" setup>
import CertificateImageDialog from './CertificateImageDialog.vue'

defineProps<{
  certificateId: number
  organizationEmployeeId: number
  is_expire_date: boolean
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
      :is_expire_date="is_expire_date"
    />
  </div>
</template>
