<script lang="ts" setup>
import NotValidIcon from '@/shared/icons/NotValidIcon.vue';
import CertificateImageDialog from "./CertificateImageDialog.vue"

const props = defineProps<{
  certificateId: number,
  organizationEmployeeId: number,
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
      <span class="not-required-left"></span>
      <span>NotRequired</span>
      <span class="not-required-right"></span>
    </div>
    <CertificateImageDialog @update:data="updateData" :certificateId="certificateId"
      :organizationEmployeeId="organizationEmployeeId" />
  </div>
</template>
