<script lang="ts" setup>
import { computed } from 'vue'
import { InspectionTypeEnum } from '../../../Core/Enum/InspectionTypeEnum'
import { PeriodTypeEnum } from '../../../Core/Enum/PeriodTypeEnum'
import type InspectionModel from '../../../Data/models/InspectionModel'

interface SessionCardProps {
  singleImage?: string
  data: InspectionModel
}
const { data, singleImage } = defineProps<SessionCardProps>()

const hasMultiplePeriods = computed(() => data.periodType == InspectionTypeEnum.PERIOD)
// const hasSinglePeriod = computed(() => data.taskPeriods?.length === 1)

const cardTitle = computed(() => {
  if (hasMultiplePeriods.value) {
    switch (data.periodSubType) {
      case PeriodTypeEnum.BYDAY:
        return 'By Day'
      case PeriodTypeEnum.DAILY:
        return 'Daily'
      case PeriodTypeEnum.BYDATE:
        return 'ByDate'
      case PeriodTypeEnum.WHITDATE:
        return 'With Date'
      case PeriodTypeEnum.WITHDAY:
        return 'With Day'
    }
    // return data.periodSubType === PeriodTypeEnum.BYDAY ? 'Per Week' : 'Per Day'
  }
  return 'Once'
})
// const showDays = computed(() => hasMultiplePeriods.value)
// const showImage = computed(
//   () => hasSinglePeriod.value && data.periodType === InspectionTypeEnum.DAY,
// )
const isOnce = computed(() => data.periodType === InspectionTypeEnum.DAY)
</script>

<template>
  <div class="session-box" :class="{ once: isOnce }">
    <div class="session-header">
      <h4>{{ cardTitle }} :</h4>

      <h5 v-if="data.date">
        start day: <span>{{ data.date }}</span>
      </h5>
    </div>

    <div class="content-items" v-if="!isOnce">
      <span v-for="item in data.taskPeriods" :key="item.dayLabel">
        {{ item.dayLabel.slice(0, 3) }}
      </span>
    </div>

    <img v-if="isOnce" :src="singleImage" alt="Once" class="single-image" />
  </div>
</template>
