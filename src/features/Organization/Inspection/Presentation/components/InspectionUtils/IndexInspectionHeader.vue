<script setup lang="ts">
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel';
import { ref } from 'vue'

const props = defineProps<{
  title: string
  length: number
  projects: ProjectModel[]
}>()
const ActiveTap = ref(0)

</script>
<template>
  <div class="idnex-header" v-if="projects && projects.length > 0">
    <p class="title">{{ title }}</p>
    <p class="index-length">
      Total: <span>{{ length }}</span>
    </p>
    <div class="categories-container">
      <p class="category" :class="ActiveTap === item.id ? 'active' : ''" v-for="(item, index) in projects" :key="index"
        @click="ActiveTap = item.id">
        {{ item.title }}
      </p>
    </div>
  </div>
</template>
