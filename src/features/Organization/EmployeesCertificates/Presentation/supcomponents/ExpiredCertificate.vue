<script lang="ts" setup>
import CertificateImageDialog from "./CertificateImageDialog.vue"
import ExpiredIcon from '@/shared/icons/ExpiredIcon.vue';

const props = defineProps<{
  certificateId: number,
  organizationEmployeeId: number,
  is_expire_date: boolean,
}>()

const emit = defineEmits(['update:data'])
const updateData = () => {
  emit('update:data')
}

</script>
<template>
  <div class="expired-certificate">
    <div class="expired">
      <ExpiredIcon />
      <span class="expired-title">Expired</span>
    </div>
    <!-- <p class="expired-date">Renew</p> -->
    <CertificateImageDialog :title="`Renew`" @update:data="updateData" :certificateId="certificateId"
      :organizationEmployeeId="organizationEmployeeId" :is_expire_date="is_expire_date" />
  </div>
</template>
