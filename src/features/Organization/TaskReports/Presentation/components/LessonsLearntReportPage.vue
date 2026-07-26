<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { DataSuccess } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { debounce } from '@/base/Presentation/utils/debouced'
import { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import Search from '@/shared/icons/Search.vue'
import FetchTaskReportParams from '../../Core/params/FetchTaskReportParams'
import LessonsLearntController from '../controllers/LessonsLearntController'

const controller = LessonsLearntController.getInstance()
const state = ref(controller.state.value)
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)

const lessons = computed(() => (state.value instanceof DataSuccess ? (state.value.data ?? []) : []))

// const summary = computed(() => ({
//   visible: lessons.value.length,
//   incidents: lessons.value.filter(
//     (item) => Number(item.observation?.type) === Observation.AccidentsType,
//   ).length,
//   observations: lessons.value.filter(
//     (item) => Number(item.observation?.type) !== Observation.AccidentsType,
//   ).length,
//   projects: new Set(
//     lessons.value
//       .map((item) => item.observation?.project?.id ?? item.observation?.project?.title)
//       .filter(Boolean),
//   ).size,
// }))

const fetchLessons = async (
  query: string = word.value,
  page: number = currentPage.value,
  limit: number = countPerPage.value,
) => {
  await controller.fetch(new FetchTaskReportParams(query, page, limit, 1))
}

const searchLessons = debounce(() => {
  currentPage.value = 1
  fetchLessons(word.value, 1)
})

const clearSearch = () => {
  word.value = ''
  currentPage.value = 1
  fetchLessons('', 1)
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchLessons(word.value, page)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  currentPage.value = 1
  fetchLessons(word.value, 1, count)
}

const observationType = (type: number) => {
  if (type === Observation.AccidentsType) return 'Incident'
  if (type === Observation.HazardType) return 'Hazard'
  return 'Observation'
}

const riskLabel = (riskLevel: number) => {
  if (riskLevel === 3) return 'High risk'
  if (riskLevel === 2) return 'Medium risk'
  if (riskLevel === 1) return 'Low risk'
  return 'Not rated'
}

const observationLink = (id: number, type: number) =>
  type === Observation.AccidentsType
    ? `/organization/equipment-mangement/incedant/show/${id}`
    : `/organization/equipment-mangement/observation/show/${id}`

watch(
  () => controller.state.value,
  (newState) => {
    state.value = newState
  },
  { deep: true },
)

onMounted(() => fetchLessons())
</script>

