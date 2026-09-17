<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import { filesToBase64, type FileBase64 } from '@/base/Presentation/utils/file_to_base_64'
import AddDrillPlanningParams from '@/features/Organization/Project/Core/params/Drill/AddDrillPlanningParams'
import AddDrillActionParams from '@/features/Organization/Project/Core/params/Drill/AddDrillActionParams'
import AddDrillPlanningController from '@/features/Organization/Project/Presentation/controllers/Drill/AddDrillPlanningController'
import AddDrillActionController from '@/features/Organization/Project/Presentation/controllers/Drill/AddDrillActionController'
import type DrillTimelineItemModel from '@/features/Organization/Project/Data/models/Drill/DrillTimelineItemModel'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import { useRoute } from 'vue-router'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'

const props = withDefaults(
  defineProps<{
    mode: 'planning' | 'action'
    drillId: number
    projectId: number
    actions?: DrillTimelineItemModel[]
    actionsLoading?: boolean
    actionsError?: string
  }>(),
  {
    actions: () => [],
    actionsLoading: false,
    actionsError: '',
  },
)
const emit = defineEmits<{ (event: 'saved'): void }>()

interface TimelineDraft {
  date: Date | null
  time: Date | null
  description: string
  notes: string
  photographerName: string
  images: FileBase64[]
  projectLocationEmployee: TitleInterface
  evaluation: string
  improvement: string
  photographerplace: string
}

const createItem = (): TimelineDraft => ({
  date: null,
  time: null,
  description: '',
  notes: '',
  photographerName: '',
  images: [],
  projectLocationEmployee: new TitleInterface({ id: 0, title: '' }),
  evaluation: '',
  improvement: '',
  photographerplace: '',
})

const items = ref<TimelineDraft[]>([createItem()])
const error = ref('')
const savedActions = computed(() => props.actions)
const title = computed(() =>
  props.mode === 'planning' ? 'Drill Planning Timeline' : 'Drill Action Timeline',
)

const setImages = async (files: File[], index: number) => {
  items.value[index].images = (await filesToBase64(files)) as FileBase64[]
}

const submit = async () => {
  error.value = ''
  if (
    items.value.some(
      (item) =>
        // !item.date ||
        !item.time ||
        !(props.mode === 'planning' ? item.notes : item.description).trim(),
    )
  ) {
    error.value = ` time and ${props.mode === 'planning' ? 'notes' : 'description'} are required for every timeline item.`
    return
  }

  if (props.mode === 'planning') {
    const controller = AddDrillPlanningController.getInstance()
    await controller.addPlanning(
      new AddDrillPlanningParams(
        props.drillId,
        props.projectId,
        items.value.map((item) => ({
          date: item.date!,
          time: item.time!,
          notes: item.notes.trim(),
        })),
      ),
    )
    if (controller.isDataSuccess()) emit('saved')
    else error.value = controller.state.value.error?.title ?? 'Unable to save drill planning.'
    return
  }

  const controller = AddDrillActionController.getInstance()
  await controller.addAction(
    new AddDrillActionParams(
      props.drillId,
      props.projectId,
      items.value.map((item) => ({
        date: item.date!,
        time: item.time!,
        description: item.description.trim(),
        notes: item.notes.trim(),
        photographerName: item.photographerName.trim(),
        images: item.images,
        evaluation: item.evaluation,
        improvement: item.improvement,
        projectLocationEmployee: item.projectLocationEmployee.id,
        photographerPlace: item.photographerplace.trim(),
      })),
    ),
  )
  if (controller.isDataSuccess()) emit('saved')
  else error.value = controller.state.value.error?.title ?? 'Unable to save drill actions.'
}

const route = useRoute()
const projectCustomLocationParams = new ProjectCustomLocationParams(
  Number(route.params.id),
  [ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE],
  [],
)
const projectCustomLocationController = ProjectCustomLocationController.getInstance()

const employeeOptions = ref<TitleInterface[]>([])

const fetchProjectEmployees = async () => {
  const response = await projectCustomLocationController.getData(projectCustomLocationParams)

  const locations = response.value.data ?? []

  employeeOptions.value = locations.flatMap((location: any) =>
    (location.locationHierarchies ?? []).flatMap((hierarchy: any) =>
      (hierarchy.project_location_hierarchy_employees ?? []).map(
        (employee: any) =>
          new TitleInterface({
            id: employee.project_location_hierarchy_employee_id,
            title: employee.name,
          }),
      ),
    ),
  )
}

const upadteEmployeeData = (data: any) => {
  console.log(data, 'data')
}
onMounted(fetchProjectEmployees)
</script>

