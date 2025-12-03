<script lang="ts" setup>
import HeaderSection from "../DetailsHeader/HeaderSection.vue";
import Equipment from "@/assets/images/Equipment.png"
import EmptyData from "../LocationsTeams/EmptyData.vue";
import EquimentFolderEmpty from "@/assets/images/EquimentFolderEmpty.png"
import EquipmentCard from "./EquipmentCard.vue";
import type SohwProjectZoonModel from "@/features/Organization/Project/Data/models/ShowProjectZone";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute()
const id = route.params.id
const props = defineProps<{
  project_zoons: SohwProjectZoonModel[]
}>()

const ProjectZones = ref(props.project_zoons)
watch(()=>props.project_zoons,(newValue)=>{
  ProjectZones.value = newValue
})

</script>


<template>

  <div class="equipment-section">
    <div class="equipment-section-header">
      <HeaderSection :img="Equipment" title="Equipment , tools & Devices by Zone"
        subtitle="View and manage all equipment assigned to each operational zone" />
      <router-link :to="`/organization/project-equipment/project/${id}`" class="show-all">Show all</router-link>
    </div>
    <div class="equipments-sections" v-if="ProjectZones?.length > 0">
      <EquipmentCard v-for="(Equipment, index) in ProjectZones" :key="index" :zones="Equipment" />
    </div>

  </div>
</template>
