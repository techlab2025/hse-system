<script setup lang="ts">
const { title, description, link, addText } = defineProps<{
  title: string;
  description: string;
  link: string;
  addText: string;
}>();
</script>

<template>
  <div class="data-empty">
    <img src="@/assets/images/Cloud_storage_1_.png" alt="data empty" />
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <router-link :to="link" class="btn btn-primary">
      {{ addText }}
    </router-link>
  </div>
</template>

<style scoped></style>
