<script lang="ts" setup>
import wordSlice from '@/base/Presentation/utils/word_slice';
import type { Component } from 'vue';


const props = defineProps<{
  imgSrc: string;
  title: string;
  description: string;
  icon?: Component;
}>()
</script>
<template>
  <div class="home-routes-card">
    <div class="card-img">
      <img v-if="!props.icon" :src="props.imgSrc" alt="logo">
      <component class="icon" v-if="props.icon" :is="props.icon"></component>
    </div>
    <div class="card-content">
      <h3 class="title">{{ props.title }}</h3>
      <p class="description">{{ wordSlice(props.description, 30) }}</p>
    </div>
  </div>
</template>
