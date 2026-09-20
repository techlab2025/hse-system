<script setup lang="ts">
import { computed } from 'vue'
import type ProjectMeetingModel from '@/features/Organization/Project/Data/models/ProjectMeeting/ProjectMeetingModel.ts'
import AddProjectMeetingDialog from './AddProjectMeetingDialog.vue'
import MeetingResultDialog from './MeetingResultDialog.vue'

const props = defineProps<{
  projectId: number
  meetings: ProjectMeetingModel[]
}>()

const emit = defineEmits(['updated'])

const getMeetingTimestamp = (date: string) => {
  const timestamp = new Date(`${date}T00:00:00`).getTime()
  return timestamp
}

const upcomingMeetings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return [...(props.meetings ?? [])]
    .filter((meeting) => {
      const timestamp = getMeetingTimestamp(meeting.date)
      return Number.isFinite(timestamp) && timestamp >= today.getTime()
    })
    .sort((first, second) => getMeetingTimestamp(first.date) - getMeetingTimestamp(second.date))
})
</script>

<template>
  <section class="project-drill-section">
    <div class="drill-section-glow"></div>
    <header class="drill-section-header">
      <div class="drill-section-title">
        <span class="drill-section-symbol"><i></i><i></i><i></i></span>
        <div>
          <!-- <small>{{ $t('project meetings') }}</small> -->
          <h2>{{ $t('Project meetings') }}</h2>
          <p>
            {{
              $t(
                'Plan, schedule and manage project meetings with your teams and track meeting outcomes.',
              )
            }}
          </p>
        </div>
      </div>
      <div class="meeting-header-actions">
        <router-link
          class="all-meetings-link"
          :to="{ name: 'Project Meetings', params: { project_id: props.projectId } }"
        >
          <span>{{ $t('View all meetings') }}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" />
          </svg>
        </router-link>
        <AddProjectMeetingDialog
          :project-id="props.projectId"
          :compact="true"
          @saved="emit('updated')"
        />
      </div>
    </header>

    <div v-if="upcomingMeetings.length" class="drill-team-groups">
      <div class="upcoming-label">
        <span></span>
        {{ $t('Today and upcoming meetings') }}
        <strong>{{ upcomingMeetings.length }}</strong>
      </div>
      <!-- <article v-for="group in meetings" :key="group.title" class="drill-team-group"> -->
      <!-- <div class="drill-team-header">
          <div>
            <span>{{ $t('Responsible team') }}</span>
          </div>
          <strong
            >{{ group.drills.length
            }}<small>{{ group.drills.length === 1 ? $t('drill') : $t('drills') }}</small></strong
          >
        </div> -->
      <div class="drill-cards">
        <MeetingResultDialog
          v-for="meeting in upcomingMeetings"
          :key="meeting.id"
          :meeting="meeting"
          :project-id="props.projectId"
          @saved="emit('updated')"
        />
        <!-- :plans="plansByDrillId[drill.id]"
            :plans-loading="loadingPlansByDrillId[drill.id] ?? false"
            @opened="fetchDrillPlans(drill.id)"
            @saved="handleDrillSaved(drill.id)" -->
      </div>
      <!-- </article> -->
    </div>
    <div class="drill-empty-state" v-else>
      <span>M</span>
      <div>
        <h3>{{ $t('No upcoming meetings') }}</h3>
        <p>
          {{ $t('Past meetings remain available on the full meetings page.') }}
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
.meeting-header-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 9px;
}
.all-meetings-link {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  border-radius: 14px;
  color: var(--PrimaryColor);
  background: var(--surface-1);
  font-size: 0.7rem;
  font-weight: 900;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}
.all-meetings-link:hover {
  transform: translateY(-2px);
  border-color: var(--PrimaryColor);
}
.all-meetings-link svg {
  width: 17px;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
[dir='rtl'] .all-meetings-link svg {
  transform: rotate(180deg);
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
.upcoming-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-soft);
  font-size: 0.64rem;
  font-weight: 800;
}
.upcoming-label > span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--status-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--status-success) 12%, transparent);
}
.upcoming-label strong {
  display: grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  padding: 0 5px;
  border-radius: 7px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
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
  .meeting-header-actions {
    width: 100%;
  }
  .all-meetings-link {
    flex: 1;
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
