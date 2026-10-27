<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

import { computed, ref } from 'vue'
import type DrillModel from '@/features/Organization/Project/Data/models/Drill/DrillModel'
import type DrillTimelineItemModel from '@/features/Organization/Project/Data/models/Drill/DrillTimelineItemModel'
import FetchDrillPlansParams from '@/features/Organization/Project/Core/params/Drill/FetchDrillPlansParams'
import FetchDrillPlansController from '@/features/Organization/Project/Presentation/controllers/Drill/FetchDrillPlansController'
import AddDrillDialog from '../../Dialogs/Drill/AddDrillDialog.vue'
import DrillDetailsDialog from '../../Dialogs/Drill/DrillDetailsDialog.vue'

const props = withDefaults(defineProps<{ projectId: number; drills?: DrillModel[] }>(), {
  drills: () => [],
})
const emit = defineEmits<{ (event: 'updated'): void }>()
const plansByDrillId = ref<Record<number, DrillTimelineItemModel[]>>({})
const loadingPlansByDrillId = ref<Record<number, boolean>>({})

const fetchDrillPlans = async (drillId: number) => {
  if (!drillId) return

  loadingPlansByDrillId.value[drillId] = true
  const controller = FetchDrillPlansController.getInstance()
  await controller.fetchPlans(new FetchDrillPlansParams(drillId))

  if (controller.isDataSuccess()) {
    plansByDrillId.value[drillId] = controller.state.value.data ?? []
  }

  loadingPlansByDrillId.value[drillId] = false
}

const handleDrillSaved = async (drillId: number) => {
  await fetchDrillPlans(drillId)
  // emit('updated')
}

const teamGroups = computed(() => {
  const groups = new Map<string, { title: string; drills: DrillModel[] }>()
  props.drills.forEach((drill) => {
    const key = String(drill.projectTeam.id || drill.projectTeam.title || 'unassigned')
    const current = groups.get(key) ?? {
      title: drill.projectTeam.title || 'Unassigned team',
      drills: [],
    }
    current.drills.push(drill)
    groups.set(key, current)
  })
  return [...groups.values()]
})
const showAllDrills = ref(false)

const displayedDrills = computed(() => {
  return showAllDrills.value ? props.drills : props.drills.slice(0, 5)
})

const toggleShowDrills = () => {
  showAllDrills.value = !showAllDrills.value
}
</script>

