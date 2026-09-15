<script setup lang="ts">
import { computed, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
import AddDrillController from '@/features/Organization/Project/Presentation/controllers/Drill/AddDrillController'
import IndexMeetingTypeController from '@/features/Organization/MeetingType/Presentation/controllers/indexMeetingTypeController'
import IndexMeetingTypeParams from '@/features/Organization/MeetingType/Core/params/indexMeetingTypeParams'
import CreateProjectMeetingParams from '@/features/Organization/Project/Core/params/ProjectMeeting/CreateProjectMeetingParams'
import CreateProjectMeetingController from '../../../controllers/ProjectMeeting/CreateProjectMeetingController'
import { useRouter } from 'vue-router'
import { PeriodicDaysEnum } from '@/features/Organization/Inspection/Core/Enum/PeriodicDaysEnum'
import { MeetingTypePeriodicEnum } from '@/features/Organization/MeetingType/Core/constant/MeetingTypesEnum'
import ProjectMeetingDatesParams from '@/features/Organization/Project/Core/params/ProjectMeeting/ProjectMeetingDatesParams'
import IndexHerikalyParams from '@/features/Organization/Herikaly/Core/params/indexHerikalyParams'
import IndexHerikalyController from '@/features/Organization/Herikaly/Presentation/controllers/indexHerikalyController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import CreateProjectMeetingHierarchyIdParams from '@/features/Organization/Project/Core/params/ProjectMeeting/ProjectMeetingHierarchyIdsParams'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

const props = defineProps<{ projectId: number }>()
const emit = defineEmits<{ (event: 'saved'): void }>()
const router = useRouter()

const MeetingType = ref<TitleInterface | null>(null)
const WeeklyDays = ref<TitleInterface[] | null>(null)
const MonthlyDays = ref<TitleInterface[] | null>(null)
const selectedHieararchy = ref<TitleInterface[] | null>(null)
const selectedEmployee = ref<TitleInterface | null>(null)

const title = ref('')
const NumebrOdDays = ref<number>()
const PeriodicType = ref<number>()

const dates = ref<Date[] | null>(null)

const error = ref('')

const submitting = computed(() => AddDrillController.getInstance().isDataLoading())

// const submit = async () => {
//   error.value = ''
//   if (!MeetingType.value?.id) {
//     error.value = 'Meeting type is Required.'
//     return
//   }
//   const periods = ref<ProjectMeetingDatesParams[]>()
//   switch (PeriodicType.value) {
//     case MeetingTypePeriodicEnum.Weekly:
//       periods.value = WeeklyDays.value?.map((el) => new ProjectMeetingDatesParams({ days: el.id }))
//     case MeetingTypePeriodicEnum.Monthly:
//       periods.value = MonthlyDays.value?.map((el) => new ProjectMeetingDatesParams({ days: el.id }))
//     case MeetingTypePeriodicEnum.yearly:
//       periods.value = dates.value?.map((el) => new ProjectMeetingDatesParams({ days: el.id }))
//   }

//   const params = new CreateProjectMeetingParams({
//     projectId: props.projectId,
//     title: title.value,
//     MeetingTypeId: MeetingType.value.id,
//     dates: periods.value!,
//     hierarchies: Array.isArray(selectedHieararchy.value)
//       ? selectedHieararchy.value?.map(
//           (el) => new CreateProjectMeetingHierarchyIdParams({ hirarchy_id: el.id! }),
//         )
//       : [],
//     TeamLeadrId: selectedEmployee.value?.id!,
//   })
//   const controller = CreateProjectMeetingController.getInstance()
//   await controller.CreateProjectMeeting(params, router)
//   if (controller.isDataSuccess()) emit('saved')
//   else error.value = controller.state.value.error?.title ?? 'Unable to add the drill.'
// }

const submit = async () => {
  error.value = ''

  if (!MeetingType.value?.id) {
    error.value = 'Meeting type is Required.'
    return
  }

  let periods: ProjectMeetingDatesParams[] = []

  switch (PeriodicType.value) {
    case MeetingTypePeriodicEnum.Weekly:
      periods =
        WeeklyDays.value?.map(
          (el) =>
            new ProjectMeetingDatesParams({
              days: Number(el.id),
            }),
        ) ?? []
      break

    case MeetingTypePeriodicEnum.Monthly:
      periods =
        MonthlyDays.value?.map(
          (el) =>
            new ProjectMeetingDatesParams({
              days: Number(el.id),
            }),
        ) ?? []
      break

    case MeetingTypePeriodicEnum.yearly:
      periods =
        dates.value?.map(
          (date) =>
            new ProjectMeetingDatesParams({
              dates: formatJoinDate(date),
            }),
        ) ?? []
      break
  }

  const params = new CreateProjectMeetingParams({
    projectId: props.projectId,
    title: title.value,
    MeetingTypeId: MeetingType.value.id,

    dates: periods,

    hierarchies: Array.isArray(selectedHieararchy.value)
      ? selectedHieararchy.value.map(
          (el) =>
            new CreateProjectMeetingHierarchyIdParams({
              hirarchy_id: el.id!,
            }),
        )
      : [],

    TeamLeadrId: selectedEmployee.value?.id!,
  })

  console.log(params.toMap(), 'REQUEST DATA')

  const controller = CreateProjectMeetingController.getInstance()

  await controller.CreateProjectMeeting(params, router)

  if (controller.isDataSuccess()) {
    emit('saved')
  } else {
    error.value =
      controller.state.value.error?.title ??
      'Unable to add the meeting.'
  }
}

const indexMeetingTypeController = IndexMeetingTypeController.getInstance()
const indexMetingTypeParams = new IndexMeetingTypeParams('', 1, 10, 0)

const UpdateMeetingType = (data: TitleInterface) => {
  MeetingType.value = data
  NumebrOdDays.value = JSON.parse(data?.subtitle!).numberOfDays
  PeriodicType.value = JSON.parse(data.subtitle).periodicType
}

const DayesSelectionOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: PeriodicDaysEnum.SATURDAY, title: 'Saturday' }),
  new TitleInterface({ id: PeriodicDaysEnum.SUNDAY, title: 'Sunday' }),
  new TitleInterface({ id: PeriodicDaysEnum.MONDAY, title: 'Monday' }),
  new TitleInterface({ id: PeriodicDaysEnum.TUESDAY, title: 'Tuesday' }),
  new TitleInterface({ id: PeriodicDaysEnum.WEDNESDAY, title: 'Wednesday' }),
  new TitleInterface({ id: PeriodicDaysEnum.THURSDAY, title: 'Thursday' }),
  new TitleInterface({ id: PeriodicDaysEnum.FRIDAY, title: 'Friday' }),
])

