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

const MeetingDetailsState = computed(() => true)
const FetchMeetingDetails = () => {}

watch(
  () => AddResultDialogvisible.value,
  (newval) => {
    if (newval) {
      FetchMeetingDetails()
    }
  },
)
</script>

<template>
  <!-- Meeting Card -->
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
            {{ meeting.title || `Meeting #${meeting.id}` }}
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

          <!-- <button type="button" class="add-button" @click="addAction">
            + {{ $t('Add Action') }}
          </button> -->
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

  <!-- Meeting show Result Dialog -->
  <Dialog
    v-model:visible="ShowResultDialogvisible"
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
        ggggggggggggggggggg
        <!-- <div>
          <small>
            {{ $t('Meeting Result') }}
          </small>

          <h2>
            {{ meeting.title || `Meeting #${meeting.id}` }}
          </h2>

          <p>
            {{ meeting.date || '—' }}
          </p> -->
        <!-- </div> -->
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

          <!-- <button type="button" class="add-button" @click="addAction">
            + {{ $t('Add Action') }}
          </button> -->
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
          @click="closeShowResultDialog"
        >
          {{ $t('Cancel') }}
        </button>

        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? $t('Saving...') : $t('Save Meeting Result') }}
        </button>
      </div>
    </form>
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
</style>
