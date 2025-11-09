<script setup lang="ts">
import { ref } from 'vue'
import ColorSelection from '../WidgetUtils/ColorSelection.vue'
import RadioSection from '@/shared/HelpersComponents/RadioSection.vue'
import Progress1 from "@/assets/images/progress1.png";
import EmployeePerformanceProgress2 from "@/assets/images/EmployeePerformanceProgress2.png";
import EmployeePerformanceProgress3 from "@/assets/images/EmployeePerformanceProgress3.png";
import ZoneTitlesForm from '../WidgetUtils/ZoneTitlesForm.vue';

const emit = defineEmits(['update:value'])
const MainTitle = ref()
const MiniTitle = ref()
const Hint = ref()
const SelectedAvailable = ref()
const SelectedColor = ref()
const employeeJob = ref()
const employeeName = ref()
const lastTask = ref()
const team = ref()
const Progress = ref()
const employeePicture = ref()

const colors = ref([
  '#1D4ED8',
  '#EAEAEA',
  '#9760F6',
  '#FBF5B5',
  '#4CAF50'
])

const UpdateData = () => {
  emit('update:value', {
    MainTitle: MainTitle.value || null,
    MiniTitle: MiniTitle.value || null,
    Hint: Hint.value || null,
    employeePicture: employeePicture.value || null,
    employeeJob: employeeJob.value || null,
    employeeName: employeeName.value || null,
    lastTask: lastTask.value || null,
    team: team.value || null,
    Progress: Progress.value || null,
    SelectedColor: SelectedColor.value || null,
    SelectedAvailable: SelectedAvailable.value || null,
  })
}

const updateField = (field: string, value: any) => {
  switch (field) {
    case 'MainTitle': MainTitle.value = value; break
    case 'MiniTitle': MiniTitle.value = value; break
    case 'Hint': Hint.value = value; break
    case 'employeePicture': employeePicture.value = value; break
    case 'employeeJob': employeeJob.value = value; break
    case 'employeeName': employeeName.value = value; break
    case 'lastTask': lastTask.value = value; break
    case 'team': team.value = value; break
    case 'Progress': Progress.value = value; break
    case 'SelectedAvailable': SelectedAvailable.value = value; break
    case 'SelectedColor': SelectedColor.value = value; break
  }
  UpdateData()
}

const UpdateTitle = (data) => {
  MainTitle.value = data.MainTitle;
  MiniTitle.value = data.MiniTitle;
  Hint.value = data.Hint;
  if (data.MainTitle) updateField('MainTitle', MainTitle.value)
  if (data.MiniTitle) updateField('MiniTitle', MiniTitle.value)
  if (data.Hint) updateField('Hint', Hint.value)
}
</script>

<template>
  <ZoneTitlesForm @update:value="UpdateTitle" />


  <div class="selctors-container">
    <p class="title">check on details you want it to appear in your widget</p>

    <div class="setting-form">
      <RadioSection title="employee picture" :selections="['Yes', 'On']"
        @update:value="v => updateField('employeePicture', v)" />
      <RadioSection title="employee job" :selections="['Yes', 'No']"
        @update:value="v => updateField('employeeJob', v)" />
    </div>

    <div class="setting-form">
      <RadioSection title="employee name" :selections="['Yes', 'On']"
        @update:value="v => updateField('employeeName', v)" />
      <RadioSection title="last task" :selections="['Yes', 'No']" @update:value="v => updateField('lastTask', v)" />
    </div>


    <div class="setting-form">
      <RadioSection title="team" :selections="['Yes', 'On']" @update:value="v => updateField('team', v)" />
    </div>
  </div>

  <ColorSelection title="chart color" :colors="colors" @update:value="v => updateField('SelectedColor', v)" />
  <RadioSection title="Available to"
    :images_selections="[Progress1, EmployeePerformanceProgress2, EmployeePerformanceProgress3]"
    @update:value="v => updateField('Progress', v)" />
  <RadioSection title="Available to" :selections="['anyone', 'only me']"
    @update:value="v => updateField('SelectedAvailable', v)" />
</template>
