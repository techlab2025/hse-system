<script setup lang="ts">
import QrIcons from '@/shared/icons/QrIcons.vue'
</script>

<template>
  <div class="qr-code-card">
    <div class="head">
      <div class="title">
        <QrIcons />
        <span>{{ $t('QR code') }}</span>
      </div>
      <span class="print">
        {{ $t('print') }}
      </span>
    </div>
    <div class="qr-code">
      <img src="@/assets/images/qr-code (3).png" :alt="$t('QR code')" />
    </div>
  </div>
</template>
