<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import Dialog from 'primevue/dialog'
import DatePicker from 'primevue/datepicker'

import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'

import type ProjectMeetingModel from '@/features/Organization/Project/Data/models/ProjectMeeting/ProjectMeetingModel'

import CreateProjectMeetingResultParams from '@/features/Organization/Project/Core/params/ProjectMeeting/CreateProjectMeetingResultParams'

import CreateProjectMeetingActionsParams from '@/features/Organization/Project/Core/params/ProjectMeeting/ProjectMeetingActionsParams'

import { ProjectMeetingActionsTypeEnum } from '@/features/Organization/Project/Core/params/ProjectMeeting/enums/ProjectMeetingActionEnum'

import CreateProjectMeetingResultController from '@/features/Organization/Project/Presentation/controllers/ProjectMeeting/CreateProjectMeetingResultController'

import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'

import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import FetchProjectMeetingResultController from '../../../controllers/ProjectMeeting/FetchProjectMeetingResultController'
import FetchMeetingDetailsParams from '@/features/Organization/Project/Core/params/ProjectMeeting/FetchMeetingDetailsParams'

// -----------------------------------------------------------------------------
// Props / Emits
// -----------------------------------------------------------------------------

const props = defineProps<{
  meeting: ProjectMeetingModel
  projectId: number
}>()

const emit = defineEmits<{
  (event: 'opened'): void
  (event: 'saved'): void
}>()

const router = useRouter()

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

const createProjectMeetingResultController = CreateProjectMeetingResultController.getInstance()

const submitting = computed(() => createProjectMeetingResultController.isDataLoading())

// -----------------------------------------------------------------------------
// Dialog
// -----------------------------------------------------------------------------

const AddResultDialogvisible = ref(false)
const ShowResultDialogvisible = ref(false)

const openAddResultDialog = () => {
  AddResultDialogvisible.value = true
  error.value = ''

  emit('opened')
}

const closeAddResultDialog = () => {
  AddResultDialogvisible.value = false
}

const openShowResultDialog = () => {
  ShowResultDialogvisible.value = true
  error.value = ''

  emit('opened')
}

const closeShowResultDialog = () => {
  ShowResultDialogvisible.value = false
}

// -----------------------------------------------------------------------------
// Agenda
// -----------------------------------------------------------------------------

const agenda = ref<string[]>([''])

const addAgenda = () => {
  agenda.value.push('')
}

const removeAgenda = (index: number) => {
  agenda.value.splice(index, 1)

  if (!agenda.value.length) {
    agenda.value.push('')
  }
}

// -----------------------------------------------------------------------------
// Action type options
// -----------------------------------------------------------------------------

const ActionTypeSelectionOptions = ref<TitleInterface[]>([
  new TitleInterface({
    id: ProjectMeetingActionsTypeEnum.ONGOING,
    title: 'Ongoing',
  }),

  new TitleInterface({
    id: ProjectMeetingActionsTypeEnum.INFO,
    title: 'Info',
  }),

  new TitleInterface({
    id: ProjectMeetingActionsTypeEnum.TASK,
    title: 'Task',
  }),
])

// -----------------------------------------------------------------------------
// Employee
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Meeting action form
// -----------------------------------------------------------------------------

interface MeetingActionForm {
  type: TitleInterface | null
  title: string
  dueDate: Date | null
  dueTime: string
  employee: TitleInterface | null
}

const createEmptyAction = (): MeetingActionForm => ({
  type: null,
  title: '',
  dueDate: null,
  dueTime: '',
  employee: null,
})

const meetingActions = ref<MeetingActionForm[]>([createEmptyAction()])

const addAction = () => {
  meetingActions.value.push(createEmptyAction())
}

const removeAction = (index: number) => {
  meetingActions.value.splice(index, 1)

  if (!meetingActions.value.length) {
    meetingActions.value.push(createEmptyAction())
  }
}

// -----------------------------------------------------------------------------
// Action helpers
// -----------------------------------------------------------------------------

const getActionType = (action: MeetingActionForm): ProjectMeetingActionsTypeEnum | null => {
  if (!action.type?.id) {
    return null
  }

  return Number(action.type.id) as ProjectMeetingActionsTypeEnum
}

const isOngoing = (action: MeetingActionForm): boolean => {
  return getActionType(action) === ProjectMeetingActionsTypeEnum.ONGOING
}

const isInfo = (action: MeetingActionForm): boolean => {
  return getActionType(action) === ProjectMeetingActionsTypeEnum.INFO
}

const isTask = (action: MeetingActionForm): boolean => {
  return getActionType(action) === ProjectMeetingActionsTypeEnum.TASK
}

/*
 * Ongoing:
 *   title
 *
 * Task:
 *   title
 *   date
 *   time
 *   employee
 *
 * Info:
 *   only type
 */
