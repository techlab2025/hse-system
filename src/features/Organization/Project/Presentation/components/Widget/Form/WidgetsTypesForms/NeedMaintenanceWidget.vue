<script setup lang="ts">
import { ref, watch } from 'vue'
import ColorSelection from '../WidgetUtils/ColorSelection.vue'
import RadioSection from '../WidgetUtils/RadioSection.vue'
import ProgressSection from '../WidgetUtils/ProgressSection.vue'
import Progress1 from "@/assets/images/progress1.png";

const emit = defineEmits(['update:value'])

const SelectedAvailable = ref()
const SelectedColor = ref()
const name = ref()
const picture = ref()
const lastInspection = ref()
const lastInspectionBy = ref()
const lastInspectionDate = ref()
const inspectionDuration = ref()
const subType = ref()
const AppearWay = ref()

const colors = ref([
  '#1D4ED8',
  '#EAEAEA',
  '#9760F6',
  '#FBF5B5',
  '#4CAF50'
])

const UpdateData = () => {
  emit('update:value', {
    subType: subType.value,
    name: name.value,
    picture: picture.value,
    lastInspection: lastInspection.value,
    inspectionDuration: inspectionDuration.value,
    lastInspectionBy: lastInspectionBy.value,
    lastInspectionDate: lastInspectionDate.value,
    AppearWay: AppearWay.value,
    SelectedColor: SelectedColor.value,
    SelectedAvailable: SelectedAvailable.value
  })
}

const updateField = (field: string, value: any) => {
  switch (field) {
    case 'subType': subType.value = value; break
    case 'name': name.value = value; break
    case 'picture': picture.value = value; break
    case 'lastInspection': lastInspection.value = value; break
    case 'inspectionDuration': inspectionDuration.value = value; break
    case 'lastInspectionBy': lastInspectionBy.value = value; break
    case 'lastInspectionDate': lastInspectionDate.value = value; break
    case 'AppearWay': AppearWay.value = value; break
    case 'SelectedAvailable': SelectedAvailable.value = value; break
    case 'SelectedColor': SelectedColor.value = value; break
  }
  UpdateData()
}
</script>

<template>
  <div class="Selections">
    <RadioSection title="Choose the way you want to appear" :selections="['count of Equipment', 'show the Equipment']"
      @update:value="v => updateField('AppearWay', v)" />
    <RadioSection title="Choose the type you want"
      :selections="['Equipment only', 'devices only', 'tools only', 'show all']"
      @update:value="v => updateField('AppearWay', v)" :Customize="true" @update:customize="console.log($event);" />

  </div>
  <div class="selctors-container">
    <p class="title">check on details you want it to appear in your widget</p>

    <div class="setting-form">
      <RadioSection title="sub type" :selections="['Yes', 'On']" @update:value="v => updateField('subType', v)" />
      <RadioSection title="name" :selections="['Yes', 'No']" @update:value="v => updateField('name', v)" />
    </div>

    <div class="setting-form">
      <RadioSection title="picture" :selections="['Yes', 'On']" @update:value="v => updateField('picture', v)" />
      <RadioSection title="last inspection" :selections="['Yes', 'No']"
        @update:value="v => updateField('lastInspection', v)" />
    </div>


    <div class="setting-form">
      <RadioSection title="inspection duration" :selections="['Yes', 'On']"
        @update:value="v => updateField('inspectionDuration', v)" />
      <RadioSection title="last inspection by" :selections="['Yes', 'On']"
        @update:value="v => updateField('lastInspectionBy', v)" />
    </div>
    <div class="setting-form">
      <RadioSection title="last inspection date" :selections="['Yes', 'On']"
        @update:value="v => updateField('lastInspectionDate', v)" />
    </div>
  </div>

  <ColorSelection title="chart color" :colors="colors" @update:value="v => updateField('SelectedColor', v)" />

  <RadioSection title="Available to" :selections="['anyone', 'only me']"
    @update:value="v => updateField('SelectedAvailable', v)" />
</template>
