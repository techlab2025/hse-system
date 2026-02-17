<script setup lang="ts">
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import InspectionTypeSelection from '../InspectionUtils/InspectionTypeSelection.vue';
import PeriodTypeSelect from '../InspectionUtils/PeriodTypeSelect.vue';
import { InspectionTypeEnum } from '../../../Core/Enum/InspectionTypeEnum';
import { PeriodTypeEnum } from '../../../Core/Enum/PeriodTypeEnum';
import TitleInterface from '@/base/Data/Models/title_interface';
import { ref } from 'vue';
import DatePicker from 'primevue/datepicker';
import { watch } from 'vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController';
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams';
import { PeriodicDaysEnum } from '../../../Core/Enum/PeriodicDaysEnum';
import { WithDayEnum } from '../../../Core/Enum/WithDayEnum';

const emit = defineEmits(['update:data', 'change:btn'])

const UpdateData = () => {
  emit('update:data', {
    inspectionType: SelectedInspectionType.value, // once or period
    onceday: SelectedData.value, // date if once
    periodType: SelectedPeriodType.value, // if period type of period
    periodByday: SelectedDay.value, // date if type of period day
    PeridWithDate: SelectedWithDateDays.value, // date if type of period with date
    bydates: SelectedbyDays.value, // date if type of period by date
    fromDate: fromDate.value,
    toDate: null,
    WithDaysType: SelectedWithDaysType.value,
    WithDays: WithDays.value
  })
}


const inspectionType = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'AD-HOC' }),
  new TitleInterface({ id: 2, title: 'Periodic' }),
])
const SelectedInspectionType = ref<InspectionTypeEnum>(InspectionTypeEnum.DAY)
const GetInspectionType = (data: InspectionTypeEnum) => {
  SelectedInspectionType.value = data
  UpdateData()
}

const SelectedDay = ref<TitleInterface[]>()
const DayesSelection = ref<TitleInterface[]>([
  new TitleInterface({ id: PeriodicDaysEnum.SATURDAY, title: 'Saturday' }),
  new TitleInterface({ id: PeriodicDaysEnum.SUNDAY, title: 'Sunday' }),
  new TitleInterface({ id: PeriodicDaysEnum.MONDAY, title: 'Monday' }),
  new TitleInterface({ id: PeriodicDaysEnum.TUESDAY, title: 'Tuesday' }),
  new TitleInterface({ id: PeriodicDaysEnum.WEDNESDAY, title: 'Wednesday' }),
  new TitleInterface({ id: PeriodicDaysEnum.THURSDAY, title: 'Thursday' }),
  new TitleInterface({ id: PeriodicDaysEnum.FRIDAY, title: 'Friday' }),
])


const setDay = (data: TitleInterface[]) => {
  SelectedDay.value = data
  UpdateData()
}

const PeriodTypeSelection = ref<TitleInterface[]>([
  new TitleInterface({ id: PeriodTypeEnum.DAILY, title: 'daily' }),
  new TitleInterface({ id: PeriodTypeEnum.BYDAY, title: 'Choose day' }),
  new TitleInterface({ id: PeriodTypeEnum.WHITDATE, title: 'Choose date' }),
  new TitleInterface({ id: PeriodTypeEnum.BYDATE, title: 'Custom date' }),
  new TitleInterface({ id: PeriodTypeEnum.WITHDAY, title: 'Set Period' }),

])
const SelectedWithDaysType = ref<TitleInterface>(new TitleInterface({ id: 1, title: 'Day' }))

const SelectedPeriodType = ref<TitleInterface>(new TitleInterface({ id: PeriodTypeEnum.DAILY, title: 'daily' }))
const GetSelectedPeridType = (data) => {
  SelectedPeriodType.value = data

  // emit('change:btn')
  UpdateData()
}

const SelectedData = ref(new Date())
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

const WithDays = ref<number>(1)
const setWithDays = (data: number) => {
  WithDays.value = data.target.value
  UpdateData()
}


const resetAll = () => {
  SelectedPeriodType.value = undefined
  SelectedDay.value = []
  SelectedWithDateDays.value = []
  SelectedbyDays.value = []
  WithDays.value = undefined
  fromDate.value = new Date()
  UpdateData()

}