const showTitle = (action: MeetingActionForm): boolean => {
  return isOngoing(action) || isTask(action) || isInfo(action)
}

// -----------------------------------------------------------------------------
// Selection updates
// -----------------------------------------------------------------------------

const UpdateActionType = (index: number, value: TitleInterface | TitleInterface[] | null) => {
  if (Array.isArray(value)) {
    return
  }

  const action = meetingActions.value[index]

  if (!action) {
    return
  }

  action.type = value

  const type = getActionType(action)

  /*
   * INFO does not need any other fields.
   */
  if (type === ProjectMeetingActionsTypeEnum.INFO) {
    action.title = ''
    action.dueDate = null
    action.dueTime = ''
    action.employee = null

    return
  }

  /*
   * ONGOING needs title only.
   */
  if (type === ProjectMeetingActionsTypeEnum.ONGOING) {
    action.dueDate = null
    action.dueTime = ''
    action.employee = null
  }
}

const UpdateEmployee = (index: number, value: TitleInterface | TitleInterface[] | null) => {
  if (Array.isArray(value)) {
    return
  }

  const action = meetingActions.value[index]

  if (!action) {
    return
  }

  action.employee = value
}

// -----------------------------------------------------------------------------
// Date formatting
// -----------------------------------------------------------------------------

const formatDate = (date: Date): string => {
  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, '0')

  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

const error = ref('')

const validate = (): boolean => {
  error.value = ''

  /*
   * Remove empty agenda items before checking.
   */
  const validAgenda = agenda.value.filter((item) => item.trim().length > 0)

  if (!validAgenda.length) {
    error.value = 'Please add at least one agenda item.'

    return false
  }

  for (let index = 0; index < meetingActions.value.length; index++) {
    const action = meetingActions.value[index]

    if (!action) {
      continue
    }

    const type = getActionType(action)

    if (!type) {
      error.value = `Please select action type for action ${index + 1}.`

      return false
    }

    /*
     * Ongoing and Task require title.
     */
    if (
      (type === ProjectMeetingActionsTypeEnum.ONGOING ||
        type === ProjectMeetingActionsTypeEnum.TASK) &&
      !action.title.trim()
    ) {
      error.value = `Please enter title for action ${index + 1}.`

      return false
    }

    /*
     * Task requires additional fields.
     */
    if (type === ProjectMeetingActionsTypeEnum.TASK) {
      if (!action.dueDate) {
        error.value = `Please select due date for task ${index + 1}.`

        return false
      }

      if (!action.dueTime) {
        error.value = `Please select due time for task ${index + 1}.`

        return false
      }

      if (!action.employee?.id) {
        error.value = `Please select employee for task ${index + 1}.`

        return false
      }
    }
  }

  return true
}

// -----------------------------------------------------------------------------
// Submit
// -----------------------------------------------------------------------------

const submit = async () => {
  if (!validate()) {
    return
  }

  error.value = ''

  const preparedAgenda = agenda.value.map((item) => item.trim()).filter(Boolean)

  const preparedActions = meetingActions.value.map((action) => {
    const type = getActionType(action)!

    return new CreateProjectMeetingActionsParams({
      type,

      /*
       * INFO does not display a title,
       * so send an empty string.
       */
      title: showTitle(action) ? action.title.trim() : '',

      /*
       * Only TASK uses date/time/employee.
       */
      dueDate: isTask(action) && action.dueDate ? formatDate(action.dueDate) : '',

      dueTime: isTask(action) ? action.dueTime : '',

      assignedOrganizationEmployeeId: isTask(action) ? Number(action.employee?.id) : 0,
    })
  })

  const params = new CreateProjectMeetingResultParams({
    projectId: props.projectId,

    MeetingId: props.meeting.id,

    agenda: preparedAgenda,

    meetingActions: preparedActions,
  })

  console.log(params.toMap(), 'MEETING RESULT REQUEST')

  await createProjectMeetingResultController.CreateProjectMeetingResult(params, router)

  if (createProjectMeetingResultController.isDataSuccess()) {
    AddResultDialogvisible.value = false

    resetForm()

    emit('saved')

    return
  }

  error.value =
    createProjectMeetingResultController.state.value.error?.title ??
    'Unable to save meeting result.'
}

// -----------------------------------------------------------------------------
// Reset
// -----------------------------------------------------------------------------

const resetForm = () => {
  agenda.value = ['']

  meetingActions.value = [createEmptyAction()]

  error.value = ''
}

const fetchProjectMeetingResultController = FetchProjectMeetingResultController.getInstance()
const MeetingDetailsState = computed(() => fetchProjectMeetingResultController.state.value)

