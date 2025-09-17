<script setup lang="ts">


import { ref } from 'vue'

const title = ref('')
</script>

<template>
  <div class="input-wrapper">
    <label for="">Title</label>
    <input type="text" id="" v-model="title" placeholder="Enter Title" />
  </div>
</template>

<style scoped></style>
