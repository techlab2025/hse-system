<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  DataFailed,
  DataLoading,
  DataSuccess,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import GetTodayTalkParams from '../../../Core/params/TodayTalk/GetTodayTalkParams'
import GetTodayTalkController from '../../controllers/TodayTalk/GetTodayTalkController'
import IndexProjectController from '../../controllers/indexProjectController'
import IndexProjectParams from '../../../Core/params/indexProjectParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import TitleInterface from '@/base/Data/Models/title_interface'

const controller = GetTodayTalkController.getInstance()
const projectController = IndexProjectController.getInstance()
const state = computed(() => controller.state.value)
const talks = computed(() => (state.value instanceof DataSuccess ? state.value.data ?? [] : []))
const projects = computed(() => projectController.state.value.data ?? [])
const isLoading = computed(() => state.value instanceof DataLoading)
const isFailed = computed(() => state.value instanceof DataFailed)
const projectParams = new IndexProjectParams('', 1, 100, 1)
const assignmentOptions = [
  new TitleInterface({ id: -1, title: 'All talks' }),
  new TitleInterface({ id: 1, title: 'Assigned to project' }),
  new TitleInterface({ id: 0, title: 'Not assigned to project' }),
]
const selectedProject = ref<TitleInterface | null>(null)
const selectedAssignment = ref<TitleInterface | null>(assignmentOptions[0] ?? null)

const projectNames = computed(
  () => new Map(projects.value.map((project) => [Number(project.id), project.title])),
)

const fetchTalks = async () => {
  const assignmentId = selectedAssignment.value?.id
  const isAssigned = assignmentId === -1 || assignmentId == null ? undefined : assignmentId === 1
  await controller.getTodayTalk(
    new GetTodayTalkParams(selectedProject.value?.id, isAssigned),
  )
}

const resetFilters = () => {
  selectedProject.value = null
  selectedAssignment.value = assignmentOptions[0] ?? null
}

const setSelectedProject = (value: TitleInterface | TitleInterface[] | null) => {
  selectedProject.value = Array.isArray(value) ? null : value
}

const setSelectedAssignment = (value: TitleInterface | TitleInterface[] | null) => {
  selectedAssignment.value = Array.isArray(value) ? null : value
}

const attendingCount = (employees: { isAttend: boolean }[]) =>
  employees.filter((employee) => employee.isAttend).length

const formatDate = (date: string) => {
  if (!date) return 'Date not provided'
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? date
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(parsed)
}

watch([selectedProject, selectedAssignment], fetchTalks)

onMounted(fetchTalks)
</script>

<template>
  <main class="talks-page">
    <header class="talks-header">
      <div>
        <span class="eyebrow">Daily safety conversations</span>
        <h1>Today Talks</h1>
        <p>Review organization and project briefings, attendance, dates, and times.</p>
      </div>
      <RouterLink to="/organization/today-talks/create" class="btn btn-primary">
        <span aria-hidden="true">+</span> Add today talk
      </RouterLink>
    </header>

    <section class="filters" aria-label="Today talk filters">
      <UpdatedCustomInputSelect
        id="today-talk-project-filter"
        class="filter-select"
        :model-value="selectedProject"
        :controller="projectController"
        :params="projectParams"
        :reload="false"
        label="Project"
        placeholder="All projects"
        @update:model-value="setSelectedProject"
      />
      <UpdatedCustomInputSelect
        id="today-talk-assignment-filter"
        class="filter-select"
        :model-value="selectedAssignment"
        :static-options="assignmentOptions"
        :reload="false"
        label="Assignment"
        placeholder="All talks"
        @update:model-value="setSelectedAssignment"
      />
      <button type="button" class="reset-button" @click="resetFilters">Reset filters</button>
    </section>

    <section v-if="isLoading" class="talk-grid" aria-live="polite">
      <div v-for="index in 6" :key="index" class="talk-card skeleton"></div>
    </section>

    <section v-else-if="talks.length" class="talk-grid">
      <article v-for="talk in talks" :key="talk.id" class="talk-card">
        <div class="card-topline">
          <span :class="['assignment-badge', { organization: !talk.projectId }]">
            {{ talk.projectId ? projectNames.get(talk.projectId) || `Project #${talk.projectId}` : 'Organization' }}
          </span>
          <span>{{ formatDate(talk.date) }} · {{ talk.time || 'No time' }}</span>
        </div>
        <p class="talk-content">{{ talk.content }}</p>
        <footer>
          <div>
            <strong>{{ attendingCount(talk.employees) }}</strong>
            <span>of {{ talk.employees.length }} attended</span>
          </div>
          <div class="employee-dots" :aria-label="`${talk.employees.length} employees`">
            <i
              v-for="employee in talk.employees.slice(0, 8)"
              :key="employee.id || employee.organizationEmployeeId"
              :class="{ attended: employee.isAttend }"
              :title="employee.title || `Employee #${employee.organizationEmployeeId}`"
            ></i>
            <small v-if="talk.employees.length > 8">+{{ talk.employees.length - 8 }}</small>
          </div>
        </footer>
      </article>
    </section>

    <section v-else class="empty-state">
      <span aria-hidden="true">💬</span>
      <h2>{{ isFailed ? 'Today talks could not be loaded' : 'No today talks found' }}</h2>
      <p>
        {{ isFailed ? 'Please retry loading the talks.' : 'Change the filters or record a new daily safety conversation.' }}
      </p>
      <!-- <button v-if="isFailed" type="button" class="btn btn-primary" @click="fetchTalks">Retry</button> -->
    </section>
  </main>
