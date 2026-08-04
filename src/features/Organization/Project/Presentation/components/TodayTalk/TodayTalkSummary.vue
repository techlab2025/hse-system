<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { DataLoading, DataSuccess } from '@/base/core/networkStructure/Resources/dataState/data_state'
import GetTodayTalkParams from '../../../Core/params/TodayTalk/GetTodayTalkParams'
import GetTodayTalkController from '../../controllers/TodayTalk/GetTodayTalkController'

const route = useRoute()
const controller = GetTodayTalkController.getInstance()
const state = computed(() => controller.state.value)
const talk = computed(() => (state.value instanceof DataSuccess ? state.value.data : null))
const isLoading = computed(() => state.value instanceof DataLoading)
const attendingCount = computed(
  () => talk.value?.employees.filter((employee) => employee.isAttend).length ?? 0,
)
const employeeTitle = (title: string, organizationEmployeeId: number) =>
  title || `Employee #${organizationEmployeeId}`

const projectId = computed(() => Number(route.params.id))
const createRoute = computed(() => `/organization/project-details/${projectId.value}/today-talk/create`)

const formatDate = (date: string) => {
  if (!date) return 'Today'
  const parsedDate = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return date
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate)
}

const fetchTodayTalk = async () => {
  if (!Number.isFinite(projectId.value) || projectId.value <= 0) return
  await controller.getTodayTalk(new GetTodayTalkParams(projectId.value))
}

watch(projectId, fetchTodayTalk, { immediate: true })
</script>

<template>
  <section class="today-talk-card" aria-labelledby="today-talk-title">
    <div class="talk-accent" aria-hidden="true"></div>

    <div v-if="isLoading" class="talk-loading" aria-live="polite">
      <span class="loading-orb"></span>
      <div>
        <span></span>
        <span></span>
      </div>
    </div>

    <template v-else-if="talk">
      <header class="talk-header">
        <div class="talk-heading">
          <span class="talk-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 5h16v11H8l-4 3V5Z" />
              <path d="M8 9h8M8 12h5" />
            </svg>
          </span>
          <div>
            <span class="talk-kicker">Daily safety conversation</span>
            <h2 id="today-talk-title">Today’s Talk</h2>
          </div>
        </div>
        <div class="talk-date">
          <strong>{{ formatDate(talk.date) }}</strong>
          <span>{{ talk.time || 'Time not provided' }}</span>
        </div>
      </header>

      <p class="talk-content">{{ talk.content }}</p>

      <footer class="talk-footer">
        <div class="attendance-summary">
          <span class="attendance-ring">{{ attendingCount }}</span>
          <div>
            <strong>{{ attendingCount }} of {{ talk.employees.length }} attended</strong>
            <span>Attendance captured for today’s briefing</span>
          </div>
        </div>
        <div class="employee-pills" aria-label="Today talk attendance">
          <span
            v-for="employee in talk.employees.slice(0, 6)"
            :key="employee.id || employee.organizationEmployeeId"
            :class="{ attended: employee.isAttend }"
            :title="`${employeeTitle(employee.title, employee.organizationEmployeeId)}: ${employee.isAttend ? 'Attended' : 'Absent'}`"
          >
            <i aria-hidden="true"></i>
            {{ employeeTitle(employee.title, employee.organizationEmployeeId) }}
          </span>
          <small v-if="talk.employees.length > 6">+{{ talk.employees.length - 6 }}</small>
        </div>
      </footer>
    </template>

    <div v-else class="talk-empty">
      <div class="empty-copy">
        <span class="talk-kicker">Start the day aligned</span>
        <h2 id="today-talk-title">No talk recorded today</h2>
        <p>
          Gather the project team, capture the discussion, and record who attended the briefing.
        </p>
      </div>
      <div class="empty-action">
        <span aria-hidden="true">+</span>
        <RouterLink :to="createRoute" class="btn btn-primary">Create today’s talk</RouterLink>
        <button type="button" class="retry-button" @click="fetchTodayTalk">Check again</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.today-talk-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 190px;
  margin: 14px 0;
  padding: clamp(18px, 2.5vw, 28px);
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 24px;
  background:
    radial-gradient(circle at 92% 8%, color-mix(in srgb, var(--PrimaryColor) 17%, transparent), transparent 34%),
    linear-gradient(135deg, var(--surface-1), color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-2)));
  box-shadow: 0 18px 42px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.talk-accent {
  position: absolute;
  z-index: -1;
  inset: 0 auto 0 0;
  width: 5px;
  background: linear-gradient(var(--PrimaryColor), var(--brand-primary-400));
}

