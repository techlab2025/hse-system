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
  --meeting-accent: #64748b;
  --meeting-soft: #f8fafc;
  position: relative;
  isolation: isolate;
  min-height: 220px;
  padding: 16px;
  border: 1px solid #e8edf5;
  border-radius: 18px;
  overflow: hidden;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96)),
    #fff;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 16px 34px rgba(15, 23, 42, 0.07);
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
    border-color: color-mix(in srgb, var(--meeting-accent) 34%, #e8edf5);
    box-shadow:
      0 10px 22px rgba(15, 23, 42, 0.08),
      0 26px 44px rgba(15, 23, 42, 0.12);
  }

  &.active {
    --meeting-accent: #16a34a;
    --meeting-soft: #f0fdf4;
  }

  &.ended {
    --meeting-accent: #64748b;
    --meeting-soft: #f8fafc;
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
    color: #101828;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.3;
  }

  small {
    display: block;
    color: #98a2b3;
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
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75);

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
  border: 1px solid #edf1f7;
  border-radius: 14px;
  padding: 10px;
  background: #fff;

  .schedule-label {
    display: block;
    color: #98a2b3;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  strong {
    display: block;
    color: #344054;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.35;
    word-break: break-word;
  }
}

.meeting-place,
.meeting-note {
  margin: 0;
  color: #667085;
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
  color: #fff;
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