const WithDateDayesSelectionOptions = ref<TitleInterface[]>(
  Array.from(
    { length: 31 },
    (_, i) =>
      new TitleInterface({
        id: `${i + 1}`,
        title: String(i + 1),
      }),
  ),
)

const UpdateWeeklyDays = (data: TitleInterface[]) => {
  WeeklyDays.value = data
}
const UpdateMonthlyDays = (data: TitleInterface[]) => {
  MonthlyDays.value = data
}

const indexHierarchyParams = new IndexHerikalyParams('', 1, 10, 0, undefined, props.projectId)
const indexHerikalyController = IndexHerikalyController.getInstance()

const UpdatePositions = (positions: TitleInterface[]) => {
  selectedHieararchy.value = positions
}

const indexOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams(
  '',
  0,
  1,
  0,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  props.projectId,
)
const indexOrganizationEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const UpdateEmployee = (employee: TitleInterface) => {
  selectedEmployee.value = employee
}
</script>

<template>
  <form class="drill-form" @submit.prevent="submit">
    <div class="drill-form-grid">
      <!-- meeting type -->
      <UpdatedCustomInputSelect
        id="meetingType_id"
        v-model="MeetingType"
        :label="$t('Meeting Type')"
        :placeholder="$t('Select Meeintg type')"
        :controller="indexMeetingTypeController"
        :params="indexMetingTypeParams"
        required
        @update:model-value="UpdateMeetingType"
      />

      <!-- title -->
      <div class="input-wrapper">
        <div class="field-label">
          <label for="title">{{ $t('title') }}</label
          ><FieldHelpIcon text="Record the initial title." />
        </div>
        <input
          type="text"
          id="title"
          v-model="title"
          class="input"
          :placeholder="$t('Enter title')"
        />
      </div>

      <!-- WeeklySelect -->
      <UpdatedCustomInputSelect
        v-if="PeriodicType == MeetingTypePeriodicEnum.Weekly"
        id="weekly_days"
        v-model="WeeklyDays"
        :label="$t('Weekly Days')"
        :placeholder="$t('Select Days')"
        :static-options="DayesSelectionOptions"
        required
        :type="2"
        :max-select-options="NumebrOdDays"
        @update:model-value="UpdateWeeklyDays"
      />

      <!-- Monthly Select -->
      <UpdatedCustomInputSelect
        v-if="PeriodicType == MeetingTypePeriodicEnum.Monthly"
        id="monthly_days"
        v-model="MonthlyDays"
        :label="$t('Monthly Days')"
        :placeholder="$t('Monthly Days')"
        :static-options="WithDateDayesSelectionOptions"
        required
        :type="2"
        :max-select-options="NumebrOdDays"
        @update:model-value="UpdateMonthlyDays"
      />

      <!-- Yearly -->
      <div class="input-wrapper" v-if="PeriodicType == MeetingTypePeriodicEnum.yearly">
        <div class="field-label">
          <label for="drill_date">{{ $t('dates') }}</label
          ><FieldHelpIcon text="Select the dates." />
        </div>
        <DatePicker
          id="drill_date"
          v-model="dates"
          date-format="yy-mm-dd"
          show-icon
          fluid
          selectionMode="multiple"
          :manualInput="false"
          :maxDateCount="NumebrOdDays"
        />
      </div>

      <!-- hierarchys  -->
      <UpdatedCustomInputSelect
        id="hieararchy_id"
        v-model="selectedHieararchy"
        :label="$t('posiotions')"
        :placeholder="$t('Select position')"
        :controller="indexHerikalyController"
        :params="indexHierarchyParams"
        required
        :type="2"
        @update:model-value="UpdatePositions"
      />

      <!-- Employees  -->
      <UpdatedCustomInputSelect
        id="employees_id"
        v-model="selectedEmployee"
        :label="$t('Team Leader')"
        :placeholder="$t('Select Team Leader')"
        :controller="indexOrganizationEmployeeController"
        :params="indexOrganizationEmployeeParams"
        required
        @update:model-value="UpdateEmployee"
      />
    </div>

    <p v-if="error" class="drill-form-error">{{ error }}</p>
    <div class="drill-form-actions">
      <button class="btn btn-primary" type="submit" :disabled="submitting">
        {{ submitting ? $t('Saving...') : $t('Add Meeting') }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.drill-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.drill-form-intro {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-2));
}
.drill-form-intro > span {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 12px;
  color: white;
  background: var(--PrimaryColor);
  font-family: 'Bold';
}
.drill-form-intro strong {
  color: var(--text-strong);
}
.drill-form-intro p {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.75rem;
}
.drill-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}
.full-field,
.drill-serial {
  grid-column: 1 / -1;
}
.input-wrapper textarea {
  min-height: 82px;
  resize: vertical;
}
.drill-serial small {
  color: var(--PrimaryColor);
}
.drill-form-error {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
}
.drill-form-actions {
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 680px) {
  .drill-form-grid {
    grid-template-columns: 1fr;
  }
  .full-field,
  .drill-serial {
    grid-column: auto;
  }
}
</style>
