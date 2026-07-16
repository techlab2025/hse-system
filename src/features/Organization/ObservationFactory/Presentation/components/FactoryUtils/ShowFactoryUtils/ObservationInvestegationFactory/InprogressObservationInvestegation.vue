<script lang="ts" setup>
import InvestegationResultDetailsModel from '@/features/Organization/Investigating/Data/models/investigationResult/InvestegationResulDetailsModel'
import InvestegationIcon from '@/shared/icons/InvestegationIcon.vue'
import LastMeetingIcon from '@/shared/icons/LastMeetingIcon.vue'
import NextMeetingIcon from '@/shared/icons/NextMeetingIcon.vue'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'
import InvestegationTeam from '@/shared/icons/InvestegationTeam.vue'
import { computed } from 'vue'

const props = defineProps<{
  data: InvestegationResultDetailsModel
}>()

const latestMeetingId = computed(() => {
  if (props.data?.latest_investigation_meeting_id) {
    return props.data.latest_investigation_meeting_id
  }

  const meetings = props.data?.investigationMeetings ?? props.data?.meeting ?? []
  return meetings[meetings.length - 1]?.id
})

const addResultRoute = computed(() =>
  latestMeetingId.value
    ? `/organization/Investigating-result/${latestMeetingId.value}?investigating_id=${props.data?.id}`
    : '',
)
</script>
<template>
  <div class="investigation-container-inprogress">
    <div class="investigation-container-inprogress-header">
      <div class="flex items-center gap-2">
        <InvestegationIcon />
        <div class="investegatino-header">
          <p class="investegation-title">{{ $t('investegation') }}</p>
          <p class="investegation-header-status">{{ $t('in progress') }}</p>
          <p class="investigation-hint">
            {{ $t('in_progress_investigation_hint') }}
          </p>
        </div>
      </div>

      <router-link v-if="addResultRoute" :to="addResultRoute" class="show-details">
        {{ $t('add_investigation_result') }}
      </router-link>
    </div>
    <div class="investigation-container-inprogress-content">
      <div class="investegation-team-hedaer">
        <InvestegationTeam />
        <div class="Team-members">
          <p class="title">{{ $t('Team') }}</p>
          <div class="team-details">
            <p class="investegation-team-leader">
              {{ $t('Investigation team leader') }} :
              <span>{{
                props.data?.investigationEmployees?.find((el) => el.isLeader)?.organizationEmployee
                  ?.name
              }}</span>
            </p>
            <p class="investegation-team-leader">
              {{ $t('Num of team') }}: <span>{{ props.data?.investigationEmployees?.length }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="investegation-team-content">
        <!--  state.data?.investigation?.investigationEmployees -->
        <div class="member-card" v-for="member in props.data?.investigationEmployees">
          <img
            src="https://cyber.comolho.com/static/img/avatar.png"
            alt=""
            width="30"
            height="30"
          />
          <div class="member-info">
            <p class="member-name">{{ member?.organizationEmployee?.name }}</p>
            <p class="member-position">
              {{ member?.organizationEmployee?.hierarchy?.map((el) => el.title).join(', ') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="investigation-container-inprogress-info">
      <div class="last-meeting" v-if="data.lastMeetingDate">
        <div class="last-meeting-header">
          <LastMeetingIcon />
          <p class="title">{{ $t('last meeting') }}</p>
        </div>
        <div class="last-meeting-data">
          <p class="info">
            {{ $t('Date') }} : <span>{{ formatJoinDate(props.data?.lastMeetingDate) }}</span>
          </p>
          <p class="info">
            {{ $t('Time') }} : <span>{{ formatTime(props.data?.lastMeetingTime) }}</span>
          </p>
          <!-- <p class="info">meeting platform: : <span>{{ props.data?.lastMeeting?.type }}</span></p> -->
        </div>
      </div>
      <div class="last-meeting" v-if="props.data?.nextMeetingDate">
        <div class="last-meeting-header">
          <NextMeetingIcon />
          <p class="title">{{ $t('next meeting') }}</p>
        </div>
        <div class="last-meeting-data">
          <p class="info">
            {{ $t('Date') }} : <span>{{ formatJoinDate(props.data?.nextMeetingDate) }}</span>
          </p>
          <p class="info">
            {{ $t('Time') }} : <span>{{ formatTime(props.data?.nextMeetingTime) }}</span>
          </p>
          <!-- <p class="info">meeting platform: : <span>{{ props.data?.nextMeeting?.type }}</span></p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.investigation-hint {
  max-width: 520px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}
</style>