const FetchMeetingDetails = async () => {
  const fetchProjectMeetingResultParams = new FetchMeetingDetailsParams({
    id: props.meeting.id,
  })
  await fetchProjectMeetingResultController.FetchProjectMeetingResult(
    fetchProjectMeetingResultParams,
    router,
  )
}

watch(
  () => ShowResultDialogvisible.value,
  (newval) => {
    if (newval) {
      FetchMeetingDetails()
    }
  },
)

const meetingResult = computed(() => MeetingDetailsState.value?.data ?? null)

const getActionTypeLabel = (type: number) => {
  switch (Number(type)) {
    case ProjectMeetingActionsTypeEnum.ONGOING:
      return 'Ongoing'

    case ProjectMeetingActionsTypeEnum.INFO:
      return 'Info'

    case ProjectMeetingActionsTypeEnum.TASK:
      return 'Task'

    default:
      return 'Unknown'
  }
}

const getActionTypeClass = (type: number) => {
  switch (Number(type)) {
    case ProjectMeetingActionsTypeEnum.ONGOING:
      return 'action-type-ongoing'

    case ProjectMeetingActionsTypeEnum.INFO:
      return 'action-type-info'

    case ProjectMeetingActionsTypeEnum.TASK:
      return 'action-type-task'

    default:
      return ''
  }
}

const formatMeetingTime = (time?: string | null) => {
  if (!time) return '—'

  return time.substring(0, 5)
}

const getEmployeeName = (employee: any) => {
  if (!employee) return '—'

  return employee.name || employee.title || '—'
}
</script>

