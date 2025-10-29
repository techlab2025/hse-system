<script setup lang="ts">
import { ref, watch } from 'vue'
import ColorSelection from '../WidgetUtils/ColorSelection.vue'
import RadioSection from '../../../../../../../../shared/HelpersComponents/RadioSection.vue'
import ProgressSection from '../WidgetUtils/ProgressSection.vue'
import Progress1 from "@/assets/images/progress1.png";
import TitleInterface from '@/base/Data/Models/title_interface';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import ZoneTitlesForm from '../WidgetUtils/ZoneTitlesForm.vue';

const emit = defineEmits(['update:value'])
const MainTitle = ref()
const MiniTitle = ref()
const Hint = ref()
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
const WantedType = ref()
const SelectedOption = ref<TitleInterface>()

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
    subType: subType.value || null,
    name: name.value || null,
    picture: picture.value || null,
    lastInspection: lastInspection.value || null,
    inspectionDuration: inspectionDuration.value || null,
    lastInspectionBy: lastInspectionBy.value || null,
    lastInspectionDate: lastInspectionDate.value || null,
    AppearWay: AppearWay.value || null,
    WantedType: WantedType.value || null,
    SelectedOption: SelectedOption.value || null,
    SelectedColor: SelectedColor.value || null,
    SelectedAvailable: SelectedAvailable.value || null,
  })
}

const updateField = (field: string, value: any) => {
  switch (field) {
    case 'MainTitle': MainTitle.value = value; break
    case 'MiniTitle': MiniTitle.value = value; break
    case 'Hint': Hint.value = value; break
    case 'subType': subType.value = value; break
    case 'name': name.value = value; break
    case 'picture': picture.value = value; break
    case 'lastInspection': lastInspection.value = value; break
    case 'inspectionDuration': inspectionDuration.value = value; break
    case 'lastInspectionBy': lastInspectionBy.value = value; break
    case 'lastInspectionDate': lastInspectionDate.value = value; break
    case 'AppearWay': AppearWay.value = value; break
    case 'WantedType': WantedType.value = value; break
    case 'SelectedOption': SelectedOption.value = value; break
    case 'SelectedAvailable': SelectedAvailable.value = value; break
    case 'SelectedColor': SelectedColor.value = value; break
  }
  UpdateData()
}

const Options = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'name' }),
  new TitleInterface({ id: 2, title: 'name' }),
  new TitleInterface({ id: 3, title: 'name' }),
  new TitleInterface({ id: 4, title: 'name' }),
])
const UpdateOption = (data: TitleInterface) => {
  SelectedOption.value = data
  updateField('SelectedOption', SelectedOption.value.id)

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

  <div class="Selections">
    <RadioSection title="Choose the way you want to appear" :selections="['count of Equipment', 'show the Equipment']"
      @update:value="v => updateField('AppearWay', v)" />
    <RadioSection title="Choose the type you want"
      :selections="['Equipment only', 'devices only', 'tools only', 'show all']"
      @update:value="v => updateField('WantedType', v)" :Customize="true" @update:customize="console.log($event);" />
  </div>
  <div class="type-select">
    <CustomSelectInput :staticOptions="Options" @update:value="UpdateOption" :modelValue="SelectedOption"
      label="select the types you want" id="EmployeeType" placeholder="select here" />
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
