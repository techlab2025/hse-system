<script lang="ts" setup>
import HeaderSection from "../DetailsHeader/HeaderSection.vue";
import { ref } from "vue";
import Equipment from "@/assets/images/Equipment.png"
import EmptyData from "../LocationsTeams/EmptyData.vue";
import EquimentFolderEmpty from "@/assets/images/EquimentFolderEmpty.png"
import EquipmentCard from "./EquipmentCard.vue";
import Tool from "@/assets/images/Tool.png"
import type SohwProjectZoonModel from "@/features/Organization/Project/Data/models/ShowProjectZone";
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
// const Equipments = ref<EquipmentInterface[]>([
//   {
//     title: "Zone 1",
//     NumberOfEquipment: "20",
//     img: LocationPin,
//     tools: [
//       {
//         img: Tool,
//         title: "Drilling Rig",
//         type: "tools",
//         subtype: "hand tool",
//         subtitle: "last inspection",
//         date: " 22 june",
//         addedby: "by : Ahmed hawam",
//         status: "done"
//       },
//       {
//         img: Tool,
//         title: "Drilling Rig",
//         type: "tools",
//         subtype: "hand tool",
//         subtitle: "last inspection",
//         date: " 22 june",
//         addedby: "by : Ahmed hawam",
//         status: "done"
//       },
//       {
//         img: Tool,
//         title: "Drilling Rig",
//         type: "tools",
//         subtype: "hand tool",
//         subtitle: "last inspection",
//         date: " 22 june",
//         addedby: "by : Ahmed hawam",
//         status: "done"
//       },
//       {
//         img: Tool,
//         title: "Drilling Rig",
//         type: "tools",
//         subtype: "hand tool",
//         subtitle: "last inspection",
//         date: " 22 june",
//         addedby: "by : Ahmed hawam",
//         status: "done"
//       },

//     ]
//   },
//   {
//     title: "Zone 1",
//     NumberOfEquipment: "20",
//     img: LocationPin,
//     tools: [
//       {
//         img: Tool,
//         title: "Drilling Rig",
//         type: "tools",
//         subtype: "hand tool",
//         subtitle: "last inspection",
//         date: " 22 june",
//         addedby: "by : Ahmed hawam",
//         status: "done"
//       },
//       {
//         img: Tool,
//         title: "Drilling Rig",
//         type: "tools",
//         subtype: "hand tool",
//         subtitle: "last inspection",
//         date: " 22 june",
//         addedby: "by : Ahmed hawam",
//         status: "done"
//       },
//       {
//         img: Tool,
//         title: "Drilling Rig",
//         type: "tools",
//         subtype: "hand tool",
//         subtitle: "last inspection",
//         date: " 22 june",
//         addedby: "by : Ahmed hawam",
//         status: "done"
//       },
//       {
//         img: Tool,
//         title: "Drilling Rig",
//         type: "tools",
//         subtype: "hand tool",
//         subtitle: "last inspection",
//         date: " 22 june",
//         addedby: "by : Ahmed hawam",
//         status: "done"
//       },

//     ]
//   },
// ])

const props = defineProps<{
  project_zoons: SohwProjectZoonModel[]
}>()
</script>


<template>
  <div class="equipment-section">
    <div class="equipment-section-header">
      <HeaderSection :img="Equipment" title="Equipment , tools & Devices by Zone"
        subtitle="View and manage all equipment assigned to each operational zone" />
      <p class="show-all">Show all</p>
    </div>
    <div class="equipments-sections" v-if="project_zoons?.length > 0">
      <EquipmentCard v-for="(Equipment, index) in project_zoons" :key="index" :equipment="Equipment" />
    </div>
    <EmptyData :img="EquimentFolderEmpty" title="No Equipment Added Yet"
      subtitle="Start adding your site equipment to manage inspections, maintenance, and safety logs in one place"
      v-else />
  </div>
</template>