<template>
  <!-- Meeting Card -->
  <!-- {{ MeetingDetailsState }} -->
  <button
    class="meeting-card"
    type="button"
    @click="meeting.hasResult ? openShowResultDialog() : openAddResultDialog()"
  >
    <span class="meeting-card-accent" />

    <span class="meeting-card-main">
      <span class="meeting-card-kicker"> date : {{ meeting.date || $t('Meeting') }} </span>

      <strong>
        {{ meeting.serialName }}
      </strong>

      <small v-if="meeting.teamLeader.name">
        Team Leader : {{ meeting.teamLeader.name || '—' }}
      </small>
      <small v-if="meeting.hasResult"> show meeting result </small>
    </span>

    <span class="meeting-card-arrow"> → </span>
  </button>

  <!-- Meeting Result Dialog -->
  <Dialog
    v-model:visible="AddResultDialogvisible"
    modal
    dismissable-mask
    :style="{
      width: 'min(70rem, calc(100vw - 24px))',
    }"
    @hide="error = ''"
  >
    <!-- Header -->
    <template #header>
      <div class="meeting-result-header">
        <div class="meeting-result-header-icon">MR</div>

        <div>
          <small>
            {{ $t('Meeting Result') }}
          </small>

          <h2>
            {{ meeting.title || `Meeting #${meeting.serialName}` }}
          </h2>

          <p>
            {{ meeting.date || '—' }}
          </p>
        </div>
      </div>
    </template>

    <form class="meeting-result-form" @submit.prevent="submit">
      <!-- ============================================================= -->
      <!-- Agenda -->
      <!-- ============================================================= -->

      <section class="form-section">
        <div class="section-header">
          <div>
            <h3>
              {{ $t('Agenda') }}
            </h3>

            <p>
              {{ $t('Add meeting agenda items') }}
            </p>
          </div>

          <button type="button" class="add-button" @click="addAgenda">
            + {{ $t('Add Agenda') }}
          </button>
        </div>

        <div class="agenda-list">
          <div v-for="(item, index) in agenda" :key="`agenda-${index}`" class="agenda-item">
            <span class="item-number">
              {{ index + 1 }}
            </span>

            <input
              v-model="agenda[index]"
              type="text"
              class="input"
              :placeholder="$t('Enter agenda item')"
            />

            <button
              v-if="agenda.length > 1"
              type="button"
              class="remove-button"
              @click="removeAgenda(index)"
            >
              ×
            </button>
          </div>
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- Meeting Actions -->
      <!-- ============================================================= -->

      <section class="form-section">
        <div class="section-header">
          <div>
            <h3>
              {{ $t('Meeting Actions') }}
            </h3>

            <p>
              {{ $t('Add meeting actions and tasks') }}
            </p>
          </div>

          <button type="button" class="add-button" @click="addAction">
            + {{ $t('Add Action') }}
          </button>
        </div>

        <div class="actions-list">
          <article
            v-for="(action, index) in meetingActions"
            :key="`action-${index}`"
            class="action-card"
          >
            <!-- Action heading -->
            <div class="action-card-header">
              <div>
                <span class="action-number">
                  {{ index + 1 }}
                </span>

                <strong>
                  {{ $t('Action') }}
                  {{ index + 1 }}
                </strong>
              </div>

              <button
                v-if="meetingActions.length > 1"
                type="button"
                class="remove-action"
                @click="removeAction(index)"
              >
                {{ $t('Remove') }}
              </button>
            </div>

            <div class="action-form-grid">
              <!-- Action Type -->
              <UpdatedCustomInputSelect
                :id="`action_type_${index}`"
                v-model="action.type"
                :label="$t('Action Type')"
                :placeholder="$t('Select Action Type')"
                :static-options="ActionTypeSelectionOptions"
                required
                @update:model-value="UpdateActionType(index, $event)"
              />

              <!-- Title -->
              <div v-if="showTitle(action)" class="input-wrapper">
                <label :for="`action_title_${index}`" class="field-label">
                  {{ $t('title') }}

                  <span class="required-star"> * </span>
                </label>

                <input
                  :id="`action_title_${index}`"
                  v-model="action.title"
                  type="text"
                  class="input"
                  :placeholder="$t('Enter action title')"
                />
              </div>

              <!-- Task Due Date -->
              <div v-if="isTask(action)" class="input-wrapper">
                <label :for="`due_date_${index}`" class="field-label">
                  {{ $t('Due Date') }}

                  <span class="required-star"> * </span>
                </label>

                <DatePicker
                  :id="`due_date_${index}`"
                  v-model="action.dueDate"
                  date-format="yy-mm-dd"
                  show-icon
                  fluid
                  :manual-input="false"
                  :placeholder="$t('Select Due Date')"
                />
              </div>

              <!-- Task Due Time -->
              <div v-if="isTask(action)" class="input-wrapper">
                <label :for="`due_time_${index}`" class="field-label">
                  {{ $t('Due Time') }}

                  <span class="required-star"> * </span>
                </label>

                <input
                  :id="`due_time_${index}`"
                  v-model="action.dueTime"
                  type="time"
                  class="input"
                />
              </div>

              <!-- Task Employee -->
              <UpdatedCustomInputSelect
                v-if="isTask(action)"
                :id="`employee_${index}`"
                v-model="action.employee"
                :label="$t('Assigned Employee')"
                :placeholder="$t('Select Employee')"
                :controller="indexOrganizationEmployeeController"
                :params="indexOrganizationEmployeeParams"
                required
                @update:model-value="UpdateEmployee(index, $event)"
              />

              <!-- INFO note -->
              <!-- <div v-if="isInfo(action)" class="info-message">
                {{ $t('Information action does not require additional details.') }}
              </div> -->
            </div>
          </article>
        </div>
      </section>

      <!-- Error -->
      <p v-if="error" class="form-error">
        {{ error }}
      </p>

      <!-- Actions -->
      <div class="form-actions">
        <button
          type="button"
          class="btn-secondary"
          :disabled="submitting"
          @click="closeAddResultDialog"
        >
          {{ $t('Cancel') }}
        </button>

        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? $t('Saving...') : $t('Save Meeting Result') }}
        </button>
      </div>
    </form>
  </Dialog>

  <!-- Meeting Show Result Dialog -->
  <Dialog
    v-model:visible="ShowResultDialogvisible"
    modal
    dismissable-mask
    class="meeting-show-dialog"
    :style="{
      width: 'min(70rem, calc(100vw - 24px))',
    }"
  >
    <!-- Header -->
    <template #header>
      <div class="meeting-show-header">
        <div class="meeting-show-header-icon">MR</div>

        <div class="meeting-show-header-content">
          <small>
            {{ $t('Meeting Result') }}
          </small>

          <h2>
            {{ meetingResult?.serialName || `Meeting #${meetingResult?.meetingId || meeting.id}` }}
          </h2>

          <p>
            {{ meetingResult?.date || meeting.date || '—' }}
          </p>
        </div>
      </div>
    </template>

    <!-- ============================================================= -->
    <!-- Result -->
    <!-- ============================================================= -->

    <div v-if="meetingResult" class="meeting-show-content">
      <!-- ============================================================= -->
      <!-- Meeting Information -->
      <!-- ============================================================= -->

      <section class="meeting-show-section">
        <div class="meeting-show-section-header">
          <div>
            <h3>
              {{ $t('Meeting Information') }}
            </h3>

            <p>
              {{ $t('General meeting details') }}
            </p>
          </div>
        </div>

        <div class="meeting-info-grid">
          <!-- Date -->
          <div class="meeting-info-card">
            <span class="meeting-info-label">
              {{ $t('Date') }}
            </span>

            <strong>
              {{ meetingResult.date || '—' }}
            </strong>
          </div>

          <!-- Time -->
          <div class="meeting-info-card">
            <span class="meeting-info-label">
              {{ $t('Time') }}
            </span>

            <strong>
              {{ formatMeetingTime(meetingResult.time) }}
            </strong>
          </div>

          <!-- Team Leader -->
          <div class="meeting-info-card">
            <span class="meeting-info-label">
              {{ $t('Team Leader') }}
            </span>

            <strong>
              {{ meetingResult.teamLeader?.name || meetingResult.teamLeader?.title || '—' }}
            </strong>
          </div>

          <!-- Serial -->
          <div class="meeting-info-card">
            <span class="meeting-info-label">
              {{ $t('Serial') }}
            </span>

            <strong>
              {{ meetingResult.serialName || '—' }}
            </strong>
          </div>
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- Hierarchies -->
      <!-- ============================================================= -->

      <section class="meeting-show-section">
        <div class="meeting-show-section-header">
          <div>
            <h3>
              {{ $t('Hierarchies') }}
            </h3>

            <p>
              {{ $t('Meeting related positions') }}
            </p>
          </div>

          <span class="meeting-count-badge">
            {{ meetingResult.hierarchies?.length || 0 }}
          </span>
        </div>

        <div v-if="meetingResult.hierarchies?.length" class="meeting-hierarchy-list">
          <div
            v-for="hierarchy in meetingResult.hierarchies"
            :key="hierarchy.id"
            class="meeting-hierarchy-chip"
          >
            <span class="hierarchy-dot" />

            {{ hierarchy.title }}
          </div>
        </div>

        <div v-else class="meeting-empty-state">
          {{ $t('No hierarchies available') }}
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- Agenda -->
      <!-- ============================================================= -->

      <section class="meeting-show-section">
        <div class="meeting-show-section-header">
          <div>
            <h3>
              {{ $t('Agenda') }}
            </h3>

            <p>
              {{ $t('Meeting agenda items') }}
            </p>
          </div>

          <span class="meeting-count-badge">
            {{ meetingResult.meetingAgenda?.length || 0 }}
          </span>
        </div>

        <div v-if="meetingResult.meetingAgenda?.length" class="meeting-show-agenda-list">
          <div
            v-for="(agendaItem, index) in meetingResult.meetingAgenda"
            :key="agendaItem.id"
            class="meeting-show-agenda-item"
          >
            <span class="meeting-show-number">
              {{ index + 1 }}
            </span>

            <div class="meeting-show-agenda-text">
              {{ agendaItem.text || '—' }}
            </div>
          </div>
        </div>

        <div v-else class="meeting-empty-state">
          {{ $t('No agenda available') }}
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- Meeting Actions -->
      <!-- ============================================================= -->

      <section class="meeting-show-section">
        <div class="meeting-show-section-header">
          <div>
            <h3>
              {{ $t('Meeting Actions') }}
            </h3>

            <p>
              {{ $t('Actions created from this meeting') }}
            </p>
          </div>

          <span class="meeting-count-badge">
            {{ meetingResult.MeetingActions?.length || 0 }}
          </span>
        </div>

        <div v-if="meetingResult.MeetingActions?.length" class="meeting-show-actions-list">
          <article
            v-for="(action, index) in meetingResult.MeetingActions"
            :key="action.id"
            class="meeting-show-action-card"
          >
            <!-- Action Header -->
            <div class="meeting-show-action-header">
              <div class="meeting-show-action-title">
                <span class="meeting-show-action-number">
                  {{ index + 1 }}
                </span>

                <div>
                  <small> {{ $t('Action') }} {{ index + 1 }} </small>

                  <h4>
                    {{ action.title || getActionTypeLabel(action.type) }}
                  </h4>
                </div>
              </div>

              <span class="meeting-action-type" :class="getActionTypeClass(action.type)">
                {{ getActionTypeLabel(action.type) }}
              </span>
            </div>

            <!-- Action Details -->
            <div class="meeting-show-action-details">
              <!-- Title -->
              <div v-if="action.title" class="meeting-action-detail">
                <span>
                  {{ $t('Title') }}
                </span>

                <strong>
                  {{ action.title }}
                </strong>
              </div>

              <!-- Due Date -->
              <div
                v-if="Number(action.type) === ProjectMeetingActionsTypeEnum.TASK"
                class="meeting-action-detail"
              >
                <span>
                  {{ $t('Due Date') }}
                </span>

                <strong>
                  {{ action.dueDate || '—' }}
                </strong>
              </div>

              <!-- Due Time -->
              <div
                v-if="Number(action.type) === ProjectMeetingActionsTypeEnum.TASK"
                class="meeting-action-detail"
              >
                <span>
                  {{ $t('Due Time') }}
                </span>

                <strong>
                  {{ formatMeetingTime(action.dueTime) }}
                </strong>
              </div>

              <!-- Employee -->
              <div
                v-if="Number(action.type) === ProjectMeetingActionsTypeEnum.TASK"
                class="meeting-action-detail"
              >
                <span>
                  {{ $t('Assigned Employee') }}
                </span>

                <strong>
                  {{ getEmployeeName(action.assignedEmployee) }}
                </strong>
              </div>

              <!-- Created At -->
              <div v-if="action.createdAt" class="meeting-action-detail">
                <span>
                  {{ $t('Created At') }}
                </span>

                <strong>
                  {{ action.createdAt }}
                </strong>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="meeting-empty-state">
          {{ $t('No meeting actions available') }}
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- Content -->
      <!-- ============================================================= -->

      <section v-if="meetingResult.content" class="meeting-show-section">
        <div class="meeting-show-section-header">
          <div>
            <h3>
              {{ $t('Meeting Content') }}
            </h3>
          </div>
        </div>

        <div class="meeting-content-box">
          {{ meetingResult.content }}
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- Footer -->
      <!-- ============================================================= -->

      <div class="meeting-show-footer">
        <button type="button" class="meeting-show-close-button" @click="closeShowResultDialog">
          {{ $t('Close') }}
        </button>
      </div>
    </div>

    <!-- No Data -->
    <div v-else class="meeting-show-no-data">
      <div class="meeting-show-no-data-icon">MR</div>

      <strong>
        {{ $t('Meeting result not available') }}
      </strong>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
