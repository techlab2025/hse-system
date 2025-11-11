<script setup lang="ts">
import EditTollIcon from '@/shared/icons/EditTollIcon.vue';
import ToolCard from './ToolCard.vue';
import LocationPin from "@/assets/images/LocationPin.png"
import type ProjectLocationZoneModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationZoneModel';
import AddEquipmentDialog from '../../Dialogs/EquipmentDialog/AddEquipmentDialog.vue';

const props = defineProps<{
  zones: ProjectLocationZoneModel
}>()


</script>

<template>

  <div class="equipment-card">
    <div class="equipment-card-header-container">
      <div class="equipment-card-header">
        <img :src="LocationPin" alt="equipment logo">
        <div class="equipment-card-header-text">
          <p class="title">{{ zones?.title }}</p>
          <p class="subtitle"><span>{{ zones?.projectZoonEquipments?.length }} </span> Equipment & Devices</p>
        </div>


      </div>
      <div class="equipment-card-actions">
        <!-- <AddTollIcon /> -->
        <AddEquipmentDialog :zoonId="zones?.id" />
        <!-- <EditTollIcon /> -->
      </div>
    </div>
    <hr class="equipment-hr">

    <div class="tool-cards" v-if="zones?.projectZoonEquipments?.length > 0">
      <ToolCard v-for="(tool, index) in zones?.projectZoonEquipments" :key="index" :tool="tool" />
    </div>
    <div class="empty-tools" v-else>
      <h2>No Equipments</h2>
    </div>
  </div>
</template>