</template>

<style scoped lang="scss">
.talks-page { display: grid; gap: 18px; margin: 18px auto 40px; }
.talks-header,
.filters,
.talk-card,
.empty-state { border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border)); background: var(--surface-1); }
.talks-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: clamp(20px, 3vw, 32px); border-radius: 24px; background: radial-gradient(circle at 88% 0, color-mix(in srgb, var(--PrimaryColor) 18%, transparent), transparent 36%), var(--surface-1); }
.eyebrow { color: var(--PrimaryColor); font-size: .7rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
h1 { margin: 5px 0 7px; color: var(--text-strong); font-size: clamp(1.55rem, 3vw, 2.25rem); }
.talks-header p,
.empty-state p { margin: 0; color: var(--text-soft); }
.talks-header .btn { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
.filters { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)) auto; align-items: end; gap: 14px; padding: 18px; border-radius: 17px; }
.filter-select { min-width: 0; }
.reset-button { min-height: 41px; padding: 8px 14px; border: 1px solid var(--main-border); border-radius: 10px; color: var(--text-strong); background: var(--surface-2); font-weight: 800; cursor: pointer; }
.talk-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px; }
.talk-card { min-height: 220px; padding: 19px; border-radius: 18px; box-shadow: 0 13px 30px color-mix(in srgb, var(--brand-primary-900) 7%, transparent); }
.card-topline,
.talk-card footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.card-topline > span:last-child { color: var(--text-soft); font-size: .7rem; text-align: end; }
.assignment-badge { overflow: hidden; max-width: 55%; padding: 5px 9px; border-radius: 999px; color: var(--PrimaryColor); background: color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1)); font-size: .7rem; font-weight: 900; text-overflow: ellipsis; white-space: nowrap; }
.assignment-badge.organization { color: var(--text-soft); background: var(--surface-3); }
.talk-content { min-height: 92px; margin: 17px 0; color: var(--text-strong); line-height: 1.65; white-space: pre-wrap; }
.talk-card footer { padding-top: 14px; border-top: 1px solid var(--main-border); }
.talk-card footer > div:first-child { display: flex; align-items: baseline; gap: 5px; }
.talk-card footer strong { color: var(--PrimaryColor); font-size: 1.25rem; }
.talk-card footer span { color: var(--text-soft); font-size: .72rem; }
.employee-dots { display: flex; align-items: center; gap: 4px; }
.employee-dots i { width: 9px; height: 9px; border-radius: 50%; background: var(--main-border); }
.employee-dots i.attended { background: var(--PrimaryColor); }
.employee-dots small { color: var(--text-soft); font-size: .68rem; }
.skeleton { border: 0; background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-2)); animation: pulse 1.1s ease-in-out infinite alternate; }
.empty-state { padding: 60px 20px; border-radius: 20px; text-align: center; }
.empty-state > span { font-size: 2rem; }
.empty-state h2 { margin: 12px 0 7px; color: var(--text-strong); }
.empty-state .btn { margin-top: 17px; }
@keyframes pulse { to { opacity: .45; } }
@media (max-width: 1050px) { .talk-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px) {
  .talks-header { align-items: flex-start; flex-direction: column; }
  .filters { grid-template-columns: 1fr; }
  .talk-grid { grid-template-columns: 1fr; }
}
</style>
