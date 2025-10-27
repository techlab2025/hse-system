<script setup lang="ts">
import ProjectSafetyScoreWidget from '@/assets/images/ProjectSafetyScoreWidget.png'
import ProjectLocation from '@/assets/images/ProjectLocation.png'
import LinkedCAPAs from '@/assets/images/LinkedCAPAs.png'
import EmployeePerformance from '@/assets/images/EmployeePerformance.png'
import NeedMentance from '@/assets/images/NeedMentance.png'
import NumberOfIncidence from '@/assets/images/NumberOfIncidence.png'
import EquipmentDevices from '@/assets/images/EquipmentDevices.png'
import { ref } from 'vue';
import { WidgetEnum } from '@/features/Organization/Project/Core/Enums/widget_enum';
import AddWidgetIcon from '@/shared/icons/AddWidgetIcon.vue';
import wordSlice from '@/base/Presentation/utils/word_slice';

const SelectedWidget = ref()
const WidgetsTypes = ref([
  {
    id: WidgetEnum.ProjectSafetyScore,
    name: 'Project Safety Score',
    img: ProjectSafetyScoreWidget
  },
  {
    id: WidgetEnum.ProjectLocations,
    name: 'Project Locations',
    img: ProjectLocation
  },
  {
    id: WidgetEnum.LinkedCAPAs,
    name: 'Linked CAPAs',
    img: LinkedCAPAs
  },
  {
    id: WidgetEnum.EmployeePerformance,
    name: 'Employee Performance',
    img: EmployeePerformance
  },
  {
    id: WidgetEnum.NeedMaintenance,
    name: 'Need Maintenance',
    img: NeedMentance
  },
  {
    id: WidgetEnum.NumberOfIncidents,
    name: 'Number Of Incidents',
    img: NumberOfIncidence
  },
  {
    id: WidgetEnum.EquipmentDevices,
    name: 'Equipment Devices',
    img: EquipmentDevices
  },
  {
    id: WidgetEnum.TeamsRatio,
    name: 'Teams Ratio',
    img: EquipmentDevices
  },
]
)

</script>

<template>
  <div class="widgets-form">
    <div class="widgets-container">
      <div class="widgets-types" v-for="(widget, index) in WidgetsTypes.slice(0, 4)" :key="index"
        :class="SelectedWidget == widget.id ? 'active' : ''">
        <div class="types">
          <input type="radio" :id="`radio-${widget.id}`" name="radio" v-model="SelectedWidget" :value="widget.id">
          <img :src="widget.img" class="item" @click="SelectedWidget = widget.id" :for="`radio-${widget.id}`">
        </div>
        <p class="title">{{ wordSlice(widget.name, 30) }}</p>
      </div>
      <div class="add-widget" >
        <AddWidgetIcon />
        <div class="add-widget-text">
          <p class="title">Add Widget</p>
          <p class="subtitle">You can add one from the available to the project and control it easily.</p>
        </div>
      </div>
    </div>
  </div>
</template>
