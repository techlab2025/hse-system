<script lang="ts" setup>
import EmployeeBg from '@/assets/images/EmployeeBg.png'
import Yellowback from '@/assets/images/Yellowback.png'
import { Observation } from '@/features/Organization/Investigating/Core/Enums/ObservationTypeEnum'
const props = defineProps<{
  title?: string
  meetingsNumber?: number
  victim?: string
  date?: string
  meetingDate?: string
  TeamLeader?: string
  TeamNumbers?: number
  createdAt?: string
  solvedTasks?: number
  ToltalTasks?: number
  investegationType?: number
}>()

const GetInvestigationType = (type: number) => {
  // return Observation[type]
  switch (type) {
    case Observation.AccidentsType: {
      return 'Incident'
    }
    case Observation.ObservationType: {
      return 'Observation'
    }
    case Observation.HazardType: {
      return 'Hazard'
    }

    default: {
      return ''
    }
  }
}
</script>
<template>
  <div class="investigating-answer-header-container">
    <div class="investigating-answer-data">
      <div class="left-header-background">
        <img class="left-blue-background" :src="EmployeeBg" alt="" aria-hidden="true" />
        <img class="left-yellow-background" :src="Yellowback" alt="" aria-hidden="true" />
      </div>
      <div class="investigating-header">
        <p class="title">
          {{
            $t('uiDynamic.investigationReference', {
              p0: GetInvestigationType(props?.investegationType),
            })
          }}
        </p>
      </div>
      <div class="investigating-info">
        <p>
          {{ $t('meetings :') }} <span>{{ meetingsNumber }}</span>
        </p>
        <p>
          {{ $t('created in :') }} <span>{{ createdAt }}</span>
        </p>
        <p v-if="victim">
          {{ $t('The victim :') }} <span class="victim">{{ victim }}</span>
        </p>
      </div>
      <div class="meeting-info-container">
        <div class="meeting-info">
          <p>
            {{ $t('Investigation team leader :') }}
            <span class="team-leader">{{ TeamLeader?.name }}</span>
          </p>
          <p>
            {{ $t('Num of team :') }} <span class="team-number">{{ TeamNumbers }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="investigating-answer-complete-task">
      <span>{{ $t('completed tasks') }}</span>
      <span
        >{{ `${solvedTasks} ` }} / <span class="total">{{ `${ToltalTasks}` }}</span></span
      >
    </div>
  </div>
</template>
