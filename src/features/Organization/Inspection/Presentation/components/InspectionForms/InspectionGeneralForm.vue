<script setup lang="ts">
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import InspectionTypeSelection from '../InspectionUtils/InspectionTypeSelection.vue';
import PeriodTypeSelect from '../InspectionUtils/PeriodTypeSelect.vue';
import { InspectionTypeEnum } from '../../../Core/Enum/InspectionTypeEnum';
import { PeriodTypeEnum } from '../../../Core/Enum/PeriodTypeEnum';
import TitleInterface from '@/base/Data/Models/title_interface';
import { ref } from 'vue';
import DatePicker from 'primevue/datepicker';
const emit = defineEmits(['update:data'])

const UpdateData = () => {
  emit('update:data', {
    inspectionType: SelectedInspectionType.value, // once or period
    onceday: SelectedData.value, // date if once
    periodType: SelectedPeriodType.value , // if period type of period
    periodByday: SelectedDay.value, // date if type of period day
    PeridWithDate: SelectedWithDateDays.value, // date if type of period with date
    bydates: SelectedbyDays.value, // date if type of period by date
    fromDate: fromDate.value,
    toDate: null,
  })
}
const inspectionType = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Once' }),
  new TitleInterface({ id: 2, title: 'period' }),
])
const SelectedInspectionType = ref<InspectionTypeEnum>(InspectionTypeEnum.DAY)
const GetInspectionType = (data: InspectionTypeEnum) => {
  SelectedInspectionType.value = data
  UpdateData()
}

const SelectedDay = ref<TitleInterface[]>()
const DayesSelection = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Saturday' }),
  new TitleInterface({ id: 2, title: 'Sunday' }),
  new TitleInterface({ id: 3, title: 'Monday' }),
  new TitleInterface({ id: 4, title: 'Tuesday' }),
  new TitleInterface({ id: 5, title: 'Wednesday' }),
  new TitleInterface({ id: 6, title: 'Thursday' }),
  new TitleInterface({ id: 7, title: 'Friday' }),
])


const setDay = (data: TitleInterface[]) => {
  SelectedDay.value = data
  UpdateData()
}

const PeriodTypeSelection = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'daily' }),
  new TitleInterface({ id: 2, title: 'by day' }),
  new TitleInterface({ id: 3, title: 'with date' }),
  new TitleInterface({ id: 4, title: 'by date' }),

])

const SelectedPeriodType = ref<TitleInterface>( )
const GetSelectedPeridType = (data) => {
  SelectedPeriodType.value = data
  UpdateData()
}

const SelectedData = ref()
const UpdateDate = (date) => {
  SelectedData.value = date
  UpdateData()
}

const SelectedWithDateDays = ref<TitleInterface[]>([])
const WithDateDayesSelection = ref<TitleInterface[]>(
  Array.from({ length: 31 }, (_, i) => new TitleInterface({
    id: `${i + 1}`,
    title: String(i + 1)
  }))
);

const setWithDateDayes = (data: TitleInterface[]) => {
  SelectedWithDateDays.value = data
  UpdateData()
}
const fromDate = ref(new Date())
const UpdateFromDate = (date: Date) => {
  fromDate.value = date
}

const SelectedbyDays = ref<Date[]>([])
const setByDateDayes = (date: Date[]) => {
  SelectedbyDays.value = date
  UpdateData()
}
</script>

<template>
  <InspectionTypeSelection :selectedtype="SelectedInspectionType" :options="inspectionType" :title="`inspect type`"
    @update:data="GetInspectionType" />

  <div class="select-time" v-if="SelectedInspectionType && SelectedInspectionType == InspectionTypeEnum.DAY">
    <div class="input-wrapper">
      <label for="from-dete">{{ $t('from_date') }}</label>
      <DatePicker id="from-dete" class="input" v-model="fromDate" @update:model-value="UpdateFromDate"
        placeholder="select from date..." />
    </div>
    <div class="input-wrapper">
      <label for="">{{ $t('select_day') }}</label>
      <DatePicker v-model="SelectedData" class="input" label="select day" id="Day" placeholder="select your Day"
        @update:modelValue="UpdateDate" />
    </div>

  </div>
  <div v-else>
    <PeriodTypeSelect :options="PeriodTypeSelection" :title="`select period type`"
      @update:data="GetSelectedPeridType" />

    <div class="input-wrapper">
      <label for="from-dete">{{ $t('from_date') }}</label>
      <DatePicker id="from-dete" class="input" v-if="inspectionType != InspectionTypeEnum.DAY" v-model="fromDate"
        @update:model-value="UpdateFromDate" placeholder="select from date..." />
    </div>
    <CustomSelectInput v-if="SelectedPeriodType == PeriodTypeEnum.BYDAY" :modelValue="SelectedDay" class="input"
      :static-options="DayesSelection" :label="$t('Start_day')" id="Day" :placeholder="$t('select_your_Day')" :type="2"
      @update:modelValue="setDay" />
    <CustomSelectInput v-if="SelectedPeriodType == PeriodTypeEnum.WHITDATE" :modelValue="SelectedWithDateDays"
      class="input" :static-options="WithDateDayesSelection" :type="2" :label="$t('Start_day')" id="Day"
      :placeholder="$t('select_your_Day')" @update:modelValue="setWithDateDayes" />

    <div class="input-wrapper" v-if="SelectedPeriodType == PeriodTypeEnum.BYDATE">
      <label for="by-dete">{{ $t('by_date') }}</label>
      <DatePicker :v-model="SelectedbyDays" class="input" :label="$t('Start_day')" id="by-dete"
        :placeholder="$t('select_your_Days')" @update:modelValue="setByDateDayes" selectionMode="multiple" />
    </div>

  </div>
</template>
