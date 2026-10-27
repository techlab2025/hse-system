<script lang="ts" setup>
const props = defineProps<{
  expiry_date: string
}>()
</script>
<template>
  <div class="valid-certificate">
    <div class="valid">
      <!-- <ValidIcon /> -->
      <span class="valid-title">{{ $t('valid') }}</span>
    </div>
    <p v-if="expiry_date" class="valid-date">{{ $t('Exp :') }}{{ expiry_date }}</p>
  </div>
</template>
