<script lang="ts" setup>
import InvestegationResultDetailsModel from '@/features/Organization/Investigating/Data/models/investigationResult/InvestegationResulDetailsModel';
import InvestegationIcon from '@/shared/icons/InvestegationIcon.vue';
import LastMeetingIcon from '@/shared/icons/LastMeetingIcon.vue';
import NextMeetingIcon from '@/shared/icons/NextMeetingIcon.vue';
import { formatJoinDate } from '@/base/Presentation/utils/date_format';
import { formatTime } from '@/base/Presentation/utils/time_format';
import InvestegationTeam from '@/shared/icons/InvestegationTeam.vue';
const props = defineProps<{
  data: InvestegationResultDetailsModel
}>()
</script>
<template>
  <div class="investigation-container-inprogress">
    <div class="investigation-container-inprogress-header">
      <div class="flex items-center gap-2">
        <InvestegationIcon />
        <div class="investegatino-header">
          <p class="investegation-title">{{ $t('investegation') }}</p>
          <p class="investegation-header-status">{{ $t('in progress') }}</p>
        </div>
      </div>

      <router-link :to="`/organization/Investigating-result-answer/${props.data?.id}`"
        class="show-details">{{ $t('showDetails') }}</router-link>
    </div>
    <div class="investigation-container-inprogress-content">
      <div class="investegation-team-hedaer">
        <InvestegationTeam />
        <div class="Team-members">
          <p class="title">{{ $t('Team') }}</p>
          <div class="team-details">
            <p class="investegation-team-leader">{{ $t('Investigation team leader') }} : <span>{{
              props.data?.investigationEmployees?.find((el) => el.isLeader)?.organizationEmployee?.name}}</span></p>
            <p class="investegation-team-leader">{{ $t('Num of team') }}: <span>{{ props.data?.investigationEmployees?.length
                }}</span></p>
          </div>
        </div>
      </div>
      <div class="investegation-team-content">
        <!--  state.data?.investigation?.investigationEmployees -->
        <div class="member-card" v-for="member in props.data?.investigationEmployees">
          <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="30" height="30" />
          <div class="member-info">
            <p class="member-name">{{ member?.organizationEmployee?.name }}</p>
            <p class="member-position">{{member?.organizationEmployee?.hierarchy?.map((el) => el.title).join(", ")}}</p>
          </div>
        </div>

      </div>
    </div>
    <div class="investigation-container-inprogress-info">
      <div class="last-meeting">
        <div class="last-meeting-header">
          <LastMeetingIcon />
          <p class="title">{{ $t('last meeting') }}</p>
        </div>
        <div class="last-meeting-data">
          <p class="info">{{ $t('Date') }} : <span>{{ formatJoinDate(props.data?.lastMeetingDate) }}</span></p>
          <p class="info">{{ $t('Time') }} : <span>{{ formatTime(props.data?.lastMeetingTime) }}</span></p>
          <!-- <p class="info">meeting platform: : <span>{{ props.data?.lastMeeting?.type }}</span></p> -->
        </div>
      </div>
      <div class="last-meeting" v-if="props.data?.nextMeetingDate">
        <div class="last-meeting-header">
          <NextMeetingIcon />
          <p class="title">{{ $t('next meeting') }}</p>
        </div>
        <div class="last-meeting-data">
          <p class="info">{{ $t('Date') }} : <span>{{ formatJoinDate(props.data?.nextMeetingDate) }}</span></p>
          <p class="info">{{ $t('Time') }} : <span>{{ formatTime(props.data?.nextMeetingTime) }}</span></p>
          <!-- <p class="info">meeting platform: : <span>{{ props.data?.nextMeeting?.type }}</span></p> -->
        </div>
      </div>

    </div>
  </div>
</template>
