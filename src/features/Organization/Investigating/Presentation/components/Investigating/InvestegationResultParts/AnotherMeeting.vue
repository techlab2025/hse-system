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
  new TitleInterface({ id: InvestigationMeetingEnum.ZOOM, title: 'zoom', translationKey: 'Zoom' }),
)

const Platforms = ref<TitleInterface[]>([
  new TitleInterface({ id: InvestigationMeetingEnum.ZOOM, title: 'Zoom', translationKey: 'Zoom' }),
  new TitleInterface({
    id: InvestigationMeetingEnum.TEAM,
    title: 'Teams',
    translationKey: 'Teams',
  }),
  new TitleInterface({
    id: InvestigationMeetingEnum.SKYPE,
    title: 'Skype',
    translationKey: 'Skype',
  }),
  new TitleInterface({
    id: InvestigationMeetingEnum.GOOGLE_MEET,
    title: 'Google Meet',
    translationKey: 'Google Meet',
  }),
  new TitleInterface({
    id: InvestigationMeetingEnum.OTHER,
    title: 'Other',
    translationKey: 'Other',
  }),
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
        :title="$t('Do you want another meeting?')"
        :subtitle="
          $t('If the first meeting is not sufficient to close the investigation into the case')
        "
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
          {{ $t('Yes') }}
        </button>
        <button
          class="meeting-status-on"
          @click="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''"
        >
          {{ $t('No') }}
        </button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <div class="flex flex-col gap-2 input-wrapper col-span-3">
        <div class="flex items-center gap-2">
          <label for="time">{{ $t('time') }}</label
          ><FieldHelpIcon
            :text="$t('Select the planned start time for the follow-up investigation meeting.')"
          />
        </div>
        <DatePicker
          v-model="time"
          class="mt-4 mr-2 input date-picker"
          :placeholder="$t('Select time')"
          @update:model-value="UpdateData"
          input-id="time"
          :time-only="true"
        />
      </div>
      <div class="flex flex-col gap-2 input-wrapper col-span-3">
        <div class="flex items-center gap-2">
          <label for="date">{{ $t('date') }}</label
          ><FieldHelpIcon
            :text="$t('Select the planned date for the follow-up investigation meeting.')"
          />
        </div>
        <DatePicker
          v-model="date"
          class="mt-4 mr-2 input date-picker"
          :placeholder="$t('Select Date')"
          @update:model-value="UpdateData"
          input-id="date"
        />
      </div>
      <div class="input-wrapper col-span-3">
        <CustomSelectInput
          :reload="false"
          :static-options="Platforms"
          v-model="SelectedPlatform"
          :placeholder="$t('Select meeting platform')"
          class="mt-4 mr-2 input"
          :label="$t('meeting platform')"
          :help-text="$t('Select the platform where the follow-up meeting will take place.')"
          @update:model-value="setPlatform"
        />
      </div>

      <div class="input-wrapper col-span-3" v-if="isOtherMeetingPlatform()">
        <div class="flex items-center gap-2">
          <label for="place">{{ $t('Meeting Place') }}</label
          ><FieldHelpIcon
            :text="
              $t('Enter the physical location or other meeting method when Other is selected.')
            "
          />
        </div>
        <input
          dir="auto"
          id="place"
          :placeholder="$t('Enter meeting place')"
          type="text"
          v-model="MeetingType"
          @input="UpdateData"
        />
      </div>
    </div>
  </div>
</template>