/* ==========================================================================
   Meeting Card
   ========================================================================== */

.meeting-card {
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: 5px 1fr auto;
  align-items: center;
  gap: 13px;
  overflow: hidden;
  padding: 13px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  text-align: start;
  cursor: pointer;
  background: var(--surface-2);

  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.meeting-card:hover {
  transform: translateY(-2px);

  border-color: color-mix(in srgb, var(--PrimaryColor) 45%, var(--main-border));

  box-shadow: 0 12px 28px color-mix(in srgb, var(--brand-primary-900) 9%, transparent);
}

.meeting-card-accent {
  align-self: stretch;
  border-radius: 9px;

  background: linear-gradient(var(--PrimaryColor), var(--brand-primary-700));
}

.meeting-card-main {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.meeting-card-kicker {
  overflow: hidden;

  color: var(--PrimaryColor);

  font-size: 0.68rem;
  font-weight: 900;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.meeting-card-main strong {
  margin-top: 3px;

  color: var(--text-strong);
}

.meeting-card-main small {
  margin-top: 3px;

  color: var(--text-soft);
}

.meeting-card-arrow {
  color: var(--PrimaryColor);

  font-size: 1.2rem;
}

/* ==========================================================================
   Dialog Header
   ========================================================================== */

.meeting-result-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meeting-result-header-icon {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  place-items: center;

  border-radius: 15px;

  color: white;

  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));

  font-family: 'Bold';
}

.meeting-result-header small {
  color: var(--PrimaryColor);

  font-weight: 900;
  text-transform: uppercase;
}

.meeting-result-header h2 {
  margin: 2px 0;

  color: var(--text-strong);

  font-size: 1rem;
}

.meeting-result-header p {
  margin: 0;

  color: var(--text-soft);

  font-size: 0.75rem;
}

/* ==========================================================================
   Form
   ========================================================================== */

.meeting-result-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  padding: 16px;

  border: 1px solid var(--main-border);
  border-radius: 16px;

  background: var(--surface-2);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;

  color: var(--text-strong);

  font-size: 0.9rem;
}

