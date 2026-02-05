<script setup>
import RenewArrow from '@/shared/icons/RenewArrow.vue'
import WarningCad from '@/shared/icons/WarningCad.vue'
</script>
<template>
  <div class="Subscription_card">
    <div class="describe">
      <h6>Your Subscription Is About to Expire</h6>
      <p>Renew your subscription within 20_5_2026 to avoid service interruption</p>
    </div>
    <div class="renew_icon">
      <div class="title">
        <p>Renew</p>
        <p>Now</p>
      </div>
      <div class="icon">
        <RenewArrow />
      </div>
    </div>
    <div class="warning">
      <WarningCad class="warning_icon"/>
    </div>
  </div>
</template>
