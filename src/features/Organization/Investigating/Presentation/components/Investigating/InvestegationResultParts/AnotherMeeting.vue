<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import AnotherMeeting from '@/assets/images/AnotherMeeting.png'
import { ref, watch } from 'vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import DatePicker from 'primevue/datepicker'
import TitleInterface from '@/base/Data/Models/title_interface'
import InvestegationAnotherMeetingParams from '@/features/Organization/Investigating/Core/params/investegationResult/InvestegationAnotherMeetingParams'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'

const emit = defineEmits(['update:data'])
const time = ref(new Date())
const date = ref(new Date())
const SelectedPlatform = ref<TitleInterface>()
const Platforms = ref([
  new TitleInterface({ id: 1, title: 'zoom' }),
  new TitleInterface({ id: 2, title: 'teams' }),
])
const UpdateData = () => {

  const Meeting = new InvestegationAnotherMeetingParams(formatJoinDate(date?.value), formatTime(time?.value), SelectedPlatform?.value?.id)

  emit('update:data', {
    isAnother: isAnotherMeeting.value,
    meetings: isAnotherMeeting.value == 1 ? Meeting : null
  })
}

const setPlatform = (data: TitleInterface) => {
  SelectedPlatform.value = data
  UpdateData()

}

const isAnotherMeeting = ref(1)

watch(() => isAnotherMeeting.value, () => {
  UpdateData()
}, { immediate: true })
</script>
<template>
  <div class="another-meeting col-span-6">
    <div class="another-meeting-header">
      <HeaderPage :title="`Do you want another meeting?`"
        :subtitle="`If the first meeting is not sufficient to close the investigation into the case`"
        :img="AnotherMeeting" class="title-header" />
      <div class="meeting-status">
        <button class="meeting-status-yes" @click="isAnotherMeeting = 1"
          :class="isAnotherMeeting == 1 ? 'active' : ''">Yes</button>
        <button class="meeting-status-on" @click="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''">No</button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <div class="flex flex-col gap-2 input-wrapper col-span-2">
        <label for="time">time</label>
        <DatePicker v-model="time" class="mt-4 mr-2 input date-picker" placeholder="Select time"
          @update:model-value="UpdateData" input-id="time" :time-only="true" />
      </div>
      <div class="flex flex-col gap-2 input-wrapper col-span-2">
        <label for="date">date</label>
        <DatePicker v-model="date" class="mt-4 mr-2 input date-picker" placeholder="Select Date"
          @update:model-value="UpdateData" input-id="date" />
      </div>
      <div class="input-wrapper col-span-2">
        <CustomSelectInput :static-options="Platforms" v-model="SelectedPlatform" placeholder="Select meeting platform"
          class="mt-4 mr-2 input" label="meeting platform" @update:model-value="setPlatform" />
      </div>
    </div>
  </div>
</template>