.section-header p {
  margin: 4px 0 0;

  color: var(--text-soft);

  font-size: 0.7rem;
}

.add-button {
  flex: 0 0 auto;

  padding: 8px 12px;

  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 35%, var(--main-border));

  border-radius: 10px;

  color: var(--PrimaryColor);

  cursor: pointer;

  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-2));

  font-weight: 700;
}

/* ==========================================================================
   Agenda
   ========================================================================== */

.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agenda-item {
  display: grid;
  grid-template-columns: 32px 1fr 36px;
  align-items: center;
  gap: 10px;
}

.item-number {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;

  border-radius: 9px;

  color: var(--PrimaryColor);

  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);

  font-size: 0.7rem;
  font-weight: 900;
}

.remove-button {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;

  border: 0;
  border-radius: 9px;

  color: var(--status-danger);

  cursor: pointer;

  background: color-mix(in srgb, var(--status-danger) 8%, transparent);

  font-size: 1.2rem;
}

/* ==========================================================================
   Actions
   ========================================================================== */

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-card {
  padding: 15px;

  border: 1px solid var(--main-border);
  border-radius: 14px;

  background: var(--surface-1);
}

.action-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  margin-bottom: 15px;
}

.action-card-header > div {
  display: flex;
  align-items: center;
  gap: 9px;
}

.action-number {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;

  border-radius: 9px;

  color: white;

  background: var(--PrimaryColor);

  font-size: 0.7rem;
  font-weight: 900;
}

