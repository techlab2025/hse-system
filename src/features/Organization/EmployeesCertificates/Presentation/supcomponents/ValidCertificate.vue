<script lang="ts" setup>
import ValidIcon from '@/shared/icons/ValidIcon.vue'

const props = defineProps<{
  expiry_date: string
}>()
</script>
<template>
  <div class="valid-certificate">
    <div class="valid">
      <!-- <ValidIcon /> -->
      <span class="valid-title" >valid</span>
    </div>
    <p class="valid-date">Exp :{{ expiry_date }}</p>
  </div>
</template>
