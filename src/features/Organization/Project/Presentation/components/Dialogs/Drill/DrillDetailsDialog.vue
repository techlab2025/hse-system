<script setup lang="ts">
import { inject } from 'vue'
import { overviewPresentationKey } from '../../Details/overviewPresentation'
const overviewPresentation = inject(overviewPresentationKey, false)

import { vProjectPanels } from '../../../composables/projectPanels'

import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'
import type DrillModel from '@/features/Organization/Project/Data/models/Drill/DrillModel'
import type DrillTimelineItemModel from '@/features/Organization/Project/Data/models/Drill/DrillTimelineItemModel'
import FetchDrillActionsParams from '@/features/Organization/Project/Core/params/Drill/FetchDrillActionsParams'
import FetchDrillActionsController from '@/features/Organization/Project/Presentation/controllers/Drill/FetchDrillActionsController'
import DeleteDrillActionParams from '@/features/Organization/Project/Core/params/Drill/DeleteDrillActionParams'
import DeleteDrillPlanParams from '@/features/Organization/Project/Core/params/Drill/DeleteDrillPlanParams'
import DeleteDrillActionController from '@/features/Organization/Project/Presentation/controllers/Drill/DeleteDrillActionController'
import DeleteDrillPlanController from '@/features/Organization/Project/Presentation/controllers/Drill/DeleteDrillPlanController'
import DrillTimelineEditor from './DrillTimelineEditor.vue'

const props = withDefaults(
  defineProps<{
    drill: DrillModel
    projectId: number
    plans?: DrillTimelineItemModel[]
    plansLoading?: boolean
    triggerless?: boolean
  }>(),
  {
    plans: undefined,
    plansLoading: false,
    triggerless: false,
  },
)
const emit = defineEmits<{
  (event: 'opened'): void
  (event: 'saved'): void
}>()
const visible = ref(false)
const editorMode = ref<'planning' | 'action' | null>(null)
const fetchedActions = ref<DrillTimelineItemModel[] | null>(null)
const actionsLoading = ref(false)
const actionsError = ref('')
const deletedPlanIds = ref<number[]>([])
const pendingDelete = ref<{ type: 'plan' | 'action'; id: number } | null>(null)
const deleteDialogVisible = ref(false)
const deleting = ref(false)
const displayedPlans = computed(() =>
  (props.plans ?? props.drill.planning).filter((item) => !deletedPlanIds.value.includes(item.id)),
)
const displayedActions = computed(() => fetchedActions.value ?? props.drill.actions)

const fetchDrillActions = async () => {
  if (!props.drill.id) return

  actionsLoading.value = true
  actionsError.value = ''
  const controller = FetchDrillActionsController.getInstance()
  await controller.fetchActions(new FetchDrillActionsParams(props.drill.id))

  if (controller.isDataSuccess()) {
    fetchedActions.value = controller.state.value.data ?? []
  } else {
    actionsError.value = controller.state.value.error?.title ?? 'Unable to load drill actions.'
  }
  actionsLoading.value = false
}

const openDialog = () => {
  visible.value = true
  editorMode.value = null
  void fetchDrillActions()
  emit('opened')
}

defineExpose({ openDialog })

const saved = () => {
  editorMode.value = null

  void fetchDrillActions()
  emit('saved')
}