const resetPeriodFields = () => {
  SelectedDay.value = []
  SelectedWithDateDays.value = []
  SelectedbyDays.value = []
  WithDays.value = undefined
  UpdateData()
}

/* ----------------------------------
 * watchers
 * ---------------------------------- */
watch(SelectedInspectionType, () => {
  resetAll()
}, { immediate: true })

watch(SelectedPeriodType, () => {
  resetPeriodFields()
}, { immediate: true })


const WithDaysType = ref<TitleInterface[]>([
  new TitleInterface({ id: WithDayEnum.DAY, title: 'Day' }),
  new TitleInterface({ id: WithDayEnum.WEEK, title: 'Week' }),
  new TitleInterface({ id: WithDayEnum.MONTH, title: 'Month' }),
  new TitleInterface({ id: WithDayEnum.YEAR, title: 'Year' }),
])

const setWithDayesType = (data: TitleInterface) => {
  SelectedWithDaysType.value = data
  UpdateData()
}
</script>

<template>
  <InspectionTypeSelection :selectedtype="SelectedInspectionType" :options="inspectionType" :title="`inspect Period`"
    @update:data="GetInspectionType" />

  <div class="select-time" v-if="SelectedInspectionType && SelectedInspectionType == InspectionTypeEnum.DAY">

    <div class="input-wrapper">
      <label for="">{{ $t('select_day') }}</label>
      <DatePicker v-model="SelectedData" class="input" :label="$t('select day')" id="Day" :placeholder="$t('select your Day')"
        @update:modelValue="UpdateDate" />
    </div>

  </div>
  <div v-else>
    <PeriodTypeSelect :selctedOption="PeriodTypeSelect" :options="PeriodTypeSelection" :title="$t('select period type')"
      @update:data="GetSelectedPeridType" />

    <div class="grid grid-cols-2 gap-2 general-form-container">
      <div class="input-wrapper " v-if="SelectedPeriodType === PeriodTypeEnum.BYDAY">
        <CustomSelectInput :modelValue="SelectedDay" class="input" :static-options="DayesSelection"
          :label="$t('select_days')" id="Day" :placeholder="$t('select_your_Day')" :type="2"
          @update:modelValue="setDay" />
      </div>

      <div class="input-wrapper " v-if="SelectedPeriodType === PeriodTypeEnum.WHITDATE">
        <CustomSelectInput :modelValue="SelectedWithDateDays" class="input" :static-options="WithDateDayesSelection"
          :type="2" :label="$t('select_days')" id="Day" :placeholder="$t('select_your_Day')"
          @update:modelValue="setWithDateDayes" />
      </div>

      <div class="input-wrapper " v-if="SelectedPeriodType === PeriodTypeEnum.BYDATE">
        <label for="by-dete">{{ $t('by_date') }}</label>
        <DatePicker :v-model="SelectedbyDays" class="input" :label="$t('Start_day')" id="by-dete"
          :placeholder="$t('select_your_Days')" @update:modelValue="setByDateDayes" selectionMode="multiple" />
      </div>

      <div class="input-wrapper" v-if="SelectedPeriodType === PeriodTypeEnum.WITHDAY">
        <CustomSelectInput :modelValue="SelectedWithDaysType" class="input" :static-options="WithDaysType"
          :label="$t('with_period_type')" id="period_type" :placeholder="$t('with_period_type')"
          @update:modelValue="setWithDayesType" />
      </div>
      <div class="input-wrapper" v-if="SelectedPeriodType === PeriodTypeEnum.WITHDAY">
        <label for="with-day">{{ $t(`with ${SelectedWithDaysType?.title}`) }}</label>
        <input type="number" min="1" max="31" id="with-day" class="input" :placeholder="$t('every day ...')" v-model="WithDays"
          @change="setWithDays" />
      </div>

      <div class="input-wrapper mt-4">
        <label for="from-dete">{{ $t('from_date') }}</label>
        <DatePicker id="from-dete" class="input" v-if="inspectionType !== InspectionTypeEnum.DAY" v-model="fromDate"
          @update:model-value="UpdateFromDate" :placeholder="$t('select from date...')" />
      </div>
    </div>

  </div>
</template>
