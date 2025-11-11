<script lang="ts" setup>
import HeaderSection from "../DetailsHeader/HeaderSection.vue";
import Equipment from "@/assets/images/Equipment.png"
import EmptyData from "../LocationsTeams/EmptyData.vue";
import EquimentFolderEmpty from "@/assets/images/EquimentFolderEmpty.png"
import EquipmentCard from "./EquipmentCard.vue";
import type SohwProjectZoonModel from "@/features/Organization/Project/Data/models/ShowProjectZone";
import { useRoute } from "vue-router";

const route = useRoute()
const id = route.params.id
const props = defineProps<{
  project_zoons: SohwProjectZoonModel[]
}>()

</script>


<template>

  <div class="equipment-section">
    <div class="equipment-section-header">
      <HeaderSection :img="Equipment" title="Equipment , tools & Devices by Zone"
        subtitle="View and manage all equipment assigned to each operational zone" />
      <router-link :to="`/organization/project-equipment/project/${id}`" class="show-all">Show all</router-link>
    </div>
    <div class="equipments-sections" v-if="project_zoons?.length > 0">
      <EquipmentCard v-for="(Equipment, index) in project_zoons" :key="index" :zones="Equipment" />
    </div>
    <EmptyData :img="EquimentFolderEmpty" title="No Equipment Added Yet"
      subtitle="Start adding your site equipment to manage inspections, maintenance, and safety logs in one place"
      v-else />
  </div>
</template>