<template>
  <main class="lessons-report-page">
    <section class="lessons-hero">
      <div class="hero-copy">
        <span class="eyebrow">Organizational knowledge</span>
        <h1>Lessons learnt report</h1>
        <p>
          Turn observations and incidents into knowledge that helps every team make safer decisions.
        </p>
      </div>

      <div class="knowledge-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path
            d="M21 48h22M24 54h16"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M19 27a13 13 0 1 1 23 8c-3 3-4 5-4 8H26c0-3-1-5-4-8a13 13 0 0 1-3-8Z"
            stroke="currentColor"
            stroke-width="3"
          />
          <path
            d="M32 13v6m-10-2 4 5m16-5-4 5"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </section>

    <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]">
      <DataStatus :controller="state">
        <template #success>
          <!-- <section class="lessons-summary" aria-label="Current page summary">
            <article>
              <span>Visible lessons</span><strong>{{ summary.visible }}</strong>
            </article>
            <article>
              <span>Incidents</span><strong>{{ summary.incidents }}</strong>
            </article>
            <article>
              <span>Observations</span><strong>{{ summary.observations }}</strong>
            </article>
            <article>
              <span>Projects</span><strong>{{ summary.projects }}</strong>
            </article>
          </section> -->

          <section class="lessons-board">
            <header class="board-header">
              <div>
                <span class="eyebrow">Knowledge library</span>
                <h2>Lessons connected to field observations</h2>
                <p>Review the learning and its original operational context together.</p>
              </div>

              <label class="lessons-search">
                <Search aria-hidden="true" />
                <input
                  v-model="word"
                  type="search"
                  placeholder="Search lessons learnt"
                  @input="searchLessons"
                />
                <button v-if="word" type="button" aria-label="Clear search" @click="clearSearch">
                  ×
                </button>
              </label>
            </header>

            <div class="lessons-grid">
              <article
                v-for="(item, index) in lessons"
                :key="`${item.observation?.id ?? 'lesson'}-${index}`"
                class="lesson-card"
              >
                <div class="lesson-card-top">
                  <span class="lesson-number">{{ String(index + 1).padStart(2, '0') }}</span>
                  <div class="card-tags">
                    <span class="type-tag">{{ observationType(item.observation?.type) }}</span>
                    <span class="risk-tag" :class="`risk-${item.observation?.riskLevel}`">
                      {{ riskLabel(item.observation?.riskLevel) }}
                    </span>
                  </div>
                </div>

                <blockquote>
                  <span aria-hidden="true">“</span>
                  <p v-html="item.lesson_learnt || 'No lesson details provided.'"></p>
                </blockquote>

                <!-- <div class="observation-context">
                  <div
                    v-if="item.observation?.image || item.observation?.media?.[0]?.url"
                    class="context-image"
                  >
                    <img
                      :src="item.observation?.image || item.observation?.media?.[0]?.url"
                      :alt="item.observation?.title || 'Observation image'"
                    />
                  </div>

                  <div class="context-copy">
                    <span>Source observation</span>
                    <h3>{{ item.observation?.title || 'Untitled observation' }}</h3>
                    <p>{{ item.observation?.description || 'No description available.' }}</p>
                  </div>
                </div>

                <dl class="observation-meta">
                  <div>
                    <dt>Reference</dt>
                    <dd>{{ item.observation?.serialName || item.observation?.serial || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{{ item.observation?.date || item.observation?.createdAt || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt>Project</dt>
                    <dd>{{ item.observation?.project?.title || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt>Zone</dt>
                    <dd>{{ item.observation?.zoon?.title || 'N/A' }}</dd>
                  </div>
                </dl>

                <footer class="lesson-card-footer">
                  <div class="observer">
                    <span class="observer-avatar" aria-hidden="true">
                      {{ (item.observation?.observer?.name || 'U').charAt(0) }}
                    </span>
                    <span
                      ><small>Reported by</small
                      ><b>{{ item.observation?.observer?.name || 'Unknown' }}</b></span
                    >
                  </div>

                  <RouterLink
                    v-if="item.observation?.id"
                    class="view-source"
                    :to="observationLink(item.observation.id, item.observation.type)"
                  >
                    View source <span aria-hidden="true">→</span>
                  </RouterLink>
                </footer> -->
              </article>
            </div>
          </section>

          <Pagination
            :pagination="state.pagination"
            @change-page="handleChangePage"
            @count-per-page="handleCountPerPage"
          />
        </template>

        <template #loader>
          <section class="lessons-loading"><TableLoader :cols="2" :rows="6" /></section>
        </template>
        <template #initial>
          <section class="lessons-loading"><TableLoader :cols="2" :rows="6" /></section>
        </template>
        <template #empty>
          <DataEmpty
            title="No lessons learnt found"
            description="Lessons will appear here when they are recorded against observations."
            link="/organization"
            add-text="overview"
          />
        </template>
        <template #failed>
          <DataFailed
            title="Unable to load lessons learnt"
            description="The lessons learnt report could not be loaded. Please try again."
            link="/organization"
            add-text="overview"
          />
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          title="Permission required"
          description="You do not have permission to view this report."
          link="/organization"
          add-text="overview"
        />
      </template>
    </PermissionBuilder>
  </main>
</template>

<style scoped lang="scss">
.lessons-report-page {
  --lesson-tone: var(--identity-accent);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: clamp(0.75rem, 2vw, 1.5rem);
}

.lessons-report-page > :deep(div) {
  width: 100%;
}

.lessons-hero,
.lessons-board,
.lessons-loading {
  border: 1px solid color-mix(in srgb, var(--lesson-tone) 18%, var(--main-border));
  border-radius: 24px;
  background: var(--surface-1);
  box-shadow: 0 22px 52px color-mix(in srgb, var(--shadow-color) 38%, transparent);
}

.lessons-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 190px;
  padding: clamp(1.4rem, 4vw, 2.6rem);
  background:
    radial-gradient(
      circle at 88% 18%,
      color-mix(in srgb, var(--lesson-tone) 19%, transparent),
      transparent 31%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--lesson-tone) 8%, var(--surface-1)),
      var(--surface-1)
    );
}

.hero-copy {
  max-width: 760px;
}

.eyebrow {
  color: var(--lesson-tone);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-copy h1,
.board-header h2 {
  margin: 0.35rem 0 0;
  color: var(--text-strong);
  font-weight: 900;
  line-height: 1.15;
}

.hero-copy h1 {
  font-size: clamp(1.75rem, 3vw, 2.7rem);
  letter-spacing: -0.035em;
}

.hero-copy p,
.board-header p {
  margin: 0.65rem 0 0;
  color: var(--text-soft);
  line-height: 1.7;
}

.knowledge-mark {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: clamp(80px, 10vw, 116px);
  height: clamp(80px, 10vw, 116px);
  border: 1px solid color-mix(in srgb, var(--lesson-tone) 26%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--lesson-tone) 10%, var(--surface-1));
  color: var(--lesson-tone);
}

.knowledge-mark svg {
  width: 58%;
}

.lessons-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.lessons-summary article {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 90px;
  padding: 1rem;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: linear-gradient(145deg, var(--surface-1), var(--surface-2));
}

.lessons-summary article::after {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: var(--lesson-tone);
}

.lessons-summary span {
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 800;
}

.lessons-summary strong {
  color: var(--text-strong);
  font-size: 1.8rem;
  font-weight: 900;
}

.lessons-board {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: clamp(1rem, 2vw, 1.4rem);
}

.board-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(270px, 410px);
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed color-mix(in srgb, var(--lesson-tone) 24%, var(--main-border));
}

.board-header h2 {
  font-size: 1.25rem;
}

.board-header p {
  font-size: 0.86rem;
}

.lessons-search {
  position: relative;
  display: flex;
  align-items: center;
}

.lessons-search > svg {
  position: absolute;
  inset-inline-start: 0.9rem;
  z-index: 1;
  width: 20px;
  color: var(--lesson-tone);
}

.lessons-search input {
  width: 100%;
  min-height: 48px;
  padding: 0.75rem 2.8rem;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-2);
  color: var(--text-strong);
  outline: none;
}

.lessons-search input:focus {
  border-color: var(--lesson-tone);
  background: var(--surface-1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--lesson-tone) 12%, transparent);
}

