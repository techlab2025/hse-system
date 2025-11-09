<script setup lang="ts">
import AddTollIcon from '@/shared/icons/AddTollIcon.vue';
import EditTollIcon from '@/shared/icons/EditTollIcon.vue';
import ToolCard from './ToolCard.vue';
import LocationPin from "@/assets/images/LocationPin.png"
import SohwProjectZoonModel from '../../../../Data/models/ShowProjectZone';

// interface EquipmentTool {
//   img: string,
//   title: string,
//   type: string,
//   subtype: string,
//   subtitle: string
//   date: string,
//   addedby: string,
//   status: string
// }
// interface EquipmentInterface {
//   title: string,
//   NumberOfEquipment: string,
//   img: string
//   tools: EquipmentTool[]
// }

const props = defineProps<{
  equipment: SohwProjectZoonModel
}>()
</script>

<template>
  <div class="equipment-card">
    <div class="equipment-card-header-container">
      <div class="equipment-card-header">
        <img :src="LocationPin" alt="equipment logo">
        <div class="equipment-card-header-text">
          <p class="title">{{ equipment.zoonTitle }}</p>
          <p class="subtitle"><span>{{ equipment.projectZoonEquipments.length }} </span> Equipment & Devices</p>
        </div>


      </div>

      <div class="equipment-card-actions">
        <AddTollIcon />
        <EditTollIcon />
      </div>
    </div>
    <hr class="equipment-hr">
    <div class="tool-cards" v-if="equipment.projectZoonEquipments?.length > 0">
      <ToolCard v-for="(tool, index) in equipment.projectZoonEquipments" :key="index" :tool="tool" />
    </div>
    <div class="empty-tools" v-else>
      <h2>No Equipments</h2>
    </div>
  </div>
</template>
