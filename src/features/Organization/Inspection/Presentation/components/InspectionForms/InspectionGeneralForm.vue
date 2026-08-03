<script setup lang="ts">
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import InspectionTypeSelection from '../InspectionUtils/InspectionTypeSelection.vue'
import PeriodTypeSelect from '../InspectionUtils/PeriodTypeSelect.vue'
import { InspectionTypeEnum } from '../../../Core/Enum/InspectionTypeEnum'
import { PeriodTypeEnum } from '../../../Core/Enum/PeriodTypeEnum'
import TitleInterface from '@/base/Data/Models/title_interface'
import { ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import { watch } from 'vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import { PeriodicDaysEnum } from '../../../Core/Enum/PeriodicDaysEnum'
import { WithDayEnum } from '../../../Core/Enum/WithDayEnum'

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
    WithDays: WithDays.value,
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

const SelectedPeriodType = ref<PeriodTypeEnum | undefined>()
const GetSelectedPeridType = (data: PeriodTypeEnum) => {
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
  Array.from(
    { length: 31 },
    (_, i) =>
      new TitleInterface({
        id: `${i + 1}`,
        title: String(i + 1),
      }),
  ),
)

const setWithDateDayes = (data: TitleInterface[]) => {
  SelectedWithDateDays.value = data
  UpdateData()
}
const fromDate = ref(new Date())
const UpdateFromDate = (date: Date) => {
  fromDate.value = date
  UpdateData()
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
  SelectedPeriodType.value =
    SelectedInspectionType.value === InspectionTypeEnum.PERIOD ? PeriodTypeEnum.DAILY : undefined
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
watch(
  SelectedInspectionType,
  () => {
    resetAll()
  },
  { immediate: true },
)

watch(
  SelectedPeriodType,
  () => {
    resetPeriodFields()
  },
  { immediate: true },
)

const WithDaysType = ref<TitleInterface[]>([
  new TitleInterface({ id: WithDayEnum.Day, title: 'Day' }),
  new TitleInterface({ id: WithDayEnum.Week, title: 'Week' }),
  new TitleInterface({ id: WithDayEnum.Month, title: 'Month' }),
  new TitleInterface({ id: WithDayEnum.Year, title: 'Year' }),
])

const setWithDayesType = (data: TitleInterface) => {
  SelectedWithDaysType.value = data
  UpdateData()
}
</script>

<template>
  <div class="inspection-schedule-form">
    <div class="schedule-heading">
      <span class="schedule-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="4" />
          <path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h7" />
        </svg>
      </span>
      <div>
        <h3>{{ $t('Inspection schedule') }}</h3>
        <p>{{ $t('Choose when this inspection should run and how often it repeats') }}</p>
      </div>
    </div>

    <InspectionTypeSelection
      class="frequency-selector"
      :selectedtype="SelectedInspectionType"
      :options="inspectionType"
      :title="$t('inspection frequency')"
      @update:data="GetInspectionType"
    />

    <div
      v-if="SelectedInspectionType && SelectedInspectionType == InspectionTypeEnum.DAY"
      class="schedule-mode-panel schedule-once"
    >
      <div class="mode-copy">
        <span>{{ $t('One-time inspection') }}</span>
        <p>{{ $t('Choose the exact date for this inspection') }}</p>
      </div>
      <div class="input-wrapper date-field">
        <label for="inspection-day">{{ $t('select_day') }}</label>
        <DatePicker
          id="inspection-day"
          v-model="SelectedData"
          class="input"
          :label="$t('select day')"
          :placeholder="$t('select your Day')"
          @update:modelValue="UpdateDate"
        />
      </div>
    </div>

    <div v-else class="schedule-mode-panel periodic-schedule">
      <PeriodTypeSelect
        class="period-selector"
        :selctedOption="SelectedPeriodType"
        :options="PeriodTypeSelection"
        :title="$t('select period type')"
        @update:data="GetSelectedPeridType"
      />

      <div class="general-form-container">
        <div
          class="input-wrapper schedule-field"
          v-if="SelectedPeriodType === PeriodTypeEnum.BYDAY"
        >
          <CustomSelectInput
            :modelValue="SelectedDay"
            class="input"
            :static-options="DayesSelection"
            :label="$t('select_days')"
            id="Day"
            :placeholder="$t('select_your_Day')"
            :type="2"
            @update:modelValue="setDay"
          />
        </div>

        <div
          class="input-wrapper schedule-field"
          v-if="SelectedPeriodType === PeriodTypeEnum.WHITDATE"
        >
          <CustomSelectInput
            :modelValue="SelectedWithDateDays"
            class="input"
            :static-options="WithDateDayesSelection"
            :type="2"
            :label="$t('select_days')"
            id="month-day"
            :placeholder="$t('select_your_Day')"
            @update:modelValue="setWithDateDayes"
          />
        </div>

        <div
          class="input-wrapper schedule-field"
          v-if="SelectedPeriodType === PeriodTypeEnum.BYDATE"
        >
          <label for="by-date">{{ $t('by_date') }}</label>
          <DatePicker
            id="by-date"
            v-model="SelectedbyDays"
            class="input"
            :label="$t('Start_day')"
            :placeholder="$t('select_your_Days')"
            @update:modelValue="setByDateDayes"
            selectionMode="multiple"
          />
        </div>

        <div
          class="input-wrapper schedule-field"
          v-if="SelectedPeriodType === PeriodTypeEnum.WITHDAY"
        >
          <CustomSelectInput
            :modelValue="SelectedWithDaysType"
            class="input"
            :static-options="WithDaysType"
            :label="$t('with_period_type')"
            id="period_type"
            :placeholder="$t('with_period_type')"
            @update:modelValue="setWithDayesType"
          />
        </div>
        <div
          class="input-wrapper schedule-field"
          v-if="SelectedPeriodType === PeriodTypeEnum.WITHDAY"
        >
          <label for="with-day">{{ $t(`with ${SelectedWithDaysType?.title}`) }}</label>
          <input
            id="with-day"
            v-model="WithDays"
            type="number"
            min="1"
            max="31"
            class="input"
            :placeholder="$t('every day ...')"
            @change="setWithDays"
          />
        </div>

        <div class="input-wrapper schedule-field start-date-field">
          <label for="from-date">{{ $t('from_date') }}</label>
          <DatePicker
            id="from-date"
            v-model="fromDate"
            class="input"
            @update:model-value="UpdateFromDate"
            :placeholder="$t('select from date...')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inspection-schedule-form {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
}

.schedule-heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.schedule-heading > div {
  min-width: 0;
}

.schedule-icon {
  display: inline-flex;
  width: 2.65rem;
  height: 2.65rem;
  flex: 0 0 2.65rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--status-success) 22%, transparent);
  border-radius: 0.85rem;
  background: var(--status-success-soft);
  color: var(--status-success);
}

