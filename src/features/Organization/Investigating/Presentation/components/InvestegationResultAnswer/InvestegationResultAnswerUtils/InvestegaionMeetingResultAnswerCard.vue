<script setup lang="ts">
import { MeetingStatus } from '@/features/Organization/Investigating/Core/Enums/MeetingStatusEnum'
import type InvestigationMeetingsModel from '@/features/Organization/Investigating/Data/models/InvestigationMeetingsModel'
import GoogleMeetIcon from '@/shared/icons/GoogleMeetIcon.vue'
import { ref } from 'vue'

const props = defineProps<{
  meeting: InvestigationMeetingsModel
}>()

const MeetingsPlatforms = ref([
  {
    id: 1,
    name: 'GooleMeeting',
    icon: GoogleMeetIcon,
  },
  {
    id: 2,
    name: 'GooleMeeting',
    icon: GoogleMeetIcon,
  },
  {
    id: 3,
    name: 'GooleMeeting',
    icon: GoogleMeetIcon,
  },
  {
    id: 4,
    name: 'GooleMeeting',
    icon: GoogleMeetIcon,
  },
])

const SelectedPlatform = ref(
  MeetingsPlatforms.value.filter((item) => item.id === props?.meeting?.type)[0],
)

const GetMeetingStatus = (status: number) => {
  return MeetingStatus[status]
}
</script>
<template>
  <div
    class="investegaion-meeting-card"
    :class="meeting?.status == MeetingStatus.Coming ? 'active' : 'ended'"
  >
    <div class="card-header">
      <div class="plateform">
        <span class="platform-icon">
          <component :is="SelectedPlatform?.icon"></component>
        </span>
        <div>
          <p>{{ SelectedPlatform?.name }}</p>
          <small>{{ $t('meeting') }}</small>
        </div>
      </div>
      <span class="meeting-status" :class="`status-${GetMeetingStatus(meeting?.status)}`">{{
        GetMeetingStatus(meeting?.status)
      }}</span>
    </div>

    <div class="meeting-schedule">
      <div class="schedule-item">
        <span class="schedule-label">{{ $t('date') }}</span>
        <strong>{{ meeting?.date || '-' }}</strong>
      </div>
      <div class="schedule-item">
        <span class="schedule-label">{{ $t('time') }}</span>
        <strong>{{ meeting?.time || '-' }}</strong>
      </div>
    </div>

    <p class="meeting-place" v-if="meeting?.place">
      {{ meeting.place }}
    </p>

    <p class="meeting-note" v-if="meeting?.corrective">
      {{ meeting.corrective }}
    </p>

    <a
      v-if="meeting?.meeting_link"
      class="meeting-link"
      :href="meeting.meeting_link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ $t('Open Meeting') }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.investegaion-meeting-card {
  --meeting-accent: var(--brand-primary-500);
  --meeting-soft: var(--brand-primary-50);
  position: relative;
  isolation: isolate;
  min-height: 220px;
  padding: 16px;
  border: 1px solid var(--brand-primary-100);
  border-radius: 18px;
  overflow: hidden;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--surface-1) 98%, transparent), color-mix(in srgb, var(--brand-primary-50) 96%, transparent)),
    var(--surface-1);
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--brand-primary-900) 4%, transparent),
    0 16px 34px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 5px;
    background: var(--meeting-accent);
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    right: -48px;
    top: -58px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--meeting-accent) 12%, transparent);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: color-mix(in srgb, var(--meeting-accent) 34%, var(--brand-primary-100));
    box-shadow:
      0 10px 22px color-mix(in srgb, var(--brand-primary-900) 8%, transparent),
      0 26px 44px color-mix(in srgb, var(--brand-primary-900) 12%, transparent);
  }

  &.active {
    --meeting-accent: var(--status-success);
    --meeting-soft: var(--status-success-soft);
  }

  &.ended {
    --meeting-accent: var(--brand-primary-500);
    --meeting-soft: var(--brand-primary-50);
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.plateform {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  p {
    margin: 0;
    color: var(--brand-primary-900);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.3;
  }

  small {
    display: block;
    color: var(--brand-primary-400);
    font-size: 12px;
    font-weight: 600;
    line-height: 1.3;
  }
}

.platform-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--meeting-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--surface-1) 75%, transparent);

  :deep(svg) {
    width: 24px;
    height: 24px;
  }
}

.meeting-status {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 6px 10px;
  background: var(--meeting-soft);
  color: var(--meeting-accent);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.meeting-schedule {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.schedule-item {
  border: 1px solid var(--brand-primary-50);
  border-radius: 14px;
  padding: 10px;
  background: var(--surface-1);

  .schedule-label {
    display: block;
    color: var(--brand-primary-400);
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  strong {
    display: block;
    color: var(--brand-primary-700);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.35;
    word-break: break-word;
  }
}

.meeting-place,
.meeting-note {
  margin: 0;
  color: var(--brand-primary-500);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.55;
}

.meeting-note {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meeting-link {
  margin-top: auto;
  min-height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  background: var(--meeting-accent);
  color: var(--text-on-brand);
  font-size: 13px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}
</style>