.action-card-header strong {
  color: var(--text-strong);

  font-size: 0.8rem;
}

.remove-action {
  padding: 6px 10px;

  border: 0;
  border-radius: 8px;

  color: var(--status-danger);

  cursor: pointer;

  background: color-mix(in srgb, var(--status-danger) 8%, transparent);

  font-size: 0.68rem;
}

.action-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 15px;
}

/* ==========================================================================
   Inputs
   ========================================================================== */

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-label {
  color: var(--text-strong);

  font-size: 0.75rem;
  font-weight: 700;
}

.required-star {
  color: var(--status-danger);
}

.input {
  width: 100%;
  min-height: 42px;

  padding: 9px 12px;

  border: 1px solid var(--main-border);
  border-radius: 12px;

  color: var(--text-strong);

  outline: none;

  background: transparent;
}

.input:focus {
  border-color: var(--PrimaryColor);
}

/* ==========================================================================
   Info
   ========================================================================== */

.info-message {
  display: flex;
  align-items: center;

  min-height: 42px;

  padding: 10px 12px;

  border-radius: 12px;

  color: var(--text-soft);

  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-2));

  font-size: 0.7rem;
}

/* ==========================================================================
   Error / Actions
   ========================================================================== */

.form-error {
  margin: 0;

  padding: 11px 13px;

  border-radius: 10px;

  color: var(--status-danger);

  background: color-mix(in srgb, var(--status-danger) 9%, transparent);

  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 16px;

  border-radius: 11px;

  cursor: pointer;

  font-weight: 700;
}

.btn-primary {
  border: 1px solid var(--PrimaryColor);

  color: white;

  background: var(--PrimaryColor);
}

.btn-secondary {
  border: 1px solid var(--main-border);

  color: var(--text-strong);

  background: var(--surface-2);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  cursor: not-allowed;

  opacity: 0.6;
}

/* ==========================================================================
   Responsive
   ========================================================================== */

