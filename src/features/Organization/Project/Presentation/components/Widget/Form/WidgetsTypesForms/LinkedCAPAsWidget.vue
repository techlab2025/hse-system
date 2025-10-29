<script setup lang="ts">
import { ref, watch } from 'vue'
import ColorSelection from '../WidgetUtils/ColorSelection.vue'
import RadioSection from '../../../../../../../../shared/HelpersComponents/RadioSection.vue'
import ZoneTitlesForm from '../WidgetUtils/ZoneTitlesForm.vue'

const emit = defineEmits(['update:value'])

const MainTitle = ref()
const MiniTitle = ref()
const Hint = ref()
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
    MainTitle: MainTitle.value || null,
    MiniTitle: MiniTitle.value || null,
    Hint: Hint.value || null,
    RaisedBy: RaisedBy.value || null,
    AssignedTo: AssignedTo.value || null,
    Date: date.value || null,
    Remarks: remarks.value || null,
    Time: time.value || null,
    Analysis: analysis.value || null,
    Correction: correction.value || null,
    ClosedBy: ClosedBy.value || null,
    ComplatedBy: ComplatedBy.value || null,
    ClosedTime: ClosedTime.value || null,
    ClosedDate: ClosedDate.value || null,
    SelectedColor: SelectedColor.value || null,
    SelectedAvailable: SelectedAvailable.value || null,
  })
}

const updateField = (field: string, value: any) => {
  switch (field) {
    case 'MainTitle': MainTitle.value = value; break
    case 'MiniTitle': MiniTitle.value = value; break
    case 'Hint': Hint.value = value; break
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
