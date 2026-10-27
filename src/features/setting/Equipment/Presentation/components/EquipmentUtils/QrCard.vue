<template>
  <div class="qr-code">
    <div class="texts">
      <h5 class="title">{{ $t('QR Code') }}</h5>
      <span class="subtitle">{{
        $t('This code will be automatically generated for tracking and labeling purposes')
      }}</span>
    </div>
    <img src="@/assets/images/qr.png" :alt="$t('QR code')" class="qr-scan" />
  </div>
</template>
