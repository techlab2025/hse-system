<script setup lang="ts">
import { ref } from 'vue'
import ColorSelection from '../WidgetUtils/ColorSelection.vue'
import RadioSection from '@/shared/HelpersComponents/RadioSection.vue'
import ZoneTitlesForm from '../WidgetUtils/ZoneTitlesForm.vue'


const emit = defineEmits(['update:value'])

const MainTitle = ref()
const MiniTitle = ref()
const Hint = ref()
const SelectedAvailable = ref()
const SelectedColor = ref()

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
    Hint: Hint.value || null,
    MiniTitle: MiniTitle.value || null,
    SelectedAvailable: SelectedAvailable.value || null,
    SelectedColor: SelectedColor.value || null,
  })
}

const updateField = (field: string, value: any) => {
  switch (field) {
    case 'MainTitle': MainTitle.value = value; break
    case 'MiniTitle': MiniTitle.value = value; break
    case 'Hint': Hint.value = value; break
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
  <ColorSelection title="chart color" :colors="colors" @update:value="v => updateField('SelectedColor', v)" />
  <RadioSection title="Available to" :selections="['anyone', 'only me']"
    @update:value="v => updateField('SelectedAvailable', v)" />
</template>