const requestDelete = (type: 'plan' | 'action', id: number) => {
  pendingDelete.value = { type, id }
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  if (!pendingDelete.value || deleting.value) return

  deleting.value = true
  const target = pendingDelete.value

  try {
    if (target.type === 'action') {
      const controller = DeleteDrillActionController.getInstance()
      await controller.deleteAction(new DeleteDrillActionParams(target.id))

      if (!controller.isDataSuccess()) return

      await fetchDrillActions()
    } else {
      const controller = DeleteDrillPlanController.getInstance()
      await controller.deletePlan(new DeleteDrillPlanParams(target.id))

      if (!controller.isDataSuccess()) return

      deletedPlanIds.value.push(target.id)
      emit('saved')
    }

    deleteDialogVisible.value = false
    pendingDelete.value = null
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <button
    data-hse-project
    v-project-panels
    v-if="!triggerless"
    class="hse-project-root drill-card hse-project-planning"
    type="button"
    @click="openDialog"
  >
    <span class="drill-card-accent"></span>
    <span class="drill-card-main">
      <span class="drill-card-kicker">{{ drill.drillType.title || $t('Drill') }}</span>
      <strong>{{ drill.serialNumber || $t('uiDynamic.drillReference', { p0: drill.id }) }}</strong>
      <small>{{ drill.date || '—' }} · {{ drill.time || '—' }}</small>
    </span>
    <!-- <span class="drill-card-status"
      ><i></i
      >{{
        displayedActions.length
          ? $t('Action recorded')
          : displayedPlans.length
            ? $t('Planned')
            : $t('New')
      }}</span
    > -->
    <span class="drill-card-arrow">→</span>
  </button>

  <Dialog
    :class="{ 'hse-project-overview-overlay': overviewPresentation }"
    data-hse-project
    class="hse-project-root hse-project-overlay hse-project-planning"
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    v-model:visible="visible"
    modal
    dismissable-mask
    :style="{ width: 'min(68rem, calc(100vw - 24px))' }"
    @hide="editorMode = null"
  >
    <template #header>
      <div class="details-heading">
        <span>DR</span>
        <div>
          <small>{{ drill.drillType.title }}</small>
          <h2>{{ drill.serialNumber || $t('uiDynamic.drillReference', { p0: drill.id }) }}</h2>
          <p>{{ drill.projectTeam.title }}</p>
        </div>
      </div>
    </template>

    <div class="drill-detail-summary">
      <div v-if="drill.date">
        <span>{{ $t('date') }}</span
        ><strong>{{ drill.date || '—' }}</strong>
      </div>
      <div v-if="drill.time">
        <span>{{ $t('time') }}</span
        ><strong>{{ drill.time || '—' }}</strong>
      </div>
      <div v-if="drill.projectTeam.title">
        <span>{{ $t('Project Team') }}</span
        ><strong>{{ drill.projectTeam.title || '—' }}</strong>
      </div>
      <div v-if="drill.drillType.title">
        <span>{{ $t('Drill Type') }}</span
        ><strong>{{ drill.drillType.title || '—' }}</strong>
      </div>
    </div>

    <div class="drill-detail-copy">
      <article v-if="drill.evaluation">
        <span>{{ $t('Evaluation') }}</span>
        <p>{{ drill.evaluation || '—' }}</p>
      </article>
      <article v-if="drill.improvement">
        <span>{{ $t('Improvement') }}</span>
        <p>{{ drill.improvement || '—' }}</p>
      </article>
      <article v-if="drill.notes">
        <span>{{ $t('notes') }}</span>
        <p>{{ drill.notes || '—' }}</p>
      </article>
    </div>

    <div class="drill-workflow-actions">
      <button
        type="button"
        :class="{ active: editorMode === 'planning' }"
        @click="editorMode = editorMode === 'planning' ? null : 'planning'"
      >
        <span>01</span>
        <div>
          <strong>{{ $t('Add Planning') }}</strong
          ><small>{{ $t('Build the drill preparation timeline') }}</small>
        </div>
      </button>
      <button
        type="button"
        :class="{ active: editorMode === 'action' }"
        :disabled="!displayedPlans.length"
        :title="!displayedPlans.length ? $t('Add planning first') : undefined"
        @click="editorMode = editorMode === 'action' ? null : 'action'"
      >
        <span>02</span>
        <div>
          <strong>{{ $t('Add Actions') }}</strong
          ><small>{{ $t('Record execution, evidence and notes') }}</small>
        </div>
      </button>
    </div>

    <DrillTimelineEditor
      v-if="editorMode"
      :key="editorMode"
      :mode="editorMode"
      :drill-id="drill.id"
      :project-id="projectId"
      :actions="displayedActions"
      :actions-loading="actionsLoading"
      :actions-error="actionsError"
      @saved="saved"
    />

    <div
      v-else-if="
        (plansLoading && !displayedPlans.length) || (actionsLoading && !displayedActions.length)
      "
      class="loading-plans"
    >
      {{ $t('Loading drill timeline...') }}
    </div>

    <p
      v-else-if="actionsError && !displayedPlans.length && !displayedActions.length"
      class="timeline-error"
    >
      {{ actionsError }}
    </p>

    <section v-else-if="displayedPlans.length || displayedActions.length" class="saved-timelines">
      <div v-if="displayedPlans.length" class="saved-timeline-group">
        <div class="saved-title">
          <span>01</span>
          <div>
            <h3>{{ $t('Planning timeline') }}</h3>
            <p>{{ displayedPlans.length }} {{ $t('entries') }}</p>
          </div>
        </div>
        <article
          v-for="(item, index) in displayedPlans"
          :key="`planning-${item.id}-${index}`"
          class="saved-entry"
        >
          <span>{{ index + 1 }}</span>
          <div>
            <!-- {{ item.date }} · -->
            <small> {{ item.time }}</small>
            <p>{{ item.description }}</p>
          </div>
          <button
            class="saved-entry-delete"
            type="button"
            :aria-label="$t('Delete')"
            @click.stop="requestDelete('plan', item.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" stroke="currentColor" />
              <path d="M10 11v5M14 11v5" stroke="currentColor" />
            </svg>
          </button>
        </article>
      </div>
      <div v-if="displayedActions.length" class="saved-timeline-group">
        <div class="saved-title">
          <span>02</span>
          <div>
            <h3>{{ $t('Action timeline') }}</h3>
            <p>{{ displayedActions.length }} {{ $t('entries') }}</p>
          </div>
        </div>
        <article
          v-for="(item, index) in displayedActions"
          :key="`action-${item.id}-${index}`"
          class="saved-entry"
        >
          <span>{{ index + 1 }}</span>
          <div>
            <small
              >{{ item.date }} · {{ item.time
              }}<template v-if="item.photographerName">
                · {{ item.photographerName }}</template
              ></small
            >
            <p>{{ item.description }}</p>
            <em v-if="item.notes">{{ item.notes }}</em>
            <div v-if="item.images.length" class="saved-images">
              <img
                v-for="image in item.images"
                :key="image"
                :src="image.url"
                :alt="$t('Drill evidence')"
              />
            </div>
          </div>
          <button
            class="saved-entry-delete"
            type="button"
            :aria-label="$t('Delete')"
            @click.stop="requestDelete('action', item.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" stroke="currentColor" />
              <path d="M10 11v5M14 11v5" stroke="currentColor" />
            </svg>
          </button>
        </article>
      </div>
    </section>
    <div v-else class="empty-workflow">
      <strong>{{ $t('No planning or actions yet') }}</strong>
      <p>{{ $t('Use the buttons above to build the drill workflow.') }}</p>
    </div>
  </Dialog>

  <Dialog
    :class="{ 'hse-project-overview-overlay': overviewPresentation }"
    data-hse-project
    :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
    v-model:visible="deleteDialogVisible"
    modal
    :closable="!deleting"
    :dismissable-mask="!deleting"
    :draggable="false"
    class="hse-project-root hse-project-overlay drill-delete-dialog hse-project-planning"
  >
    <template #container>
      <div class="delete-dialog-content">
        <span class="delete-visual">
          <img src="@/assets/images/delete-bin-full.png" :alt="$t('Delete')" />
        </span>
        <span class="delete-kicker">{{ $t('Confirmation required') }}</span>
        <h4>
          {{
            pendingDelete?.type === 'plan'
              ? $t('Are you sure you want to delete this plan?')
              : $t('Are you sure you want to delete this action?')
          }}
        </h4>
        <p>{{ $t('This operation cannot be undone.') }}</p>
        <div class="hse-project-form-footer delete-dialog-actions">
          <button class="confirm-delete" type="button" :disabled="deleting" @click="confirmDelete">
            {{ deleting ? $t('Deleting...') : $t('Delete') }}
          </button>
          <button
            class="cancel-delete"
            type="button"
            :disabled="deleting"
            @click="deleteDialogVisible = false"
          >
            {{ $t('Cancel') }}
          </button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.drill-card {
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: 5px 1fr auto auto;
  align-items: center;
  gap: 13px;
  overflow: hidden;
  padding: 13px;
  border: 1px solid var(--hse-project-line);
  border-radius: 16px;
  text-align: start;
  cursor: pointer;
  background: var(--hse-project-surface-soft);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.drill-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--hse-project-blue) 45%, var(--hse-project-line));
  box-shadow: 0 12px 28px color-mix(in srgb, var(--hse-project-navy) 9%, transparent);
}
.drill-card-accent {
  align-self: stretch;
  border-radius: 9px;
  background: linear-gradient(var(--hse-project-blue), var(--hse-project-blue));
}
.drill-card-main {
  display: flex;
  flex-direction: column;
}
.drill-card-kicker {
  color: var(--hse-project-blue);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}
