<script setup lang="ts">
import EquimentFolderEmpty from "@/assets/images/EquimentFolderEmpty.png"
import type SohwProjectZoonModel from "@/features/Organization/Project/Data/models/ShowProjectZone";
import EquipmentZoneDialog from "../../Dialogs/EquipmentZoneDialog/EquipmentZoneDialog.vue";

const props = defineProps<{
  zonesNumber: number
  zones: SohwProjectZoonModel[]
}>()
</script>
<template>
  <div class="empty-zones-equipment">
    <div class="empty-zones-equipment-container">
      <img :src="EquimentFolderEmpty" alt="empty-equipment">
      <div class="header">
        <h2 class="title">{{ $t('empty zones') }}</h2>
        <p class="description">{{ zonesNumber }} {{ $t('empty zone without an eauipment select one and add now') }}</p>
      </div>
    </div>
    <div class="content">
      <!-- <p v-for="(zone, index) in zones" :key="index">{{ zone.zoonTitle }}</p> -->
      <EquipmentZoneDialog v-for="(zone, index) in zones" :key="index" :btn_name="zone?.zoonTitle"
        :project_zone_id="zone?.projectZoonId" />
    </div>
  </div>
</template>
