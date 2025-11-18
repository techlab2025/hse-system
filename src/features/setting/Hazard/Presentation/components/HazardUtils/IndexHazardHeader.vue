<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title: string
  length: number
  categories: string[]
}>();
const ActiveTap = ref(0)

</script>
<template>
  <div class="idnex-header">
    <p class="title">{{ title }}</p>
    <p class="index-length">Total: <span>{{ length }}</span></p>
    <div class="categories-container">
      <p class="category" :class="ActiveTap === index ? 'active' : ''" v-for="(item, index) in categories" :key="index" @click="ActiveTap = index">{{ item }}</p>
    </div>
  </div>
</template>
