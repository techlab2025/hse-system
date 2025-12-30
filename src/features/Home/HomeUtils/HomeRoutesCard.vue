<script lang="ts" setup>
import wordSlice from '@/base/Presentation/utils/word_slice';


const props = defineProps<{
  imgSrc: string;
  title: string;
  description: string;
}>()
</script>
<template>
  <div class="home-routes-card">
    <div class="card-img">
      <img :src="props.imgSrc" alt="logo">
    </div>
    <div class="card-content">
      <h3 class="title">{{ props.title }}</h3>
      <p class="description">{{ wordSlice(props.description, 30) }}</p>
    </div>
  </div>
</template>
