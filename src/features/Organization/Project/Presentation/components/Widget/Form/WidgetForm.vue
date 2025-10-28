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
import EditZoneFrom from './EditZoneFrom.vue'

interface WidgetInterface {
  id: number,
  name: string,
  img: string
}
const SelectedWidget = ref()
const WidgetsTypes = ref<WidgetInterface[]>([
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

const WidgetsData = ref(WidgetsTypes.value.slice(0, 4))
const AddWidgetDisplay = ref(true)
const AddWidget = () => {
  AddWidgetDisplay.value = false;
  WidgetsData.value = WidgetsTypes.value.slice(0, 8)
}

</script>

<template>
  <div class="widgets-form">
    <div class="widgets-container">
      <div class="widgets-types" v-for="(widget, index) in WidgetsData" :key="index"
        :class="SelectedWidget == widget.id ? 'active' : ''">
        <div class="types">
          <input type="radio" :id="`radio-${widget.id}`" name="radio" v-model="SelectedWidget" :value="widget.id">
          <img :src="widget.img" class="item" @click="SelectedWidget = widget.id" :for="`radio-${widget.id}`">
        </div>
        <p class="title">{{ wordSlice(widget.name, 18) }}</p>
      </div>
      <div class="add-widget" @click="AddWidget" :class="AddWidgetDisplay ? '' : 'hide'">
        <AddWidgetIcon />
        <div class="add-widget-text">
          <p class="title">Add Widget</p>
          <p class="subtitle">You can add one from the available to the project and control it easily.</p>
        </div>
      </div>
    </div>
    <div class="edit-zone-form" v-if="SelectedWidget">
      <EditZoneFrom :type="WidgetsTypes.find(x => x.id == SelectedWidget)?.id"
        :img="WidgetsTypes.find(x => x.id == SelectedWidget)?.img"
        :title="WidgetsTypes.find(x => x.id == SelectedWidget)?.name" />
    </div>
  </div>
</template>
