<script setup lang="ts">
import EmployeeBg from '@/assets/images/EmployeeBg.png'
import Yellowback from '@/assets/images/Yellowback.png'
const props = defineProps<{
  title: string,
  subtitle: string
}>()
</script>
<template>
  <div class="employee-header">
    <div class="left-header-background">
      <img class="left-blue-background" :src="EmployeeBg" alt="bg">
      <img class="left-yellow-background" :src="Yellowback" alt="bg">
    </div>
    <p class="title">{{ title }}</p>
    <p class="subtitle">{{ subtitle }}</p>
    <div class="right-header-background">
      <img class="right-yellow-background" :src="Yellowback" alt="bg">
      <img class="right-blue-background" :src="EmployeeBg" alt="bg">
    </div>
  </div>
</template>
