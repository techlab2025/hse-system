<script setup lang="ts">
import ProjectSafetyScoreWidget from '@/assets/images/ProjectSafetyScoreWidget.png'
import ProjectLocation from '@/assets/images/ProjectLocation.png'
import LinkedCAPAs from '@/assets/images/LinkedCAPAs.png'
import EmployeePerformance from '@/assets/images/EmployeePerformance.png'
import NeedMentance from '@/assets/images/NeedMentance.png'
import NumberOfIncidence from '@/assets/images/NumberOfIncidence.png'
import EquipmentDevices from '@/assets/images/EquipmentDevices.png'
import NoteWidget from '@/assets/images/NotesWidget.png'
import TeamRatioWidget from '@/assets/images/TeamRatioWidget.png'
import { ref, watch, onMounted } from 'vue';
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
    img: TeamRatioWidget
  },
  {
    id: WidgetEnum.Noteswidget,
    name: 'Note Widget',
    img: NoteWidget
  },
])

const WidgetsData = ref(WidgetsTypes.value.slice(0, 4))
const AddWidgetDisplay = ref(true)
const AddWidget = () => {
  AddWidgetDisplay.value = false;
  WidgetsData.value = WidgetsTypes.value.slice(0, WidgetsTypes.value.length)
}

watch(() => SelectedWidget.value, (newValue) => {
  emit('selected:widget', newValue)
})

const setupDragScroll = () => {
  const container = document.querySelector('.widgets-container') as HTMLElement;
  if (!container) return;

  let isDown = false;
  let startX: number;
  let scrollLeftPos: number;

  container.addEventListener('mousedown', (e: MouseEvent) => {
    isDown = true;
    container.classList.add('active-drag');
    startX = e.pageX - container.offsetLeft;
    scrollLeftPos = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('active-drag');
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('active-drag');
  });

  container.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeftPos - walk;
  });
}

watch(() => AddWidgetDisplay.value, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      setupDragScroll();
    }, 0);
  }
})

onMounted(() => {
  if (!AddWidgetDisplay.value) {
    setupDragScroll();
  }
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
          {{ $t(`you_can_add_one_from_the_available_to_the_project_and_control_it_easily`) }}
        </p>
      </div>
    </div>
  </div>
</template>
