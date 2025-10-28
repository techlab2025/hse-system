<script setup lang="ts">
import { ref, watch } from 'vue'
import ColorSelection from '../WidgetUtils/ColorSelection.vue'
import RadioSection from '../WidgetUtils/RadioSection.vue'
import ProgressSection from '../WidgetUtils/ProgressSection.vue'
import Progress1 from "@/assets/images/progress1.png";

const emit = defineEmits(['update:value'])

const SelectedAvailable = ref()
const SelectedColor = ref()
const employeeJob = ref()
const employeeName = ref()
const lastTask = ref()
const team = ref()
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
    employeePicture: employeePicture.value,
    employeeJob: employeeJob.value,
    employeeName: employeeName.value,
    lastTask: lastTask.value,
    team: team.value,
    SelectedColor: SelectedColor.value,
    SelectedAvailable: SelectedAvailable.value
  })
}

const updateField = (field: string, value: any) => {
  switch (field) {
    case 'employeePicture': employeePicture.value = value; break
    case 'employeeJob': employeeJob.value = value; break
    case 'employeeName': employeeName.value = value; break
    case 'lastTask': lastTask.value = value; break
    case 'team': team.value = value; break
    case 'SelectedAvailable': SelectedAvailable.value = value; break
    case 'SelectedColor': SelectedColor.value = value; break
  }
  UpdateData()
}
</script>

<template>
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
  <RadioSection title="Available to" :images_selections="[Progress1, Progress1, Progress1]"
    @update:value="v => updateField('SelectedAvailable', v)" />
  <RadioSection title="Available to" :selections="['anyone', 'only me']"
    @update:value="v => updateField('SelectedAvailable', v)" />
</template>
