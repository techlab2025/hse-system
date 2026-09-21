<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import AddProjectMeetingDialog from '@/features/Organization/Project/Presentation/components/Details/ProjectMeeting/AddProjectMeetingDialog.vue'
import MeetingResultDialog from '@/features/Organization/Project/Presentation/components/Details/ProjectMeeting/MeetingResultDialog.vue'
import FetchProjectMeetingsParams from '@/features/Organization/Project/Core/params/ProjectMeeting/FetchProjectMeetingsParams'
import FetchProjectMeetingsController from '@/features/Organization/Project/Presentation/controllers/ProjectMeeting/FetchProjectMeetingsController'

const route = useRoute()
const projectId = computed(() => Number(route.params.project_id))
const currentPage = ref(1)
const countPerPage = ref(10)
const controller = FetchProjectMeetingsController.getInstance()
const state = controller.state

const fetchMeetings = async () => {
  if (!Number.isFinite(projectId.value) || projectId.value <= 0) return

  await controller.fetchMeetings(
    new FetchProjectMeetingsParams(projectId.value, currentPage.value, countPerPage.value, 1),
  )
}

const changePage = (page: number) => {
  currentPage.value = page
  void fetchMeetings()
}

const changePageSize = (count: number) => {
  countPerPage.value = count
  currentPage.value = 1
  void fetchMeetings()
}

watch(
  projectId,
  () => {
    currentPage.value = 1
    void fetchMeetings()
  },
  { immediate: true },
)
</script>

<template>
  <main class="meetings-page">
    <header class="meetings-page-header">
      <div class="meetings-heading">
        <router-link
          class="back-link"
          :to="{ name: 'Project Details', params: { id: projectId } }"
          :aria-label="$t('Back to project')"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m15 5-7 7 7 7" stroke="currentColor" />
          </svg>
        </router-link>
        <span class="meetings-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 3v3M17 3v3M4.5 9h15" stroke="currentColor" />
            <path
              d="M6.5 5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
              stroke="currentColor"
            />
          </svg>
        </span>
        <div>
          <span>{{ $t('Meeting workspace') }}</span>
          <h1>{{ $t('All project meetings') }}</h1>
          <p>{{ $t('Review past meetings and manage upcoming schedules.') }}</p>
        </div>
      </div>

      <AddProjectMeetingDialog :project-id="projectId" :compact="true" @saved="fetchMeetings" />
    </header>

    <section class="meetings-content">
      <div class="meetings-content-header">
        <div>
          <h2>{{ $t('Meeting history') }}</h2>
          <p>{{ $t('All scheduled meetings for this project.') }}</p>
        </div>
        <strong v-if="state.pagination">{{ state.pagination.total }}</strong>
      </div>

      <div v-if="controller.isDataLoading()" class="meetings-loading">
        <span></span><span></span><span></span><span></span>
      </div>

      <div v-else-if="state.data?.length" class="meetings-grid">
        <MeetingResultDialog
          v-for="meeting in state.data"
          :key="meeting.id"
          :meeting="meeting"
          :project-id="projectId"
          @saved="fetchMeetings"
        />
      </div>

      <div v-else class="meetings-empty">
        <span>M</span>
        <div>
          <h3>{{ $t('No Meetings have been added') }}</h3>
          <p>{{ $t('Create the first Meeting to start planning and tracking your teams.') }}</p>
        </div>
      </div>

      <Pagination
        :pagination="state.pagination"
        @change-page="changePage"
        @count-per-page="changePageSize"
      />
    </section>
  </main>
</template>

<style scoped lang="scss">
.meetings-page {
  display: grid;
  gap: 18px;
  padding: 18px;
}

.meetings-page-header,
.meetings-content {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 24px;
  background: var(--surface-1);
  box-shadow: 0 18px 42px color-mix(in srgb, var(--text-strong) 7%, transparent);
}

.meetings-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 10%, transparent),
      transparent 32%
    ),
    var(--surface-1);
}

.meetings-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.back-link,
.meetings-symbol {
  display: grid;
  place-items: center;
}

.back-link {
  width: 36px;
  height: 36px;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  color: var(--text-strong);
  background: var(--surface-2);
}

.back-link svg {
  width: 18px;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

[dir='rtl'] .back-link svg {
  transform: rotate(180deg);
}

.meetings-symbol {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  color: white;
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
}

.meetings-symbol svg {
  width: 25px;
  stroke-width: 1.7;
  stroke-linecap: round;
}

.meetings-heading > div > span {
  color: var(--PrimaryColor);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.meetings-heading h1,
.meetings-heading p,
.meetings-content-header h2,
.meetings-content-header p {
  margin: 0;
}

.meetings-heading h1 {
  margin-top: 2px;
  color: var(--text-strong);
  font: 1.25rem 'Bold';
}

.meetings-heading p,
.meetings-content-header p {
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 0.7rem;
}

.meetings-content {
  padding: 18px;
}

.meetings-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
}

.meetings-content-header h2 {
  color: var(--text-strong);
  font-size: 1rem;
}

.meetings-content-header strong {
  display: grid;
  min-width: 38px;
  height: 38px;
  place-items: center;
  padding: 0 10px;
  border-radius: 12px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-2));
}

.meetings-grid,
.meetings-loading {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.meetings-loading span {
  height: 94px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    var(--surface-2),
    color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-2)),
    var(--surface-2)
  );
  background-size: 200% 100%;
  animation: meeting-loading 1.2s linear infinite;
}

.meetings-empty {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 24px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 30%, var(--main-border));
  border-radius: 17px;
  background: color-mix(in srgb, var(--PrimaryColor) 4%, transparent);
}

.meetings-empty > span {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 14px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 11%, transparent);
  font-family: 'Bold';
}

.meetings-empty h3,
.meetings-empty p {
  margin: 0;
}

.meetings-empty h3 {
  color: var(--text-strong);
  font-size: 0.86rem;
}

.meetings-empty p {
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 0.68rem;
}

@keyframes meeting-loading {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 760px) {
  .meetings-page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .meetings-grid,
  .meetings-loading {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .meetings-page {
    padding: 10px;
  }

  .meetings-heading {
    align-items: flex-start;
  }

  .meetings-symbol {
    display: none;
  }
}
</style>
