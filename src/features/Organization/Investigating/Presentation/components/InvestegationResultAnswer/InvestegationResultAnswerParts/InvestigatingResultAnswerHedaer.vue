<script lang="ts" setup>
import EmployeeBg from '@/assets/images/EmployeeBg.png'
import Yellowback from '@/assets/images/Yellowback.png'
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
}>()
</script>
<template>
  <div class="investigating-answer-header-container">
    <div class="investigating-answer-data">
      <div class="left-header-background">
        <img class="left-blue-background" :src="EmployeeBg" alt="bg">
        <img class="left-yellow-background" :src="Yellowback" alt="bg">
      </div>
      <div class="investigating-header">
        <p class="title">{{ `investigation / incedant` }}</p>
      </div>
      <div class="investigating-info">
        <p>
          meetings : <span>{{ meetingsNumber }}</span>
        </p>
        <p>
          created in : <span>{{ createdAt }}</span>
        </p>
        <p>
          The victim : <span class="victim">{{ victim }}</span>
        </p>
      </div>
      <div class="meeting-info-container">

        <div class="meeting-info">

          <p>
            Investigation team leader : <span class="team-leader">{{ TeamLeader }}</span>
          </p>
          <p>
            Num of team : <span class="team-number">{{ TeamNumbers }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="investigating-answer-complete-task">
      <span>completed tasks</span>
      <span>{{ `${solvedTasks} ` }} / <span class="total">{{ `${ToltalTasks}` }}</span></span>
    </div>
  </div>
</template>
