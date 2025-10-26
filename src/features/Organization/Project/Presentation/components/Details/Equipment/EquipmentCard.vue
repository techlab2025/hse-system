<script setup lang="ts">
import AddTollIcon from '@/shared/icons/AddTollIcon.vue';
import EditTollIcon from '@/shared/icons/EditTollIcon.vue';
import ToolCard from './ToolCard.vue';

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
interface EquipmentInterface {
  title: string,
  NumberOfEquipment: string,
  img: string
  tools: EquipmentTool[]
}

const props = defineProps<{
  equipment: EquipmentInterface
}>()
</script>

<template>
  <div class="equipment-card">
    <div class="equipment-card-header-container">
      <div class="equipment-card-header">
        <img :src="equipment?.img" alt="equipment logo">
        <div class="equipment-card-header-text">
          <p class="title">{{ equipment.title }}</p>
          <p class="subtitle"><span>{{ equipment.NumberOfEquipment }} </span> Equipment & Devices</p>
        </div>


      </div>

      <div class="equipment-card-actions">
        <AddTollIcon />
        <EditTollIcon />
      </div>
    </div>
    <hr class="equipment-hr">
    <div class="tool-cards">
      <ToolCard v-for="(tool, index) in equipment.tools" :key="index" :tool="tool" />
    </div>
  </div>
</template>
