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
  <div class="invalid-certificate">
    <div class="invalid">
      <NotValidIcon />
      <span class="invalid-title">invalid</span>
    </div>
    <CertificateImageDialog @update:data="updateData" :certificateId="certificateId"
      :organizationEmployeeId="organizationEmployeeId" />
  </div>
</template>