.lessons-search button {
  position: absolute;
  inset-inline-end: 0.7rem;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 9px;
  background: color-mix(in srgb, var(--lesson-tone) 10%, transparent);
  color: var(--lesson-tone);
  cursor: pointer;
  font-size: 1.2rem;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.lesson-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  padding: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--lesson-tone) 18%, var(--main-border));
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--lesson-tone) 9%, transparent),
      transparent 31%
    ),
    linear-gradient(
      145deg,
      var(--surface-1),
      color-mix(in srgb, var(--surface-2) 74%, var(--surface-1))
    );
  box-shadow: 0 14px 32px color-mix(in srgb, var(--shadow-color) 28%, transparent);
  transition: 0.2s ease;
}

.lesson-card::before {
  content: '';
  position: absolute;
  inset-block: 1.1rem;
  inset-inline-start: 0;
  width: 4px;
  border-radius: 0 999px 999px 0;
  background: var(--lesson-tone);
}

[dir='rtl'] .lesson-card::before {
  border-radius: 999px 0 0 999px;
}

.lesson-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--lesson-tone) 38%, var(--main-border));
  box-shadow: 0 22px 44px color-mix(in srgb, var(--lesson-tone) 13%, transparent);
}

.lesson-card-top,
.card-tags,
.lesson-card-footer,
.observer {
  display: flex;
  align-items: center;
}

