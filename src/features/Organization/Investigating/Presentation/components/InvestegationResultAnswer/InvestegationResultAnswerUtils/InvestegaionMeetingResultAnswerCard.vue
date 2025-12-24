<script setup lang="ts">
import { MeetingStatus } from '@/features/Organization/Investigating/Core/Enums/MeetingStatusEnum';
import GoogleMeetIcon from '@/shared/icons/GoogleMeetIcon.vue';
import { ref } from 'vue';

const props = defineProps<{
  meeting: any
}>()

const MeetingsPlatforms = ref([
  {
    id: 1,
    name: "GooleMeeting",
    icon: GoogleMeetIcon
  },
  {
    id: 2,
    name: "GooleMeeting",
    icon: GoogleMeetIcon
  },
])

const SelectedPlatform = ref(MeetingsPlatforms.value.filter((item => item.id === props.meeting.type))[0])

const GetMeetingStatus = (status) => {
  return MeetingStatus[status]
}
</script>
<template>
  <div class="investegaion-meeting-card">
    <div class="card-header">
      <div class="plateform">
        <component :is="SelectedPlatform.icon"></component>
        <p>{{ SelectedPlatform.name }}</p>
      </div>
      <span :class="`status-${GetMeetingStatus(meeting?.status)}`">{{ GetMeetingStatus(meeting?.status) }}</span>
    </div>
    <p class="meeting-date">Date & Time : <span>{{ meeting?.date }}</span></p>
    <p class="meeting-time">duration : <span>{{ meeting?.time }}</span></p>
  </div>
</template>
