<script setup lang="ts">
// import EditTollIcon from '@/shared/icons/EditTollIcon.vue';
import ToolCard from './ToolCard.vue';
import LocationPin from "@/assets/images/LocationPin.png"
import AddEquipmentDialog from '../../Dialogs/EquipmentDialog/AddEquipmentDialog.vue';
import { computed, ref, watch } from 'vue';
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone';
import EmptyData from '../LocationsTeams/EmptyData.vue';
import EquimentFolderEmpty from "@/assets/images/EquimentFolderEmpty.png"
import { useRoute } from 'vue-router';


const route = useRoute()
const id = route.params.id || route.params.project_id
const props = defineProps<{
  zones: SohwProjectZoonModel
}>()
const Zones = ref(props.zones)
watch(() => props.zones, (newValue) => {
  Zones.value = newValue
})

</script>

<template>
  <div class="equipment-card" v-if="Zones?.projectZoonEquipments?.length > 0">
    <div class="equipment-card-header-container">
      <div class="equipment-card-header">
        <img :src="LocationPin" alt="equipment logo">
        <div class="equipment-card-header-text">
          <p class="title">{{ Zones?.zoonTitle }}</p>
          <p class="subtitle"><span>{{ Zones?.projectZoonEquipments?.length }} </span> Equipment & Devices</p>
        </div>
      </div>
      <div class="equipment-card-actions">
        <AddEquipmentDialog :zoonId="Zones?.projectZoonId" />
      </div>
    </div>
    <hr class="equipment-hr">

    <div class="tool-cards" v-if="Zones?.projectZoonEquipments?.length > 0">
      <ToolCard v-for="(tool, index) in Zones?.projectZoonEquipments" :key="index" :tool="tool" />
    </div>

  </div>

</template>
