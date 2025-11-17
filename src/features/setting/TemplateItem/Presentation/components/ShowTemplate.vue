<script setup lang="ts">
import EmployeeBg from '@/assets/images/EmployeeBg.png'
import Yellowback from '@/assets/images/Yellowback.png'
import ShowTemplateIcon from '@/shared/icons/ShowTemplateIcon.vue';
import TemplateDocument from "./TemplateDocument.vue";
</script>
<template>
  <div class="show-template-container">
    <div class="left-header-background">
      <img class="left-blue-background" :src="EmployeeBg" alt="bg">
      <img class="left-yellow-background" :src="Yellowback" alt="bg">
    </div>
    <div class="template-title">
      <h2 class="title">Templet show</h2>
      <ShowTemplateIcon />
    </div>
    <div class="template-document">
      <TemplateDocument />
    </div>

    <div class="right-header-background">
      <img class="right-yellow-background" :src="Yellowback" alt="bg">
      <img class="right-blue-background" :src="EmployeeBg" alt="bg">
    </div>
  </div>
</template>
