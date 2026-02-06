<script setup lang="ts">
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image';
import type CertificateModel from '../../Data/models/CertificateModel';

const props = defineProps<{
  cerificate: CertificateModel
}>()
</script>
<template>
  <div class="certificate-card">
    <div class="certificate-info">
      <div class="certificate-header">
        <div class="certificate-title">
          <p class="title">{{ cerificate.title }}</p>
          <span class="status">status</span>
        </div>
        <!-- v-if="cerificate.createdAt" -->
        <p class="created-at">{{ $t('created_at') }} <span>as{{ cerificate?.createdAt }}</span></p>
      </div>
      <div class="certificate-data">
        <div class="issue-date">
          <span>{{ $t('issue_date') }}</span>
          <span>{{ $t('10-2-2001') }}</span>
        </div>
        <div class="issue-date">
          <span>{{ $t('expire_date') }}</span>
          <span>{{ $t('10-2-2001') }}</span>
        </div>
      </div>

    </div>
    <div class="certificate-image">
      <img :src="cerificate.image || `/assets/images/logo.svg`" alt="certificate-image" @error="setDefaultImage">
    </div>
  </div>
</template>
