<script setup lang="ts">
import ToolIcon from '@/shared/icons/ToolIcon.vue';

interface EquipmentTool {
  img: string,
  title: string,
  type: string,
  subtype: string,
  subtitle: string
  date: string,
  addedby: string,
  status: string
}
const props = defineProps<{
  tool: EquipmentTool
}>()
</script>

<template>
  <div class="tool-card">
    <div class="tool-card-header">
      <img :src="tool.img" alt="tool">
      <div class="tool-card-header-text">
        <p class="type"><span class="main-type">{{ tool.type }}</span> > <span class="subtype">{{ tool.subtype }}</span>
        </p>
        <p class="title">{{ tool.title }}</p>
        <p class="inspection">inspection date : <span class="date">{{ tool.date }}</span> <span class="per">( per week
            )</span></p>
      </div>
    </div>
    <hr class="tool-hr">
    <div class="tool-subtitle">
      <ToolIcon />
      <p class="subtitle">{{ tool.subtitle }}</p>
    </div>
    <div class="tool-card-footer">
      <p class="date">Date: <span>{{ tool.date }}</span></p>
      <p class="added-by">Added By: <span>{{ tool.addedby }}</span></p>
      <p class="status">Status: <span>{{ tool.status }}</span></p>
    </div>
  </div>
</template>
