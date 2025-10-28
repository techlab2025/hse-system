<script setup lang="ts">
import { ref, watch } from 'vue'
import ColorSelection from '../WidgetUtils/ColorSelection.vue'
import RadioSection from '../WidgetUtils/RadioSection.vue'

const emit = defineEmits(['update:value'])

const SelectedAvailable = ref()
const SelectedColor = ref()
const RaisedBy = ref()
const AssignedTo = ref()
const date = ref()
const remarks = ref()
const time = ref()
const analysis = ref()
const correction = ref()
const ClosedBy = ref()
const ComplatedBy = ref()
const ClosedTime = ref()
const ClosedDate = ref()

const colors = ref([
  '#1D4ED8',
  '#EAEAEA',
  '#9760F6',
  '#FBF5B5',
  '#4CAF50'
])

const UpdateData = () => {
  emit('update:value', {
    RaisedBy: RaisedBy.value,
    AssignedTo: AssignedTo.value,
    Date: date.value,
    Remarks: remarks.value,
    Time: time.value,
    Analysis: analysis.value,
    Correction: correction.value,
    ClosedBy: ClosedBy.value,
    ComplatedBy: ComplatedBy.value,
    ClosedTime: ClosedTime.value,
    ClosedDate: ClosedDate.value,
    SelectedColor: SelectedColor.value,
    SelectedAvailable: SelectedAvailable.value
  })
}

const updateField = (field: string, value: any) => {
  switch (field) {
    case 'RaisedBy': RaisedBy.value = value; break
    case 'AssignedTo': AssignedTo.value = value; break
    case 'Date': date.value = value; break
    case 'Remarks': remarks.value = value; break
    case 'Time': time.value = value; break
    case 'Analysis': analysis.value = value; break
    case 'Correction': correction.value = value; break
    case 'ClosedBy': ClosedBy.value = value; break
    case 'ComplatedBy': ComplatedBy.value = value; break
    case 'ClosedTime': ClosedTime.value = value; break
    case 'ClosedDate': ClosedDate.value = value; break
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
      <RadioSection title="Raised by" :selections="['Yes', 'On']" @update:value="v => updateField('RaisedBy', v)" />
      <RadioSection title="Assigned to" :selections="['Yes', 'No']" @update:value="v => updateField('AssignedTo', v)" />
    </div>

    <div class="setting-form">
      <RadioSection title="Date" :selections="['Yes', 'On']" @update:value="v => updateField('Date', v)" />
      <RadioSection title="Remarks" :selections="['Yes', 'No']" @update:value="v => updateField('Remarks', v)" />
    </div>

    <div class="setting-form">
      <RadioSection title="Time" :selections="['Yes', 'On']" @update:value="v => updateField('Time', v)" />
      <RadioSection title="Root cause analysis" :selections="['Yes', 'No']"
        @update:value="v => updateField('Analysis', v)" />
    </div>

    <div class="setting-form">
      <RadioSection title="Correction" :selections="['Yes', 'On']" @update:value="v => updateField('Correction', v)" />
      <RadioSection title="Closed out by" :selections="['Yes', 'No']" @update:value="v => updateField('ClosedBy', v)" />
    </div>

    <div class="setting-form">
      <RadioSection title="Real completed by" :selections="['Yes', 'On']"
        @update:value="v => updateField('ComplatedBy', v)" />
      <RadioSection title="Closed time" :selections="['Yes', 'No']" @update:value="v => updateField('ClosedTime', v)" />
    </div>

    <div class="setting-form">
      <RadioSection title="Closed date" :selections="['Yes', 'On']" @update:value="v => updateField('ClosedDate', v)" />
    </div>
  </div>

  <ColorSelection title="chart color" :colors="colors" @update:value="v => updateField('SelectedColor', v)" />

  <RadioSection title="Available to" :selections="['anyone', 'only me']"
    @update:value="v => updateField('SelectedAvailable', v)" />
</template>
