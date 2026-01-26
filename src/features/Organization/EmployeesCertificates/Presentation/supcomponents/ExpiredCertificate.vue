<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import CertificateImageDialog from './CertificateImageDialog.vue'
import ExpiredIcon from '@/shared/icons/ExpiredIcon.vue'

const props = defineProps<{
  certificateId: number
  organizationEmployeeId: number
}>()

const emit = defineEmits(['update:data'])
const updateData = () => {
  emit('update:data')
}

const { t } = useI18n()
</script>
<template>
  <div class="expired-certificate">
    <div class="expired">
      <ExpiredIcon />
      <span class="expired-title">{{ t('expired') }}</span>
    </div>
    <!-- <p class="expired-date">Renew</p> -->
    <CertificateImageDialog
      :title="`Renew`"
      @update:data="updateData"
      :certificateId="certificateId"
      :organizationEmployeeId="organizationEmployeeId"
    />
  </div>
</template>
