<script setup lang="ts">
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image';
import type ProjectLocationEquipmentModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEquipmentModel';
import ToolIcon from '@/shared/icons/ToolIcon.vue';


const props = defineProps<{
  tool: ProjectLocationEquipmentModel
}>()
</script>

<template>
  <div class="tool-card">
    <div class="tool-card-header">
      <img :src="tool?.img || '/src/assets/images/logo.svg'" alt="tool" @error="setDefaultImage">
      <div class="tool-card-header-text">
        <!--  > <span class="subtype">{{
          tool.subtype }}</span> -->
        <p class="type"><span class="main-type">{{ tool.equipmenType?.title }}</span>
        </p>
        <p class="title">{{ tool.title }}</p>
        <!-- <p class="inspection">inspection date : <span class="date">{{ tool.date }}</span> <span class="per">( per week
            )</span></p> -->
      </div>
    </div>
    <hr class="tool-hr">
    <div class="tool-subtitle">
      <ToolIcon />
      <!-- <p class="subtitle">{{ tool.subtitle }}</p> -->
    </div>
    <div class="tool-card-footer">
      <!-- <p class="date">Date: <span>{{ tool.date }}</span></p>
      <p class="added-by">Added By: <span>{{ tool.addedby }}</span></p>
      <p class="status">Status: <span>{{ tool.status }}</span></p> -->
    </div>
  </div>
</template>
