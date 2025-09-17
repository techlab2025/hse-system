<script setup lang="ts">


import { ref } from 'vue'

const title = ref('')
</script>

<template>
  <div class="input-wrapper">
    <label for="">Title</label>
    <input type="text" id="" v-model="title" placeholder="Enter Title" />
  </div>


<!--  <div class="flex text-red-400">-->
<!--    <div>asdfas</div>-->
<!--    <div>asdfas</div>-->
<!--  </div>-->
</template>

<style scoped></style>
