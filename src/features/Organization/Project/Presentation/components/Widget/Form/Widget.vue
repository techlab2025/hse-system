<script setup lang="ts">
import ProjectSafetyScoreWidget from '@/assets/images/ProjectSafetyScoreWidget.png'
import ProjectLocation from '@/assets/images/ProjectLocation.png'
import LinkedCAPAs from '@/assets/images/LinkedCAPAs.png'
import EmployeePerformance from '@/assets/images/EmployeePerformance.png'
import NeedMentance from '@/assets/images/NeedMentance.png'
import NumberOfIncidence from '@/assets/images/NumberOfIncidence.png'
import EquipmentDevices from '@/assets/images/EquipmentDevices.png'
import NoteWidget from '@/assets/images/NotesWidget.png'
import { ref, watch } from 'vue';
import { WidgetEnum } from '@/features/Organization/Project/Core/Enums/widget_enum';
import WidgetFrom from './WidgetFrom.vue'
import WidgetType from './WidgetType.vue'


const emit = defineEmits(['selected:widget']);
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
  {
    id: WidgetEnum.Noteswidget,
    name: 'Note Widget',
    img: NoteWidget
  },
]
)

const GetSelectedWidget = (data) => {
  SelectedWidget.value = data

}
watch(() => SelectedWidget.value, (newValue) => {
  SelectedWidget.value = newValue
  emit('selected:widget', newValue)
})


</script>

<template>
  <div class="widgets-form">
    <WidgetType @selected:widget="GetSelectedWidget" />
    <div class="edit-zone-form" v-if="SelectedWidget">
      <WidgetFrom :type="WidgetsTypes.find(x => x.id == SelectedWidget)?.id"
        :img="WidgetsTypes.find(x => x.id == SelectedWidget)?.img"
        :title="WidgetsTypes.find(x => x.id == SelectedWidget)?.name" />
    </div>
  </div>
</template>
