<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import EditTollIcon from '@/shared/icons/EditTollIcon.vue'
import ZoneIcon from '@/shared/icons/ZoneIcon.vue'
import WidgetSetting from './WidgetSetting.vue'
import ZoneTitlesForm from './WidgetUtils/ZoneTitlesForm.vue'

import NewProjectSafetyScoreWidget from '@/assets/images/NewProjectSafetyScoreWidget.png'
import NewProjectLocation from '@/assets/images/NewProjectLocation.png'
import NewLinkedCAPAs from '@/assets/images/NewLinkedCAPAs.png'
import NewEmployeePerformance from '@/assets/images/NewEmployeePerformance.png'
import NewNeedMentance from '@/assets/images/NewNeedMentance.png'
import NewNumberOfIncidence from '@/assets/images/NewNumberOfIncidence.png'
import NewEquipmentDevices from '@/assets/images/NewEquipmentDevices.png'
import TeamRatio from '@/assets/images/TeamRatio.png'

import NoteWidget from '@/assets/images/NotesWidget.png'

import ProjectSafetyWidget from './WidgetsTypesForms/ProjectSafetyWidget.vue'
import ProjectLocationsWidget from './WidgetsTypesForms/ProjectLocationsWidget.vue'

import { WidgetEnum } from '@/features/Organization/Project/Core/Enums/widget_enum'
import LinkedCAPAsWidget from './WidgetsTypesForms/LinkedCAPAsWidget.vue'
import EmployeePerformanceWidget from './WidgetsTypesForms/EmployeePerformanceWidget.vue'
import NeedMaintenanceWidget from './WidgetsTypesForms/NeedMaintenanceWidget.vue'
import NumberOfIncidentsWidget from './WidgetsTypesForms/NumberOfIncidentsWidget.vue'
import EquipmentDevicesWidget from './WidgetsTypesForms/EquipmentDevicesWidget.vue'
import TeamsRatioWidget from './WidgetsTypesForms/TeamsRatioWidget.vue'
import NotesWidget from './WidgetsTypesForms/NotesWidget.vue'

const props = defineProps<{
  type: number
  title: string
  img: string
}>()

const selectedType = ref(props.type)

const widgetOptions = [
  { id: WidgetEnum.ProjectSafetyScore, name: 'Project Safety Score', img: NewProjectSafetyScoreWidget, component: ProjectSafetyWidget },
  { id: WidgetEnum.ProjectLocations, name: 'Project Locations', img: NewProjectLocation, component: ProjectLocationsWidget },
  { id: WidgetEnum.LinkedCAPAs, name: 'Linked CAPAs', img: NewLinkedCAPAs, component: LinkedCAPAsWidget },
  { id: WidgetEnum.EmployeePerformance, name: 'Employee Performance', img: NewEmployeePerformance, component: EmployeePerformanceWidget },
  { id: WidgetEnum.NeedMaintenance, name: 'Need Maintenance', img: NewNeedMentance, component: NeedMaintenanceWidget },
  { id: WidgetEnum.NumberOfIncidents, name: 'Number Of Incidents', img: NewNumberOfIncidence, component: NumberOfIncidentsWidget },
  { id: WidgetEnum.EquipmentDevices, name: 'Equipment Devices', img: NewEquipmentDevices, component: EquipmentDevicesWidget },
  { id: WidgetEnum.TeamsRatio, name: 'Teams Ratio', img: TeamRatio, component: TeamsRatioWidget },
  { id: WidgetEnum.Noteswidget, name: 'Notes Widget', img: NoteWidget, component: NotesWidget },
]

const selectedWidget = computed(() => {
  return widgetOptions.find(widget => widget.id === selectedType.value)
})

watch(() => props.type, newType => {
  selectedType.value = newType
})


const WidgetDate = (data) => {
  console.log(data, "data");
}
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
        <component @update:value="WidgetDate($event)" :is="selectedWidget?.component" :id="selectedWidget.id"
          v-if="selectedWidget?.component" />
      </div>

      <div class="zone-image">
        <div class="zone-image-header">
          <p class="title">{{ props.title }}</p>
          <ZoneIcon />
        </div>
        <img :src=" selectedWidget?.img" alt="Widget Image" />
      </div>
    </div>
    <div class="save">
      <button class="btn btn-primary">save changes</button>
    </div>
  </div>
</template>