@media (max-width: 760px) {
  .action-form-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .form-section,
  .action-card {
    padding: 11px;
  }

  .agenda-item {
    grid-template-columns: 27px 1fr 32px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

// new dilaog styles

/* ==========================================================================
   Show Meeting Result Dialog
   ========================================================================== */

.meeting-show-header {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.meeting-show-header-icon {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  place-items: center;

  border-radius: 15px;

  color: #fff;

  background: linear-gradient(
    145deg,
    var(--PrimaryColor),
    var(--brand-primary-700)
  );

  font-family: 'Bold';
  font-size: 0.85rem;
}

.meeting-show-header-content {
  min-width: 0;
}

.meeting-show-header-content small {
  display: block;

  color: var(--PrimaryColor);

  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.meeting-show-header-content h2 {
  overflow: hidden;

  margin: 2px 0;

  color: var(--text-strong);

  font-size: 1rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.meeting-show-header-content p {
  margin: 0;

  color: var(--text-soft);

  font-size: 0.75rem;
}

/* ==========================================================================
   Content
   ========================================================================== */

.meeting-show-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.meeting-show-section {
  padding: 16px;

  border: 1px solid var(--main-border);
  border-radius: 16px;

  background: var(--surface-2);
}

.meeting-show-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  margin-bottom: 15px;
}

.meeting-show-section-header h3 {
  margin: 0;

  color: var(--text-strong);

  font-size: 0.9rem;
}

.meeting-show-section-header p {
  margin: 4px 0 0;

  color: var(--text-soft);

  font-size: 0.7rem;
}

.meeting-count-badge {
  display: grid;
  min-width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;

  padding: 0 8px;

  border-radius: 9px;

  color: var(--PrimaryColor);

  background: color-mix(
    in srgb,
    var(--PrimaryColor) 10%,
    transparent
  );

  font-size: 0.72rem;
  font-weight: 900;
}

/* ==========================================================================
   Meeting Info
   ========================================================================== */

.meeting-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.meeting-info-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;

  padding: 13px;

  border: 1px solid var(--main-border);
  border-radius: 12px;

  background: var(--surface-1);
}

.meeting-info-label {
  color: var(--text-soft);

  font-size: 0.68rem;
}

.meeting-info-card strong {
  overflow: hidden;

  color: var(--text-strong);

  font-size: 0.78rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==========================================================================
   Hierarchies
   ========================================================================== */

.meeting-hierarchy-list {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.meeting-hierarchy-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 8px 11px;

  border: 1px solid
    color-mix(
      in srgb,
      var(--PrimaryColor) 22%,
      var(--main-border)
    );

  border-radius: 10px;

  color: var(--text-strong);

  background: color-mix(
    in srgb,
    var(--PrimaryColor) 5%,
    var(--surface-1)
  );

  font-size: 0.72rem;
  font-weight: 700;
}

.hierarchy-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;

  border-radius: 50%;

  background: var(--PrimaryColor);
}

/* ==========================================================================
   Agenda
   ========================================================================== */

.meeting-show-agenda-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.meeting-show-agenda-item {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 10px;

  padding: 10px 12px;

  border: 1px solid var(--main-border);
  border-radius: 12px;

  background: var(--surface-1);
}

.meeting-show-number {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;

  border-radius: 9px;

  color: var(--PrimaryColor);

  background: color-mix(
    in srgb,
    var(--PrimaryColor) 10%,
    transparent
  );

  font-size: 0.7rem;
  font-weight: 900;
}

.meeting-show-agenda-text {
  min-width: 0;

  color: var(--text-strong);

  font-size: 0.78rem;
  line-height: 1.5;

  word-break: break-word;
}

/* ==========================================================================
   Actions
   ========================================================================== */

.meeting-show-actions-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.meeting-show-action-card {
  overflow: hidden;

  border: 1px solid var(--main-border);
  border-radius: 14px;

  background: var(--surface-1);
}

.meeting-show-action-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 13px 14px;

  border-bottom: 1px solid var(--main-border);
}

.meeting-show-action-title {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.meeting-show-action-number {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;

  border-radius: 9px;

  color: #fff;

  background: var(--PrimaryColor);

  font-size: 0.7rem;
  font-weight: 900;
}

.meeting-show-action-title small {
  display: block;

  margin-bottom: 2px;

  color: var(--text-soft);

  font-size: 0.64rem;
}

.meeting-show-action-title h4 {
  overflow: hidden;

  margin: 0;

  color: var(--text-strong);

  font-size: 0.8rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.meeting-action-type {
  flex: 0 0 auto;

  padding: 6px 10px;

  border-radius: 20px;

  font-size: 0.66rem;
  font-weight: 800;
}

.action-type-ongoing {
  color: var(--PrimaryColor);

  background: color-mix(
    in srgb,
    var(--PrimaryColor) 10%,
    transparent
  );
}

.action-type-info {
  color: var(--text-soft);

  background: color-mix(
    in srgb,
    var(--text-soft) 10%,
    transparent
  );
}

.action-type-task {
  color: var(--status-success, var(--PrimaryColor));

  background: color-mix(
    in srgb,
    var(--status-success, var(--PrimaryColor)) 10%,
    transparent
  );
}

.meeting-show-action-details {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
}

.meeting-action-detail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;

  padding: 13px 14px;

  border-inline-end: 1px solid var(--main-border);
  border-bottom: 1px solid var(--main-border);
}

.meeting-action-detail span {
  color: var(--text-soft);

  font-size: 0.65rem;
}

.meeting-action-detail strong {
  overflow: hidden;

  color: var(--text-strong);

  font-size: 0.74rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==========================================================================
   Content / Empty
   ========================================================================== */

.meeting-content-box {
  padding: 12px 14px;

  border: 1px solid var(--main-border);
  border-radius: 12px;

  color: var(--text-strong);

  background: var(--surface-1);

  font-size: 0.78rem;
  line-height: 1.6;

  white-space: pre-wrap;
}

.meeting-empty-state {
  padding: 20px;

  border: 1px dashed var(--main-border);
  border-radius: 12px;

  color: var(--text-soft);

  text-align: center;

  font-size: 0.75rem;
}

.meeting-show-no-data {
  display: flex;
  min-height: 200px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;

  color: var(--text-soft);
}

.meeting-show-no-data-icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;

  border-radius: 15px;

  color: var(--PrimaryColor);

  background: color-mix(
    in srgb,
    var(--PrimaryColor) 10%,
    transparent
  );

  font-weight: 900;
}

/* ==========================================================================
   Footer
   ========================================================================== */

.meeting-show-footer {
  display: flex;
  justify-content: flex-end;

  padding-top: 2px;
}

.meeting-show-close-button {
  min-width: 110px;

  padding: 10px 18px;

  border: 1px solid var(--PrimaryColor);
  border-radius: 11px;

  color: #fff;

  cursor: pointer;

  background: var(--PrimaryColor);

  font-weight: 700;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.meeting-show-close-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ==========================================================================
   Responsive
   ========================================================================== */

@media (max-width: 900px) {
  .meeting-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .meeting-show-action-details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .meeting-show-section {
    padding: 12px;
  }

  .meeting-info-grid {
    grid-template-columns: 1fr;
  }

  .meeting-show-action-details {
    grid-template-columns: 1fr;
  }

  .meeting-show-action-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .meeting-action-type {
    margin-inline-start: 42px;
  }

  .meeting-show-footer {
    display: block;
  }

  .meeting-show-close-button {
    width: 100%;
  }
}
</style>
