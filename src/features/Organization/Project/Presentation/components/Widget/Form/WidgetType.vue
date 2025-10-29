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
import AddWidgetIcon from '@/shared/icons/AddWidgetIcon.vue';
import wordSlice from '@/base/Presentation/utils/word_slice';

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

const WidgetsData = ref(WidgetsTypes.value.slice(0, 4))
const AddWidgetDisplay = ref(true)
const AddWidget = () => {
  AddWidgetDisplay.value = false;
  WidgetsData.value = WidgetsTypes.value.slice(0, WidgetsTypes.value.length)
}

watch(() => SelectedWidget.value, (newValue) => {
  emit('selected:widget', newValue)
})
</script>
<template>
  <div class="widgets-container" :class="!AddWidgetDisplay ? 'scroll-mode' : ''">
    <div class="widgets-types" v-for="(widget, index) in WidgetsData" :key="index" @click="SelectedWidget = widget.id"
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
        <p class="title">{{ $t(`add_widget`) }}</p>
        <p class="subtitle">
          {{ $t(`You can add one from the available to the project and control it easily.`) }}
        </p>
      </div>
    </div>
  </div>

</template>