<template>
  <section
    data-hse-project
    v-project-panels
    class="hse-project-panel hse-project-root project-drill-section hse-project-planning"
  >
    <div class="drill-section-glow"></div>
    <header class="drill-section-header">
      <div class="drill-section-title">
        <span class="drill-section-symbol"><i></i><i></i><i></i></span>
        <div>
          <small>{{ $t('Emergency readiness') }}</small>
          <h2>{{ $t('Project Drills') }}</h2>
          <p>
            {{ $t('Plan, run and review emergency exercises with the responsible project teams.') }}
          </p>
        </div>
      </div>
      <AddDrillDialog
        :project-id="projectId"
        :compact="drills.length > 0"
        @saved="emit('updated')"
      />
    </header>

    <div v-if="teamGroups.length" class="drill-team-groups">
      <!-- <article v-for="group in teamGroups" :key="group.title" class="drill-team-group"> -->
      <div class="drill-team-header">
        <div>
          <!-- <span>{{ $t('Responsible team') }}</span> -->
          <!-- <h3>{{ group.title }}</h3> -->
        </div>
        <!-- <strong
            >{{ group.drills.length
            }}<small>{{ group.drills.length === 1 ? $t('drill') : $t('drills') }}</small></strong
          > -->
      </div>
      <div class="drill-cards">
        <DrillDetailsDialog
          v-for="drill in displayedDrills"
          :key="drill.id"
          :drill="drill"
          :project-id="projectId"
          :plans="plansByDrillId[drill.id]"
          :plans-loading="loadingPlansByDrillId[drill.id] ?? false"
          @opened="fetchDrillPlans(drill.id)"
          @saved="handleDrillSaved(drill.id)"
        />
      </div>
      <button
        v-if="drills.length > 5"
        type="button"
        class="hse-project-button show-more-btn"
        @click="toggleShowDrills"
      >
        {{ $t(showAllDrills ? 'Show Less' : 'Show More') }}
      </button>
      <!-- </article> -->
    </div>
    <div v-else class="drill-empty-state">
      <span>DR</span>
      <div>
        <h3>{{ $t('No drills have been added') }}</h3>
        <p>
          {{ $t('Create the first drill to start planning and tracking emergency readiness.') }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.show-more-btn {
  width: fit-content;
  margin: 12px auto 0;
  padding: 8px 18px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 25%, var(--hse-project-line));
  border-radius: 10px;
  background: color-mix(in srgb, var(--hse-project-blue) 7%, var(--hse-project-surface-soft));
  color: var(--hse-project-blue);
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.show-more-btn:hover {
  background: var(--hse-project-blue);
  color: white;
}
.project-drill-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  margin-top: 18px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--hse-project-blue) 18%, var(--hse-project-line));
  border-radius: 27px;
  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--hse-project-blue) 5%, transparent),
      transparent 52%
    ),
    var(--hse-project-surface-soft);
  box-shadow: 0 22px 55px color-mix(in srgb, var(--hse-project-navy) 9%, transparent);
}
.drill-section-glow {
  position: absolute;
  z-index: -1;
  top: -110px;
  inset-inline-end: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--hse-project-blue) 13%, transparent);
  filter: blur(35px);
}
.drill-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.drill-section-title {
  display: flex;
  align-items: center;
  gap: 13px;
}
.drill-section-symbol {
  display: grid;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: 4px;
  padding: 11px;
  border-radius: 16px;
  background: linear-gradient(145deg, var(--hse-project-blue), var(--hse-project-blue));
}
.drill-section-symbol i {
  display: block;
  border-radius: 4px;
  background: white;
}
.drill-section-symbol i:nth-child(1) {
  height: 45%;
}
.drill-section-symbol i:nth-child(2) {
  height: 85%;
}
.drill-section-symbol i:nth-child(3) {
  height: 65%;
}
.drill-section-title small {
  color: var(--hse-project-blue);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.drill-section-title h2 {
  margin: 2px 0;
  color: var(--hse-project-ink);
  font: 700 1.18rem var(--hse-project-font);
}
.drill-section-title p {
  max-width: 610px;
  margin: 0;
  color: var(--hse-project-muted);
  font-size: 0.75rem;
  line-height: 1.5;
}
.drill-team-groups {
  display: grid;
  gap: 13px;
  margin-top: 17px;
}
.drill-team-group {
  padding: 14px;
  border: 1px solid var(--hse-project-line);
  border-radius: 19px;
  background: color-mix(in srgb, var(--hse-project-surface) 88%, transparent);
}
.drill-team-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;
}
.drill-team-header span {
  color: var(--hse-project-blue);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}
.drill-team-header h3 {
  margin: 2px 0 0;
  color: var(--hse-project-ink);
  font-size: 0.9rem;
}
.drill-team-header > strong {
  display: flex;
  align-items: baseline;
  gap: 5px;
  color: var(--hse-project-blue);
  font-size: 1.15rem;
}
.drill-team-header strong small {
  color: var(--hse-project-muted);
  font-size: 0.75rem;
  font-weight: 700;
}
.drill-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.drill-empty-state {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 17px;
  padding: 16px;
  border: 1px dashed color-mix(in srgb, var(--hse-project-blue) 32%, var(--hse-project-line));
  border-radius: 17px;
  background: color-mix(in srgb, var(--hse-project-blue) 4%, transparent);
}
.drill-empty-state > span {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 14px;
  color: var(--hse-project-blue);
  background: color-mix(in srgb, var(--hse-project-blue) 11%, transparent);
  font: 700 0.7rem var(--hse-project-font);
}
.drill-empty-state h3 {
  margin: 0;
  color: var(--hse-project-ink);
  font-size: 0.86rem;
}
.drill-empty-state p {
  margin: 3px 0 0;
  color: var(--hse-project-muted);
  font-size: 0.75rem;
}
@media (max-width: 780px) {
  .drill-section-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .drill-cards {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 620px) {
  .project-drill-section {
    padding: 12px;
    border-radius: 20px;
  }
  .drill-section-title {
    align-items: flex-start;
  }
}
</style>
