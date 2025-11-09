<script setup lang="ts">
import { ref } from 'vue'
import ColorSelection from '../WidgetUtils/ColorSelection.vue'
import RadioSection from '@/shared/HelpersComponents/RadioSection.vue'
import ZoneTitlesForm from '../WidgetUtils/ZoneTitlesForm.vue'


const emit = defineEmits(['update:value'])
const MainTitle = ref()
const MiniTitle = ref()
const Hint = ref()
const ActionColor = ref()
const title = ref()
const SelectedAvailable = ref()
const SelectedColor = ref()
const description = ref()
const picture = ref()
const date = ref()
const time = ref()
const addedby = ref()
const PoweredTo = ref()

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
    title: title.value || null,
    description: description.value || null,
    picture: picture.value || null,
    date: date.value || null,
    time: time.value || null,
    addedby: addedby.value || null,
    ActionColor: ActionColor.value || null,
    PoweredTo: PoweredTo.value || null,
    SelectedColor: SelectedColor.value || null,
    SelectedAvailable: SelectedAvailable.value || null,
  })
}

const updateField = (field: string, value: any) => {
  switch (field) {
    case 'MainTitle': MainTitle.value = value; break
    case 'MiniTitle': MiniTitle.value = value; break
    case 'Hint': Hint.value = value; break
    case 'title': title.value = value; break
    case 'description': description.value = value; break
    case 'picture': picture.value = value; break
    case 'date': date.value = value; break
    case 'time': time.value = value; break
    case 'addedby': addedby.value = value; break
    case 'ActionColor': ActionColor.value = value; break
    case 'PoweredTo': PoweredTo.value = value; break
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

  <ColorSelection title="Action color" :colors="colors" @update:value="v => updateField('ActionColor', v)" />

  <div class="selctors-container">
    <p class="title">check on the data that can be added in a single note</p>
    <div class="setting-form">
      <RadioSection title="title" :selections="['Yes', 'No']" @update:value="v => updateField('title', v)" />
      <RadioSection title="description" :selections="['Yes', 'No']"
        @update:value="v => updateField('description', v)" />
    </div>
    <div class="setting-form">
      <RadioSection title="picture" :selections="['Yes', 'No']" @update:value="v => updateField('picture', v)" />
      <RadioSection title="date" :selections="['Yes', 'No']" @update:value="v => updateField('date', v)" />
    </div>
    <div class="setting-form">
      <RadioSection title="time" :selections="['Yes', 'No']" @update:value="v => updateField('time', v)" />
      <RadioSection title="added by" :selections="['Yes', 'No']" @update:value="v => updateField('addedby', v)" />
    </div>
    <RadioSection title="Who has the power to edit and delete?"
      :selections="['anyone', 'only me', 'Each person has access to his own note only.']"
      @update:value="v => updateField('PoweredTo', v)" />
  </div>
  <ColorSelection title="chart color" :colors="colors" @update:value="v => updateField('SelectedColor', v)" />
  <RadioSection title="Available to" :selections="['anyone', 'only me']"
    @update:value="v => updateField('SelectedAvailable', v)" />
</template>
