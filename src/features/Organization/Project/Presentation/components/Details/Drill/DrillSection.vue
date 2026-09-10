<script setup lang="ts">
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
  emit('updated')
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
</script>

<template>
  <section class="project-drill-section">
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
      <article v-for="group in teamGroups" :key="group.title" class="drill-team-group">
        <div class="drill-team-header">
          <div>
            <span>{{ $t('Responsible team') }}</span>
            <!-- <h3>{{ group.title }}</h3> -->
          </div>
          <strong
            >{{ group.drills.length
            }}<small>{{ group.drills.length === 1 ? $t('drill') : $t('drills') }}</small></strong
          >
        </div>
        <div class="drill-cards">
          <DrillDetailsDialog
            v-for="drill in group.drills"
            :key="drill.id"
            :drill="drill"
            :project-id="projectId"
            :plans="plansByDrillId[drill.id]"
            :plans-loading="loadingPlansByDrillId[drill.id] ?? false"
            @opened="fetchDrillPlans(drill.id)"
            @saved="handleDrillSaved(drill.id)"
          />
        </div>
      </article>
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
.project-drill-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  margin-top: 18px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 27px;
  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--PrimaryColor) 5%, transparent),
      transparent 52%
    ),
    var(--surface-2);
  box-shadow: 0 22px 55px color-mix(in srgb, var(--brand-primary-900) 9%, transparent);
}
.drill-section-glow {
  position: absolute;
  z-index: -1;
  top: -110px;
  inset-inline-end: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor) 13%, transparent);
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
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
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
  color: var(--PrimaryColor);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.drill-section-title h2 {
  margin: 2px 0;
  color: var(--text-strong);
  font: 1.18rem 'Bold';
}
.drill-section-title p {
  max-width: 610px;
  margin: 0;
  color: var(--text-soft);
  font-size: 0.7rem;
  line-height: 1.5;
}
.drill-team-groups {
  display: grid;
  gap: 13px;
  margin-top: 17px;
}
.drill-team-group {
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 19px;
  background: color-mix(in srgb, var(--surface-1) 88%, transparent);
}
.drill-team-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;
}
.drill-team-header span {
  color: var(--PrimaryColor);
  font-size: 0.59rem;
  font-weight: 900;
  text-transform: uppercase;
}
.drill-team-header h3 {
  margin: 2px 0 0;
  color: var(--text-strong);
  font-size: 0.9rem;
}
.drill-team-header > strong {
  display: flex;
  align-items: baseline;
  gap: 5px;
  color: var(--PrimaryColor);
  font-size: 1.15rem;
}
.drill-team-header strong small {
  color: var(--text-soft);
  font-size: 0.6rem;
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
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 32%, var(--main-border));
  border-radius: 17px;
  background: color-mix(in srgb, var(--PrimaryColor) 4%, transparent);
}
.drill-empty-state > span {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 14px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 11%, transparent);
  font: 0.7rem 'Bold';
}
.drill-empty-state h3 {
  margin: 0;
  color: var(--text-strong);
  font-size: 0.86rem;
}
.drill-empty-state p {
  margin: 3px 0 0;
  color: var(--text-soft);
  font-size: 0.68rem;
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