.schedule-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.schedule-heading h3 {
  margin: 0 0 0.15rem;
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: 1rem;
}

.schedule-heading p,
.mode-copy p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8rem;
  line-height: 1.4;
}

.frequency-selector :deep(.inspection-type-container),
.period-selector :deep(.period-type-container) {
  gap: 0.7rem;
  border: 1px solid var(--main-border);
  border-radius: 1rem;
  background: var(--surface-1);
  padding: 0.85rem;
}

.frequency-selector :deep(.inspection-header),
.period-selector :deep(.period-header) {
  margin-bottom: 0.65rem;
}

.frequency-selector :deep(.title),
.period-selector :deep(.title) {
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: 0.88rem;
}

.frequency-selector :deep(.inspection-type-contect) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
}

.period-selector :deep(.period-type-contect) {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
}

.frequency-selector :deep(.option),
.period-selector :deep(.option) {
  position: relative;
  min-width: 0;
  border: 1px solid var(--main-border);
  border-radius: 0.8rem;
  background: var(--surface-2);
  padding: 0.65rem 0.55rem;
  text-align: center;
  transition: 0.2s ease;
}

.frequency-selector :deep(.option:hover),
.period-selector :deep(.option:hover) {
  border-color: color-mix(in srgb, var(--brand-primary-500) 32%, var(--main-border));
  transform: translateY(-1px);
}

.frequency-selector :deep(.option.active),
.period-selector :deep(.option.active) {
  border-color: color-mix(in srgb, var(--brand-primary-500) 45%, transparent);
  background: var(--brand-primary-50);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.frequency-selector :deep(.option label),
.period-selector :deep(.option label) {
  display: block;
  width: 100%;
  color: var(--text-soft) !important;
  font-size: 0.78rem !important;
  cursor: pointer;
  white-space: normal;
}

.frequency-selector :deep(.option.active label),
.period-selector :deep(.option.active label) {
  color: var(--brand-primary-600) !important;
}

.frequency-selector :deep(.option input),
.period-selector :deep(.option input) {
  display: none;
}

.schedule-mode-panel {
  min-width: 0;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 11%, var(--main-border));
  border-radius: 1rem;
  background: linear-gradient(145deg, var(--surface-1), var(--surface-2));
  padding: 0.9rem;
}

.schedule-once {
  display: grid;
  grid-template-columns:1fr;
  align-items: center;
  gap: 1rem;
}

.mode-copy span {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--text-strong);
  font-family: 'Bold', sans-serif;
  font-size: 0.88rem;
}

.date-field {
  border-inline-start: 1px solid var(--main-border);
  padding-inline-start: 1rem;
}

.general-form-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 0.8rem;
}

.schedule-field {
  min-width: 0;
  border: 1px solid var(--main-border);
  border-radius: 0.85rem;
  background: var(--surface-1);
  padding: 0.8rem;
}

.start-date-field:only-child,
.start-date-field:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.inspection-schedule-form :deep(.p-datepicker),
.inspection-schedule-form :deep(.p-inputtext),
.inspection-schedule-form :deep(.custom-select) {
  width: 100%;
  min-width: 0;
}

@media (max-width: 900px) {
  .period-selector :deep(.period-type-contect) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .schedule-once,
  .general-form-container,
  .frequency-selector :deep(.inspection-type-contect),
  .period-selector :deep(.period-type-contect) {
    grid-template-columns: 1fr;
  }

  .date-field {
    border-top: 1px solid var(--main-border);
    border-inline-start: 0;
    padding-top: 0.8rem;
    padding-inline-start: 0;
  }

  .start-date-field:last-child:nth-child(odd) {
    grid-column: auto;
  }
}
</style>
