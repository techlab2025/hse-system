<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import AnotherMeeting from '@/assets/images/AnotherMeeting.png'
import { ref } from 'vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import DatePicker from 'primevue/datepicker'
import TitleInterface from '@/base/Data/Models/title_interface'

const emit = defineEmits(['update:data'])
const time = ref()
const date = ref()
const SelectedPlatform = ref<TitleInterface>()
const Platforms = ref([
  new TitleInterface({ id: 1, title: 'zoom' }),
  new TitleInterface({ id: 2, title: 'teams' }),
])
const UpdateData = () => {
  emit('update:data', {
    platform: SelectedPlatform.value?.id,
    date: date.value,
    time: time.value,
  })
}

const setPlatform = (data: TitleInterface) => {
  SelectedPlatform.value = data
}
</script>
<template>
  <div class="another-meeting">
    <HeaderPage
      :title="`Do you want another meeting?`"
      :subtitle="`If the first meeting is not sufficient to close the investigation into the case`"
      :img="AnotherMeeting"
      class="title-header"
    />

    <div class="another-meeting-contect">
      <div class="flex flex-col gap-2 input-wrapper">
        <label for="time">time</label>
        <DatePicker
          v-model="date"
          class="mt-4 mr-2 input date-picker"
          placeholder="Select time"
          @update:model-value="UpdateData"
          input-id="time"
          :time-only="true"
        />
      </div>
      <div class="flex flex-col gap-2 input-wrapper">
        <label for="date">date</label>
        <DatePicker
          v-model="date"
          class="mt-4 mr-2 input date-picker"
          placeholder="Select Date"
          @update:model-value="UpdateData"
          input-id="date"
        />
      </div>
      <div class="input-wrapper">
        <CustomSelectInput
          :static-options="Platforms"
          v-model="SelectedPlatform"
          placeholder="Select meeting platform"
          class="mt-4 mr-2 input"
          label="meeting platform"
          @update:model-value="setPlatform"
        />
      </div>
    </div>
  </div>
</template>
