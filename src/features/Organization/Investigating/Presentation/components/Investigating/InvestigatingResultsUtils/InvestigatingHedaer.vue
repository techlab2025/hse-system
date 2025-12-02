<script lang="ts" setup>
const props = defineProps<{
  title?: string
  serial?: string
  victim?: string
  date?: string
  meetingDate?: string
  TeamLeader?: string
  TeamNumbers?: number
}>()
</script>
<template>
  <div class="investigating-header-container">
    <div class="investigating-header">
      <p class="title">{{ title }}</p>
      <span>{{ serial }}</span>
    </div>
    <div class="investigating-info">
      <p>
        the victim : <span>{{ victim }}</span>
      </p>
      <p>
        Date & Time : <span>{{ date }}</span>
      </p>
    </div>
    <div class="meeting-info-container">
      <div class="metting-info-header-container">
        <p class="metting-info-header">{{ $t('investigation_meeting') }}</p>
        <hr class="meeting-hr">
      </div>
      <div class="meeting-info">
        <p>
          Date & Time : <span class="meet-date">{{ meetingDate }}</span>
        </p>
        <p>
          Investigation team leader : <span class="team-leader">{{ TeamLeader }}</span>
        </p>
        <p>
          Num of team : <span class="team-number">{{ TeamNumbers }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