.talk-header,
.talk-footer,
.talk-empty,
.attendance-summary,
.talk-heading,
.empty-action {
  display: flex;
  align-items: center;
}

.talk-header,
.talk-footer,
.talk-empty {
  justify-content: space-between;
  gap: 20px;
}

.talk-heading,
.attendance-summary {
  gap: 12px;
}

.talk-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 15px;
  color: var(--text-on-brand);
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 10px 24px color-mix(in srgb, var(--PrimaryColor) 28%, transparent);
}

.talk-icon svg {
  width: 25px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.talk-kicker {
  color: var(--PrimaryColor);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h2 {
  margin: 3px 0 0;
  color: var(--text-strong);
  font-size: clamp(1.2rem, 2vw, 1.55rem);
}

.talk-date {
  display: flex;
  flex-direction: column;
  text-align: end;
  color: var(--text-strong);
}

.talk-date span,
.attendance-summary span,
.talk-empty p {
  color: var(--text-soft);
  font-size: 0.82rem;
}

.talk-content {
  margin: 22px 0;
  padding: 17px 18px;
  border-inline-start: 3px solid color-mix(in srgb, var(--PrimaryColor) 62%, transparent);
  border-radius: 0 13px 13px 0;
  color: var(--text-strong);
  background: color-mix(in srgb, var(--surface-1) 76%, transparent);
  line-height: 1.7;
  white-space: pre-wrap;
}

.attendance-ring {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 4px solid color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  border-top-color: var(--PrimaryColor);
  border-radius: 50%;
  color: var(--PrimaryColor) !important;
  font-weight: 900;
}

.attendance-summary div {
  display: flex;
  flex-direction: column;
}

.employee-pills {
  display: flex;
  align-items: center;
}

.employee-pills span,
.employee-pills small {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 6px;
  margin-inline-start: 6px;
  padding: 5px 9px;
  border: 1px solid var(--main-border);
  border-radius: 999px;
  color: var(--text-soft);
  background: var(--surface-3);
  font-size: 0.72rem;
  font-weight: 800;
}

.employee-pills .attended {
  color: var(--PrimaryColor);
  border-color: color-mix(in srgb, var(--PrimaryColor) 35%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1));
}

.employee-pills i {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: var(--text-soft);
}

.employee-pills .attended i {
  background: var(--PrimaryColor);
}

.talk-empty {
  min-height: 135px;
}

.empty-copy {
  max-width: 650px;
}

.talk-empty p {
  margin: 9px 0 0;
  line-height: 1.6;
}

.empty-action {
  flex-direction: column;
  gap: 8px;
}

.empty-action > span {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px dashed var(--PrimaryColor);
  border-radius: 50%;
  color: var(--PrimaryColor);
  font-size: 1.6rem;
}

.retry-button {
  border: 0;
  color: var(--text-soft);
  background: transparent;
  font-size: 0.75rem;
  cursor: pointer;
}

.talk-loading {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 135px;
}

.loading-orb,
.talk-loading div span {
  display: block;
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-3));
  animation: pulse 1.3s ease-in-out infinite alternate;
}

.loading-orb { width: 54px; height: 54px; border-radius: 50%; }
.talk-loading div { flex: 1; }
.talk-loading div span:first-child { width: 34%; height: 17px; margin-bottom: 12px; }
.talk-loading div span:last-child { width: 72%; height: 44px; }

@keyframes pulse { to { opacity: 0.42; } }

@media (max-width: 700px) {
  .talk-header,
  .talk-footer,
  .talk-empty { align-items: flex-start; flex-direction: column; }
  .talk-date { text-align: start; }
  .empty-action { align-items: flex-start; }
  .employee-pills { flex-wrap: wrap; }
}
</style>