.lesson-card-top,
.lesson-card-footer {
  justify-content: space-between;
  gap: 0.75rem;
}

.lesson-number {
  color: color-mix(in srgb, var(--lesson-tone) 46%, var(--text-muted));
  font-family: monospace;
  font-size: 0.78rem;
  font-weight: 900;
}

.card-tags {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.45rem;
}

.type-tag,
.risk-tag {
  padding: 0.36rem 0.65rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--lesson-tone) 9%, var(--surface-1));
  color: var(--lesson-tone);
  font-size: 0.7rem;
  font-weight: 900;
}

.risk-tag.risk-3 {
  background: var(--status-danger-soft);
  color: var(--status-danger);
}

.risk-tag.risk-2 {
  background: var(--status-warning-soft);
  color: var(--status-warning);
}

.risk-tag.risk-1 {
  background: var(--status-success-soft);
  color: var(--status-success);
}

blockquote {
  position: relative;
  min-height: 88px;
  margin: 0;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid color-mix(in srgb, var(--lesson-tone) 15%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--lesson-tone) 6%, var(--surface-1));
}

[dir='rtl'] blockquote {
  padding: 1rem 3rem 1rem 1rem;
}

blockquote > span {
  position: absolute;
  inset-block-start: 0.35rem;
  inset-inline-start: 0.8rem;
  color: color-mix(in srgb, var(--lesson-tone) 40%, transparent);
  font-family: Georgia, serif;
  font-size: 3.2rem;
  line-height: 1;
}

blockquote p {
  margin: 0;
  color: var(--text-strong);
  font-size: 0.96rem;
  font-weight: 700;
  line-height: 1.65;
  text-transform: none;
}

.observation-context {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.8rem;
}

.context-image {
  overflow: hidden;
  width: 76px;
  height: 76px;
  border-radius: 15px;
  background: var(--surface-3);
}

.context-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.context-copy {
  min-width: 0;
}

.context-copy > span {
  color: var(--lesson-tone);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.context-copy h3 {
  margin: 0.25rem 0 0;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 1rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.context-copy p {
  display: -webkit-box;
  margin: 0.25rem 0 0;
  overflow: hidden;
  color: var(--text-soft);
  font-size: 0.8rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.observation-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
  margin: 0;
}

.observation-meta div {
  min-width: 0;
  padding: 0.7rem;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: color-mix(in srgb, var(--surface-2) 80%, var(--surface-1));
}

.observation-meta dt {
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.observation-meta dd {
  margin: 0.25rem 0 0;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.8rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lesson-card-footer {
  margin-top: auto;
  padding-top: 0.85rem;
  border-top: 1px dashed color-mix(in srgb, var(--lesson-tone) 20%, var(--main-border));
}

.observer {
  gap: 0.55rem;
  min-width: 0;
}

.observer-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--lesson-tone) 13%, var(--surface-1));
  color: var(--lesson-tone);
  font-weight: 900;
}

.observer > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.observer small {
  color: var(--text-muted);
  font-size: 0.68rem;
}

.observer b {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.78rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.view-source {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 0.4rem;
  padding: 0.6rem 0.75rem;
  border-radius: 11px;
  background: var(--lesson-tone);
  color: var(--text-on-brand);
  font-size: 0.75rem;
  font-weight: 900;
  text-decoration: none;
  transition: 0.2s ease;
}

.view-source:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--lesson-tone) 24%, transparent);
}

.lessons-loading {
  margin-top: 1rem;
  padding: 1rem;
}

@media (max-width: 900px) {
  .lessons-summary,
  .lessons-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .board-header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .knowledge-mark {
    display: none;
  }

  .lessons-summary,
  .lessons-grid {
    grid-template-columns: 1fr;
  }

  .lesson-card-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .view-source {
    justify-content: center;
  }
}
</style>
