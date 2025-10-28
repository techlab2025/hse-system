<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import EditTollIcon from '@/shared/icons/EditTollIcon.vue'
import ZoneIcon from '@/shared/icons/ZoneIcon.vue'
import WidgetSetting from './WidgetSetting.vue'
import ZoneTitlesForm from './WidgetUtils/ZoneTitlesForm.vue'

import ProjectSafetyScoreWidget from '@/assets/images/ProjectSafetyScoreWidget.png'
import ProjectLocation from '@/assets/images/ProjectLocation.png'
import LinkedCAPAs from '@/assets/images/LinkedCAPAs.png'
import EmployeePerformance from '@/assets/images/EmployeePerformance.png'
import NeedMaintenance from '@/assets/images/NeedMentance.png'
import NumberOfIncidents from '@/assets/images/NumberOfIncidence.png'
import EquipmentDevices from '@/assets/images/EquipmentDevices.png'

import ProjectSafetyWidget from './WidgetsTypesForms/ProjectSafetyWidget.vue'
import ProjectLocationsWidget from './WidgetsTypesForms/ProjectLocationsWidget.vue'

import { WidgetEnum } from '@/features/Organization/Project/Core/Enums/widget_enum'
import LinkedCAPAsWidget from './WidgetsTypesForms/LinkedCAPAsWidget.vue'
import EmployeePerformanceWidget from './WidgetsTypesForms/EmployeePerformanceWidget.vue'
import NeedMaintenanceWidget from './WidgetsTypesForms/NeedMaintenanceWidget.vue'

const props = defineProps<{
  type: number
  title: string
  img: string
}>()

const selectedType = ref(props.type)

const widgetOptions = [
  { id: WidgetEnum.ProjectSafetyScore, name: 'Project Safety Score', img: ProjectSafetyScoreWidget, component: ProjectSafetyWidget },
  { id: WidgetEnum.ProjectLocations, name: 'Project Locations', img: ProjectLocation, component: ProjectLocationsWidget },
  { id: WidgetEnum.LinkedCAPAs, name: 'Linked CAPAs', img: LinkedCAPAs, component: LinkedCAPAsWidget },
  { id: WidgetEnum.EmployeePerformance, name: 'Employee Performance', img: EmployeePerformance , component: EmployeePerformanceWidget},
  { id: WidgetEnum.NeedMaintenance, name: 'Need Maintenance', img: NeedMaintenance , component: NeedMaintenanceWidget},
  { id: WidgetEnum.NumberOfIncidents, name: 'Number Of Incidents', img: NumberOfIncidents },
  { id: WidgetEnum.EquipmentDevices, name: 'Equipment Devices', img: EquipmentDevices },
  { id: WidgetEnum.TeamsRatio, name: 'Teams Ratio', img: EquipmentDevices }
]

const selectedWidget = computed(() => {
  return widgetOptions.find(widget => widget.id === selectedType.value)
})

watch(() => props.type, newType => {
  selectedType.value = newType
})
</script>

<template>
  <div class="edit-zone">
    <hr class="edit-zone-hr" />

    <div class="zone-form-container">
      <div class="zone-data">
        <div class="zone-header-container">
          <div class="zone-header">
            <EditTollIcon class="icon" />
            <p class="title">Edit Zone</p>
          </div>
          <p class="delete">Delete</p>
        </div>

        <ZoneTitlesForm @update:value="console.log($event)" />

        <component @update:value="console.log($event)" :is="selectedWidget?.component" v-if="selectedWidget?.component" />
      </div>

      <div class="zone-image">
        <div class="zone-image-header">
          <p class="title">{{ props.title }}</p>
          <ZoneIcon />
        </div>
        <img :src="props.img || selectedWidget?.img" alt="Widget Image" />
      </div>
    </div>
  </div>
</template>
