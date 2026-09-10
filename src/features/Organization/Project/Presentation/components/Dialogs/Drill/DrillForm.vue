<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
import IndexDrillTypeController from '@/features/Organization/DrillType/Presentation/controllers/indexDrillTypeController'
import IndexDrillTypeParams from '@/features/Organization/DrillType/Core/params/indexDrillTypeParams'
import ProjectCustomLocationController from '@/features/Organization/Project/Presentation/controllers/ProjectCustomLocationController'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import AddDrillParams from '@/features/Organization/Project/Core/params/Drill/AddDrillParams'
import AddDrillController from '@/features/Organization/Project/Presentation/controllers/Drill/AddDrillController'

const props = defineProps<{ projectId: number }>()
const emit = defineEmits<{ (event: 'saved'): void }>()

const drillType = ref<TitleInterface | null>(null)
const projectTeam = ref<TitleInterface | null>(null)
const date = ref<Date | null>(null)
const time = ref<Date | null>(null)
const serial = ref('')
const evaluation = ref('')
const improvement = ref('')
const notes = ref('')
const teamOptions = ref<TitleInterface[]>([])
const error = ref('')

const statusStore = useProjectAppStatusStore()
const serialIsAuto = computed(() => statusStore.isSerialNumberAuto())
const drillTypeController = IndexDrillTypeController.getInstance()
const drillTypeParams = new IndexDrillTypeParams('', 1, 100, 0, false)
const teamController = ProjectCustomLocationController.getInstance()
const submitting = computed(() => AddDrillController.getInstance().isDataLoading())

const loadTeams = async () => {
  const params = new ProjectCustomLocationParams(
    props.projectId,
    [ProjectCustomLocationEnum.TEAM],
    [],
  )
  await teamController.getData(params)
  const locations = teamController.state.value.data ?? []
  const seen = new Set<number>()

  teamOptions.value = locations.flatMap((location) =>
    (location.locationTeams ?? []).flatMap((team) => {
      const id = Number(team.projectLocationTeamId || team.id)
      if (!id || seen.has(id)) return []
      seen.add(id)
      return [new TitleInterface({ id, title: team.teamTitle || team.title || `Team #${id}` })]
    }),
  )
}

const submit = async () => {
  error.value = ''
  if (!drillType.value?.id || !projectTeam.value?.id || !date.value || !time.value) {
    error.value = 'Drill type, project team, date and time are required.'
    return
  }
  if (!serialIsAuto.value && !serial.value.trim()) {
    error.value = 'Serial number is required when manual serial numbering is enabled.'
    return
  }

  const params = new AddDrillParams(
    props.projectId,
    Number(drillType.value.id),
    Number(projectTeam.value.id),
    date.value,
    time.value,
    serial.value.trim(),
    evaluation.value.trim(),
    improvement.value.trim(),
    notes.value.trim(),
  )
  const controller = AddDrillController.getInstance()
  await controller.addDrill(params)
  if (controller.isDataSuccess()) emit('saved')
  else error.value = controller.state.value.error?.title ?? 'Unable to add the drill.'
}

onMounted(loadTeams)
</script>

<template>
  <form class="drill-form" @submit.prevent="submit">
    <div class="drill-form-intro">
      <span>01</span>
      <div>
        <strong>{{ $t('Configure the drill') }}</strong>
        <p>{{ $t('Choose the drill type, responsible project team and schedule.') }}</p>
      </div>
    </div>

    <div class="drill-form-grid">
      <UpdatedCustomInputSelect
        id="drill_type_id"
        v-model="drillType"
        :label="$t('Drill Type')"
        :placeholder="$t('Select drill type')"
        :controller="drillTypeController"
        :params="drillTypeParams"
        required
      />
      <UpdatedCustomInputSelect
        id="project_team_id"
        v-model="projectTeam"
        :label="$t('Project Team')"
        :placeholder="$t('Select project team')"
        :static-options="teamOptions"
        required
      />

      <div class="input-wrapper">
        <div class="field-label"><label for="drill_date">{{ $t('date') }}</label><FieldHelpIcon text="Select the drill date." /></div>
        <DatePicker id="drill_date" v-model="date" date-format="yy-mm-dd" show-icon fluid />
      </div>
      <div class="input-wrapper">
        <div class="field-label"><label for="drill_time">{{ $t('time') }}</label><FieldHelpIcon text="Select the drill start time." /></div>
        <DatePicker id="drill_time" v-model="time" time-only hour-format="12" fluid />
      </div>

      <div class="input-wrapper drill-serial">
        <div class="field-label"><label for="drill_serial">{{ $t('serial_number') }}</label><FieldHelpIcon :text="serialIsAuto ? 'The serial will be generated automatically.' : 'Enter the drill serial number.'" /></div>
        <input id="drill_serial" v-model="serial" class="input" type="text" :disabled="serialIsAuto" :placeholder="serialIsAuto ? $t('Auto-generated') : $t('Enter serial number')" />
        <small v-if="serialIsAuto">{{ $t('Automatic serial numbering is enabled') }}</small>
      </div>

      <div class="input-wrapper full-field">
        <div class="field-label"><label for="drill_evaluation">{{ $t('Evaluation') }}</label><FieldHelpIcon text="Record the initial drill evaluation." /></div>
        <textarea id="drill_evaluation" v-model="evaluation" class="input" :placeholder="$t('Enter evaluation')"></textarea>
      </div>
      <div class="input-wrapper full-field">
        <div class="field-label"><label for="drill_improvement">{{ $t('Improvement') }}</label><FieldHelpIcon text="Describe opportunities for improvement." /></div>
        <textarea id="drill_improvement" v-model="improvement" class="input" :placeholder="$t('Enter improvement opportunities')"></textarea>
      </div>
      <div class="input-wrapper full-field">
        <div class="field-label"><label for="drill_notes">{{ $t('notes') }}</label><FieldHelpIcon text="Add any supporting notes for this drill." /></div>
        <textarea id="drill_notes" v-model="notes" class="input" :placeholder="$t('Enter notes')"></textarea>
      </div>
    </div>

    <p v-if="error" class="drill-form-error">{{ error }}</p>
    <div class="drill-form-actions">
      <button class="btn btn-primary" type="submit" :disabled="submitting">
        {{ submitting ? $t('Saving...') : $t('Add Drill') }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.drill-form { display: flex; flex-direction: column; gap: 16px; }
.drill-form-intro { display: flex; align-items: center; gap: 12px; padding: 14px; border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border)); border-radius: 16px; background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-2)); }
.drill-form-intro > span { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 12px; color: white; background: var(--PrimaryColor); font-family: 'Bold'; }
.drill-form-intro strong { color: var(--text-strong); }
.drill-form-intro p { margin: 2px 0 0; color: var(--text-soft); font-size: .75rem; }
.drill-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px; }
.full-field, .drill-serial { grid-column: 1 / -1; }
.input-wrapper textarea { min-height: 82px; resize: vertical; }
.drill-serial small { color: var(--PrimaryColor); }
.drill-form-error { margin: 0; padding: 10px 12px; border-radius: 10px; color: var(--status-danger); background: var(--status-danger-soft); }
.drill-form-actions { display: flex; justify-content: flex-end; }
@media (max-width: 680px) { .drill-form-grid { grid-template-columns: 1fr; } .full-field, .drill-serial { grid-column: auto; } }
</style>