<template>
  <section class="drill-timeline-builder">
    <div class="timeline-heading">
      <div>
        <span>{{ mode === 'planning' ? 'PLAN' : 'ACT' }}</span>
      </div>
      <div>
        <h3>{{ $t(title) }}</h3>
        <p>{{ $t('Build a clear sequence using scheduled dates and times.') }}</p>
      </div>
    </div>

    <div v-if="mode === 'action'" class="existing-actions">
      <p v-if="actionsLoading" class="existing-actions-status">
        {{ $t('Loading drill actions...') }}
      </p>
      <p v-else-if="actionsError" class="timeline-error">{{ actionsError }}</p>
      <template v-else-if="savedActions.length">
        <div class="existing-actions-title">
          <h4>{{ $t('Recorded actions') }}</h4>
          <span>{{ savedActions.length }} {{ $t('entries') }}</span>
        </div>
        <article
          v-for="(action, index) in savedActions"
          :key="`saved-action-${action.id}-${index}`"
          class="existing-action"
        >
          <span>{{ index + 1 }}</span>
          <div>
            <small>
              {{ action.date }} · {{ action.time }}
              <template v-if="action.photographerName"> · {{ action.photographerName }}</template>
            </small>
            <p>{{ action.description }}</p>
            <em v-if="action.notes">{{ action.notes }}</em>
            <div v-if="action.images.length" class="existing-action-images">
              <img
                v-for="image in action.images"
                :key="image"
                :src="image.url"
                alt="Drill evidence"
              />
            </div>
          </div>
        </article>
      </template>
    </div>

    <div class="drill-timeline-list">
      <article v-for="(item, index) in items" :key="index" class="drill-timeline-item">
        <div class="drill-timeline-marker">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="drill-timeline-card">
          <div class="drill-timeline-card-header">
            <div>
              <span
                >{{ mode === 'planning' ? $t('Planning step') : $t('Action') }}
                {{ index + 1 }}</span
              >
              <!-- <h4>{{ $t('Timeline entry') }}</h4> -->
            </div>
            <button
              v-if="items.length > 1"
              type="button"
              class="timeline-delete"
              @click="items.splice(index, 1)"
            >
              {{ $t('delete') }}
            </button>
          </div>

          <div class="timeline-fields">
            <div class="input-wrapper" v-if="mode === 'action'">
              <div class="field-label">
                <label :for="`drill_timeline_date_${index}`">{{ $t('Photographer date') }}</label
                ><FieldHelpIcon text="Select the date for this timeline entry." />
              </div>
              <DatePicker
                :id="`drill_timeline_date_${index}`"
                v-model="item.date"
                date-format="yy-mm-dd"
                show-icon
                fluid
              />
            </div>
            <div class="input-wrapper">
              <div class="field-label">
                <label :for="`drill_timeline_time_${index}`">{{ $t('time') }}</label
                ><FieldHelpIcon text="Select the time for this timeline entry." />
              </div>
              <DatePicker
                :id="`drill_timeline_time_${index}`"
                v-model="item.time"
                time-only
                hour-format="12"
                fluid
              />
            </div>
            <div v-if="mode === 'planning'" class="input-wrapper full-field">
              <div class="field-label">
                <label :for="`drill_timeline_notes_${index}`">{{ $t('notes') }}</label
                ><FieldHelpIcon text="Describe what is planned at this point." />
              </div>
              <textarea
                :id="`drill_timeline_notes_${index}`"
                v-model="item.notes"
                class="input"
                :placeholder="$t('Enter planning notes')"
              ></textarea>
            </div>
            <div v-else class="input-wrapper full-field">
              <div class="field-label">
                <label :for="`drill_timeline_description_${index}`">{{ $t('Explanation') }}</label
                ><FieldHelpIcon text="Describe what is planned or what happened at this point." />
              </div>
              <textarea
                :id="`drill_timeline_description_${index}`"
                v-model="item.description"
                class="input"
                :placeholder="$t('What happened? (in detail)')"
              ></textarea>
            </div>

            <template v-if="mode === 'action'">
              <!-- <div class="input-wrapper">
                <div class="field-label">
                  <label :for="`drill_photographer_${index}`">{{ $t('Photographer name') }}</label
                  ><FieldHelpIcon text="Enter the name of the person who captured the evidence." />
                </div>
                <input
                  :id="`drill_photographer_${index}`"
                  v-model="item.photographerName"
                  class="input"
                  type="text"
                  :placeholder="$t('Enter photographer name')"
                />
              </div> -->
               <div class="input-wrapper">
                <div class="field-label">
                  <label :for="`drill_photographer_${index}`">{{ $t('Photographer place') }}</label
                  ><FieldHelpIcon text="Enter the place of the person who captured the evidence." />
                </div>
                <input
                  :id="`drill_photographer_${index}`"
                  v-model="item.photographerplace"
                  class="input"
                  type="text"
                  :placeholder="$t('Enter photographer place')"
                />
              </div>
              <div class="input-wrapper">
                <div class="field-label">
                  <label :for="`evaluation_${index}`">{{ $t('evaluation') }}</label
                  ><FieldHelpIcon text="Enter the evaluation" />
                </div>
                <input
                  :id="`evaluation_${index}`"
                  v-model="item.evaluation"
                  class="input"
                  type="text"
                  :placeholder="$t('Enter Evaluation')"
                />
              </div>
              <div class="input-wrapper">
                <div class="field-label">
                  <label :for="`improvement_${index}`">{{ $t('Suggested Improvement') }}</label
                  ><FieldHelpIcon text="Enter the improvement" />
                </div>
                <input
                  :id="`improvement_${index}`"
                  v-model="item.improvement"
                  class="input"
                  type="text"
                  :placeholder="$t('Enter improvement')"
                />
              </div>
              <!-- <div class="input-wrapper">
                <UpdatedCustomInputSelect
                  :static-options="employeeOptions"
                  v-model="item.projectLocationEmployee"
                  placeholder="Select Employee"
                  class="mt-4 mr-2 input"
                  label="employee Name"
                  :reload="false"
                  @update:model-value="upadteEmployeeData"

                />
              </div> -->

              <div class="input-wrapper">
                <div class="field-label">
                  <label :for="`drill_action_notes_${index}`">{{ $t('notes') }}</label
                  ><FieldHelpIcon text="Add notes about this drill action." />
                </div>
                <textarea
                  :id="`drill_action_notes_${index}`"
                  v-model="item.notes"
                  class="input compact-textarea"
                  :placeholder="$t('Enter notes')"
                ></textarea>
              </div>
              <div class="full-field input-wrapper">
                <div class="field-label">
                  <label>{{ $t('upload image') }}</label
                  ><FieldHelpIcon
                    text="Attach photos that document the drill action or evidence."
                  />
                </div>
                <MultiImagesInput :index="index" @update:images="setImages($event, index)" />
              </div>
            </template>
          </div>
        </div>
      </article>
    </div>

    <button class="add-timeline-item" type="button" @click="items.push(createItem())">
      + {{ $t('Add Scenario') }}
    </button>
    <p v-if="error" class="timeline-error">{{ error }}</p>
    <div class="timeline-submit">
      <button class="btn btn-primary" type="button" @click="submit">
        {{ $t('Save timeline') }}
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.drill-timeline-builder {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.timeline-heading {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px;
  border-radius: 15px;
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-2));
}
.timeline-heading > div:first-child span {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 13px;
  color: white;
  background: var(--PrimaryColor);
  font: 0.65rem 'Bold';
}
.timeline-heading h3 {
  margin: 0;
  color: var(--text-strong);
  font-size: 0.95rem;
}
.timeline-heading p {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.68rem;
}
.existing-actions {
  display: grid;
  gap: 9px;
}
.existing-actions-status {
  margin: 0;
  color: var(--text-soft);
}
.existing-actions-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.existing-actions-title h4 {
  margin: 0;
  color: var(--text-strong);
}
.existing-actions-title span {
  color: var(--text-soft);
  font-size: 0.7rem;
}
.existing-action {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: var(--surface-2);
}
.existing-action > span {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  color: white;
  background: var(--PrimaryColor);
  font-family: 'Bold';
}
.existing-action small {
  color: var(--text-soft);
}
.existing-action p {
  margin: 4px 0;
  color: var(--text-strong);
}
.existing-action em {
  color: var(--text-soft);
  font-size: 0.75rem;
}
.existing-action-images {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 8px;
}
.existing-action-images img {
  width: 68px;
  height: 68px;
  border-radius: 9px;
  object-fit: cover;
}
.drill-timeline-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.drill-timeline-item {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 10px;
}
.drill-timeline-marker {
  position: relative;
  display: flex;
  justify-content: center;
}
.drill-timeline-marker::after {
  content: '';
  position: absolute;
  top: 34px;
  bottom: -22px;
  width: 2px;
  background: color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
}
.drill-timeline-item:last-child .drill-timeline-marker::after {
  display: none;
}
.drill-timeline-marker span {
  display: grid;
  width: 32px;
  height: 32px;
  z-index: 1;
  place-items: center;
  border-radius: 50%;
  color: white;
  background: var(--PrimaryColor);
  font-family: 'Bold';
}
.drill-timeline-card {
  padding: 15px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
  background: var(--surface-2);
}
.drill-timeline-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 13px;
}
.drill-timeline-card-header span {
  color: var(--PrimaryColor);
  font-size: 0.63rem;
  font-weight: 900;
  text-transform: uppercase;
}
.drill-timeline-card-header h4 {
  margin: 2px 0 0;
  color: var(--text-strong);
}
.timeline-delete {
  color: var(--status-danger);
  cursor: pointer;
}
.timeline-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}
.full-field {
  grid-column: 1 / -1;
}
.timeline-fields textarea {
  min-height: 72px;
  resize: vertical;
}
.timeline-fields .compact-textarea {
  min-height: 42px;
}
.add-timeline-item {
  align-self: flex-start;
  padding: 9px 13px;
  border: 1px dashed var(--PrimaryColor);
  border-radius: 11px;
  color: var(--PrimaryColor);
  cursor: pointer;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, transparent);
}
.timeline-error {
  margin: 0;
  color: var(--status-danger);
}
.timeline-submit {
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 650px) {
  .timeline-fields {
    grid-template-columns: 1fr;
  }
  .full-field {
    grid-column: auto;
  }
  .drill-timeline-item {
    grid-template-columns: 30px 1fr;
  }
}
</style>
