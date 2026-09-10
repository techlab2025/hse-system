<script setup lang="ts">
import { computed, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import { filesToBase64, type FileBase64 } from '@/base/Presentation/utils/file_to_base_64'
import AddDrillPlanningParams from '@/features/Organization/Project/Core/params/Drill/AddDrillPlanningParams'
import AddDrillActionParams from '@/features/Organization/Project/Core/params/Drill/AddDrillActionParams'
import AddDrillPlanningController from '@/features/Organization/Project/Presentation/controllers/Drill/AddDrillPlanningController'
import AddDrillActionController from '@/features/Organization/Project/Presentation/controllers/Drill/AddDrillActionController'

const props = defineProps<{ mode: 'planning' | 'action'; drillId: number; projectId: number }>()
const emit = defineEmits<{ (event: 'saved'): void }>()

interface TimelineDraft {
  date: Date | null
  time: Date | null
  description: string
  notes: string
  photographerName: string
  images: FileBase64[]
}

const createItem = (): TimelineDraft => ({
  date: null,
  time: null,
  description: '',
  notes: '',
  photographerName: '',
  images: [],
})

const items = ref<TimelineDraft[]>([createItem()])
const error = ref('')
const title = computed(() => props.mode === 'planning' ? 'Drill Planning Timeline' : 'Drill Action Timeline')

const setImages = async (files: File[], index: number) => {
  items.value[index].images = (await filesToBase64(files)) as FileBase64[]
}

const submit = async () => {
  error.value = ''
  if (items.value.some((item) => !item.date || !item.time || !item.description.trim())) {
    error.value = 'Date, time and description are required for every timeline item.'
    return
  }

  if (props.mode === 'planning') {
    const controller = AddDrillPlanningController.getInstance()
    await controller.addPlanning(new AddDrillPlanningParams(
      props.drillId,
      props.projectId,
      items.value.map((item) => ({ date: item.date!, time: item.time!, description: item.description.trim() })),
    ))
    if (controller.isDataSuccess()) emit('saved')
    else error.value = controller.state.value.error?.title ?? 'Unable to save drill planning.'
    return
  }

  const controller = AddDrillActionController.getInstance()
  await controller.addAction(new AddDrillActionParams(
    props.drillId,
    props.projectId,
    items.value.map((item) => ({
      date: item.date!,
      time: item.time!,
      description: item.description.trim(),
      notes: item.notes.trim(),
      photographerName: item.photographerName.trim(),
      images: item.images,
    })),
  ))
  if (controller.isDataSuccess()) emit('saved')
  else error.value = controller.state.value.error?.title ?? 'Unable to save drill actions.'
}
</script>

<template>
  <section class="drill-timeline-builder">
    <div class="timeline-heading">
      <div><span>{{ mode === 'planning' ? 'PLAN' : 'ACT' }}</span></div>
      <div><h3>{{ $t(title) }}</h3><p>{{ $t('Build a clear sequence using scheduled dates and times.') }}</p></div>
    </div>

    <div class="drill-timeline-list">
      <article v-for="(item, index) in items" :key="index" class="drill-timeline-item">
        <div class="drill-timeline-marker"><span>{{ index + 1 }}</span></div>
        <div class="drill-timeline-card">
          <div class="drill-timeline-card-header">
            <div><span>{{ mode === 'planning' ? $t('Planning step') : $t('Action') }} {{ index + 1 }}</span><h4>{{ $t('Timeline entry') }}</h4></div>
            <button v-if="items.length > 1" type="button" class="timeline-delete" @click="items.splice(index, 1)">{{ $t('delete') }}</button>
          </div>

          <div class="timeline-fields">
            <div class="input-wrapper">
              <div class="field-label"><label :for="`drill_timeline_date_${index}`">{{ $t('date') }}</label><FieldHelpIcon text="Select the date for this timeline entry." /></div>
              <DatePicker :id="`drill_timeline_date_${index}`" v-model="item.date" date-format="yy-mm-dd" show-icon fluid />
            </div>
            <div class="input-wrapper">
              <div class="field-label"><label :for="`drill_timeline_time_${index}`">{{ $t('time') }}</label><FieldHelpIcon text="Select the time for this timeline entry." /></div>
              <DatePicker :id="`drill_timeline_time_${index}`" v-model="item.time" time-only hour-format="12" fluid />
            </div>
            <div class="input-wrapper full-field">
              <div class="field-label"><label :for="`drill_timeline_description_${index}`">{{ $t('description') }}</label><FieldHelpIcon text="Describe what is planned or what happened at this point." /></div>
              <textarea :id="`drill_timeline_description_${index}`" v-model="item.description" class="input" :placeholder="$t('What happened? (in detail)')"></textarea>
            </div>

            <template v-if="mode === 'action'">
              <div class="input-wrapper">
                <div class="field-label"><label :for="`drill_photographer_${index}`">{{ $t('Photographer name') }}</label><FieldHelpIcon text="Enter the name of the person who captured the evidence." /></div>
                <input :id="`drill_photographer_${index}`" v-model="item.photographerName" class="input" type="text" :placeholder="$t('Enter photographer name')" />
              </div>
              <div class="input-wrapper">
                <div class="field-label"><label :for="`drill_action_notes_${index}`">{{ $t('notes') }}</label><FieldHelpIcon text="Add notes about this drill action." /></div>
                <textarea :id="`drill_action_notes_${index}`" v-model="item.notes" class="input compact-textarea" :placeholder="$t('Enter notes')"></textarea>
              </div>
              <div class="full-field input-wrapper">
                <div class="field-label"><label>{{ $t('upload image') }}</label><FieldHelpIcon text="Attach photos that document the drill action or evidence." /></div>
                <MultiImagesInput :index="index" @update:images="setImages($event, index)" />
              </div>
            </template>
          </div>
        </div>
      </article>
    </div>

    <button class="add-timeline-item" type="button" @click="items.push(createItem())">+ {{ $t('Add new timeline') }}</button>
    <p v-if="error" class="timeline-error">{{ error }}</p>
    <div class="timeline-submit"><button class="btn btn-primary" type="button" @click="submit">{{ $t('Save timeline') }}</button></div>
  </section>
</template>

<style scoped lang="scss">
.drill-timeline-builder { display: flex; flex-direction: column; gap: 16px; }
.timeline-heading { display: flex; align-items: center; gap: 11px; padding: 13px; border-radius: 15px; background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-2)); }
.timeline-heading > div:first-child span { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 13px; color: white; background: var(--PrimaryColor); font: .65rem 'Bold'; }
.timeline-heading h3 { margin: 0; color: var(--text-strong); font-size: .95rem; }.timeline-heading p { margin: 2px 0 0; color: var(--text-soft); font-size: .68rem; }
.drill-timeline-list { display: flex; flex-direction: column; gap: 14px; }.drill-timeline-item { display: grid; grid-template-columns: 38px 1fr; gap: 10px; }.drill-timeline-marker { position: relative; display: flex; justify-content: center; }.drill-timeline-marker::after { content: ''; position: absolute; top: 34px; bottom: -22px; width: 2px; background: color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border)); }.drill-timeline-item:last-child .drill-timeline-marker::after { display: none; }.drill-timeline-marker span { display: grid; width: 32px; height: 32px; z-index: 1; place-items: center; border-radius: 50%; color: white; background: var(--PrimaryColor); font-family: 'Bold'; }
.drill-timeline-card { padding: 15px; border: 1px solid var(--main-border); border-radius: 17px; background: var(--surface-2); }.drill-timeline-card-header { display: flex; justify-content: space-between; margin-bottom: 13px; }.drill-timeline-card-header span { color: var(--PrimaryColor); font-size: .63rem; font-weight: 900; text-transform: uppercase; }.drill-timeline-card-header h4 { margin: 2px 0 0; color: var(--text-strong); }.timeline-delete { color: var(--status-danger); cursor: pointer; }.timeline-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }.full-field { grid-column: 1 / -1; }.timeline-fields textarea { min-height: 72px; resize: vertical; }.timeline-fields .compact-textarea { min-height: 42px; }.add-timeline-item { align-self: flex-start; padding: 9px 13px; border: 1px dashed var(--PrimaryColor); border-radius: 11px; color: var(--PrimaryColor); cursor: pointer; background: color-mix(in srgb, var(--PrimaryColor) 5%, transparent); }.timeline-error { margin: 0; color: var(--status-danger); }.timeline-submit { display: flex; justify-content: flex-end; }
@media (max-width: 650px) { .timeline-fields { grid-template-columns: 1fr; }.full-field { grid-column: auto; }.drill-timeline-item { grid-template-columns: 30px 1fr; } }
</style>