.drill-card-main strong {
  color: var(--hse-project-ink);
}
.drill-card-main small {
  margin-top: 3px;
  color: var(--hse-project-muted);
}
.drill-card-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--hse-project-muted);
  background: var(--hse-project-surface);
  font-size: 0.75rem;
}
.drill-card-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--hse-project-green);
}
.drill-card-arrow {
  color: var(--hse-project-blue);
  font-size: 1.2rem;
}
.details-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}
.details-heading > span {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 15px;
  color: white;
  background: linear-gradient(145deg, var(--hse-project-blue), var(--hse-project-blue));
  font-family: var(--hse-project-font);
  font-weight: 700;
}
.details-heading small {
  color: var(--hse-project-blue);
  font-weight: 900;
  text-transform: uppercase;
}
.details-heading h2 {
  margin: 1px 0;
  color: var(--hse-project-ink);
}
.details-heading p {
  margin: 0;
  color: var(--hse-project-muted);
}
.drill-detail-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.drill-detail-summary > div {
  padding: 12px;
  border: 1px solid var(--hse-project-line);
  border-radius: 13px;
  background: var(--hse-project-surface-soft);
}
.drill-detail-summary span,
.drill-detail-copy span {
  display: block;
  color: var(--hse-project-muted);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}
.drill-detail-summary strong {
  display: block;
  margin-top: 4px;
  color: var(--hse-project-ink);
  font-size: 0.76rem;
}
.drill-detail-copy {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}
.drill-detail-copy article {
  padding: 12px;
  border-radius: 13px;
  background: color-mix(in srgb, var(--hse-project-blue) 4%, var(--hse-project-surface-soft));
}
.drill-detail-copy p {
  margin: 5px 0 0;
  color: var(--hse-project-ink);
  font-size: 0.75rem;
  line-height: 1.5;
}
.drill-workflow-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0;
}
.drill-workflow-actions button {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 20%, var(--hse-project-line));
  border-radius: 15px;
  text-align: start;
  cursor: pointer;
  background: var(--hse-project-surface-soft);
}
.drill-workflow-actions button.active {
  border-color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 7%, var(--hse-project-surface-soft));
}
.drill-workflow-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.drill-workflow-actions button > span {
  display: grid;
  width: 35px;
  height: 35px;
  place-items: center;
  border-radius: 11px;
  color: white;
  background: var(--hse-project-blue);
  font-family: var(--hse-project-font);
  font-weight: 700;
}
.drill-workflow-actions strong,
.drill-workflow-actions small {
  display: block;
}
.drill-workflow-actions strong {
  color: var(--hse-project-ink);
}
.drill-workflow-actions small {
  margin-top: 2px;
  color: var(--hse-project-muted);
}
.saved-timelines {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.saved-timeline-group {
  padding: 14px;
  border: 1px solid var(--hse-project-line);
  border-radius: 16px;
  background: var(--hse-project-surface-soft);
}
.saved-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}
.saved-title > span {
  display: grid;
  width: 33px;
  height: 33px;
  place-items: center;
  border-radius: 10px;
  color: white;
  background: var(--hse-project-blue);
}
.saved-title h3,
.saved-title p {
  margin: 0;
}
.saved-title h3 {
  color: var(--hse-project-ink);
  font-size: 0.84rem;
}
.saved-title p {
  color: var(--hse-project-muted);
  font-size: 0.75rem;
}
.saved-entry {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  gap: 9px;
  padding: 9px 0;
  border-top: 1px solid var(--hse-project-line);
}
.saved-entry-delete {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  padding: 6px;
  border: 1px solid color-mix(in srgb, var(--hse-project-red) 22%, transparent);
  border-radius: 9px;
  color: var(--hse-project-red);
  background: color-mix(in srgb, var(--hse-project-red) 7%, var(--hse-project-surface));
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}
.saved-entry-delete:hover {
  border-color: var(--hse-project-red);
  background: color-mix(in srgb, var(--hse-project-red) 12%, var(--hse-project-surface));
}
.saved-entry-delete svg {
  width: 17px;
  height: 17px;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.saved-entry > span {
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 50%;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 10%, transparent);
  font-size: 0.75rem;
  font-weight: 900;
}
.saved-entry small {
  color: var(--hse-project-blue);
}
.saved-entry p {
  margin: 3px 0;
  color: var(--hse-project-ink);
  font-size: 0.75rem;
}
.saved-entry em {
  color: var(--hse-project-muted);
  font-size: 0.75rem;
}
.saved-images {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 7px;
}
.saved-images img {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  object-fit: cover;
}
.loading-plans {
  padding: 24px;
  color: var(--hse-project-muted);
  text-align: center;
}
.timeline-error {
  margin: 0;
  padding: 16px;
  color: var(--hse-project-red);
  text-align: center;
}
.empty-workflow {
  padding: 24px;
  border: 1px dashed var(--hse-project-line);
  border-radius: 16px;
  text-align: center;
  background: var(--hse-project-surface-soft);
}
.empty-workflow strong {
  color: var(--hse-project-ink);
}
.empty-workflow p {
  margin: 4px 0 0;
  color: var(--hse-project-muted);
}
.delete-dialog-content {
  display: flex;
  align-items: center;
  width: min(390px, calc(100vw - 32px));
  flex-direction: column;
  padding: 26px;
  border-radius: 22px;
  background: var(--hse-project-surface);
  text-align: center;
}
.delete-visual {
  display: grid;
  width: 84px;
  height: 84px;
  margin-bottom: 12px;
  place-items: center;
  border-radius: 24px;
  background: color-mix(in srgb, var(--hse-project-red) 7%, var(--hse-project-surface-soft));
}
.delete-visual img {
  width: 62px;
  height: 62px;
  object-fit: contain;
}
.delete-kicker {
  color: var(--hse-project-red);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.delete-dialog-content h4 {
  margin: 7px 0 5px;
  color: var(--hse-project-ink);
}
.delete-dialog-content p {
  margin: 0 0 18px;
  color: var(--hse-project-muted);
  font-size: 0.75rem;
}
.delete-dialog-actions {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}
.delete-dialog-actions button {
  min-height: 42px;
  border-radius: 11px;
  font-weight: 800;
  cursor: pointer;
}
.delete-dialog-actions button:disabled {
  opacity: 0.55;
  cursor: wait;
}
.confirm-delete {
  border: 1px solid var(--hse-project-red);
  color: white;
  background: var(--hse-project-red);
}
.cancel-delete {
  border: 1px solid var(--hse-project-line);
  color: var(--hse-project-ink);
  background: var(--hse-project-surface-soft);
}
@media (max-width: 760px) {
  .drill-detail-summary,
  .drill-detail-copy,
  .saved-timelines {
    grid-template-columns: 1fr 1fr;
  }
  .drill-workflow-actions {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .drill-detail-summary,
  .drill-detail-copy,
  .saved-timelines {
    grid-template-columns: 1fr;
  }
  .drill-card {
    grid-template-columns: 5px 1fr auto;
  }
  .drill-card-status {
    display: none;
  }
}
</style>
