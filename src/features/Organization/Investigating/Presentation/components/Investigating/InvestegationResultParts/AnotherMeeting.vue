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
import { InvestigationMeetingEnum } from '../../../../Core/Enums/investigation_meeting_enum'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])
const MeetingType = ref<string>('')

const time = ref(new Date())
const date = ref(new Date())
const SelectedPlatform = ref<TitleInterface>(
  new TitleInterface({ id: InvestigationMeetingEnum.ZOOM, title: 'zoom' }),
)

const Platforms = ref<TitleInterface[]>([
  new TitleInterface({ id: InvestigationMeetingEnum.ZOOM, title: 'Zoom' }),
  new TitleInterface({ id: InvestigationMeetingEnum.TEAM, title: 'Teams' }),
  new TitleInterface({ id: InvestigationMeetingEnum.SKYPE, title: 'Skype' }),
  new TitleInterface({ id: InvestigationMeetingEnum.GOOGLE_MEET, title: 'Google Meet' }),
  new TitleInterface({ id: InvestigationMeetingEnum.OTHER, title: 'Other' }),
])

const isOtherMeetingPlatform = () =>
  Number(SelectedPlatform.value?.id) === InvestigationMeetingEnum.OTHER

const UpdateData = () => {
  const Meeting = new InvestegationAnotherMeetingParams(
    formatJoinDate(date?.value),
    formatTime(time?.value),
    SelectedPlatform?.value?.id,
    MeetingType.value,
  )

  emit('update:data', {
    isAnother: isAnotherMeeting.value,
    meetings: isAnotherMeeting.value == 1 ? Meeting : null,
  })
}

const setPlatform = (data: TitleInterface) => {
  SelectedPlatform.value = data
  if (!isOtherMeetingPlatform()) MeetingType.value = ''
  UpdateData()
}

const isAnotherMeeting = ref(0)

watch(
  () => isAnotherMeeting.value,
  () => {
    UpdateData()
  },
  { immediate: true },
)
</script>
<template>
  <div class="another-meeting col-span-6">
    <div class="another-meeting-header">
      <!-- <div class="flex items-center gap-2"> -->
        <HeaderPage
          :title="`Do you want another meeting?`"
          :subtitle="`If the first meeting is not sufficient to close the investigation into the case`"
          :img="AnotherMeeting"
          class="title-header"
        />
        <!-- <FieldHelpIcon
          text="Choose Yes when more discussion, evidence, or review is required before closing the investigation."
        />
      </div> -->
      <div class="meeting-status">
        <button
          class="meeting-status-yes"
          @click="isAnotherMeeting = 1"
          :class="isAnotherMeeting == 1 ? 'active' : ''"
        >
          Yes
        </button>
        <button
          class="meeting-status-on"
          @click="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''"
        >
          No
        </button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <div class="flex flex-col gap-2 input-wrapper col-span-3">
        <div class="flex items-center gap-2">
          <label for="time">time</label
          ><FieldHelpIcon
            text="Select the planned start time for the follow-up investigation meeting."
          />
        </div>
        <DatePicker
          v-model="time"
          class="mt-4 mr-2 input date-picker"
          placeholder="Select time"
          @update:model-value="UpdateData"
          input-id="time"
          :time-only="true"
        />
      </div>
      <div class="flex flex-col gap-2 input-wrapper col-span-3">
        <div class="flex items-center gap-2">
          <label for="date">date</label
          ><FieldHelpIcon text="Select the planned date for the follow-up investigation meeting." />
        </div>
        <DatePicker
          v-model="date"
          class="mt-4 mr-2 input date-picker"
          placeholder="Select Date"
          @update:model-value="UpdateData"
          input-id="date"
        />
      </div>
      <div class="input-wrapper col-span-3">
        <CustomSelectInput
          :reload="false"
          :static-options="Platforms"
          v-model="SelectedPlatform"
          placeholder="Select meeting platform"
          class="mt-4 mr-2 input"
          label="meeting platform"
          help-text="Select the platform where the follow-up meeting will take place."
          @update:model-value="setPlatform"
        />
      </div>

      <div class="input-wrapper col-span-3" v-if="isOtherMeetingPlatform()">
        <div class="flex items-center gap-2">
          <label for="place">Meeting Place</label
          ><FieldHelpIcon
            text="Enter the physical location or other meeting method when Other is selected."
          />
        </div>
        <input
          id="place"
          placeholder="Enter meeting place"
          type="text"
          v-model="MeetingType"
          @input="UpdateData"
        />
      </div>
    </div>
  </div>
</template>
