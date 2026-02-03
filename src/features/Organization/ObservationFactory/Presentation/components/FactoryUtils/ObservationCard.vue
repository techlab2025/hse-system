<script lang="ts" setup>
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import type HazardDetailsModel from '../../../Data/models/hazardDetailsModel'

const props = defineProps<{
  data: HazardDetailsModel
}>()

const GetRiskLevel = (riskLevel: RiskLevelEnum) => {
  switch (riskLevel) {
    case RiskLevelEnum.Low:
      return 'Low'
    case RiskLevelEnum.Medium:
      return 'Medium'
    case RiskLevelEnum.High:
      return 'High'
    default:
      return 'Unknown'
  }
}
</script>
<template>
  <div class="observation-card">
    <div class="header-container">
      <div class="card-content">
        <div class="title_observation">
          <p class="observation-title">{{ data?.title }}</p>
          <p class="Description">{{ data?.description }}</p>
        </div>
        <div class="card-header">
          <p class="label-item-primary">
            {{ $t('Serial') }} : <span>{{ data?.serialName }}</span>
          </p>
          <h6 class="label-item-secondary">
            {{ $t('Date & Time') }} : <span>{{ data?.date }}</span>
          </h6>
          <h6 class="label-item-secondary" v-if="data?.zoon?.title">
            {{ $t('Zone') }} : <span>{{ data?.zoon?.title }}</span>
          </h6>
          <p class="label-item-primary">{{ $t('incident type') }} : <span>{{ data?.typeModel?.title }}</span></p>
          <p class="label-employee"> {{ $t('employee') }} : <span>{{ data?.observer?.name }}</span></p>
        </div>
        <!-- <div class="card-details">
          <p class="subtitle">{{ data?.description }}</p>
          <div class="project-details">
            <p class="label-item-primary" v-if="data?.equipment?.title">
              {{ $t('Machine') }} : <span>{{ data?.equipment?.title }}</span>
            </p>
          </div>
        </div> -->
      </div>
      <div class="card_status">
        <p>{{ $t('status') }}</p>
        <h6>{{ $t('unsolved') }}</h6>
      </div>
      
      <!-- if we want add imge -->
      <!-- <div class="observer-container" v-if="data?.observer.name">
        <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="30" height="30" />
        <p class="title">{{ data?.observer.name }}</p>
        <span class="observer">{{ $t('observer') }}</span>
      </div> -->
      <!-- <p class="title">{{ data?.observer. }}</p> -->
      <!-- <div class="card-info">
        <span v-if="data?.riskLevel" class="observation-risk-level" :class="GetRiskLevel(data?.riskLevel)">
          {{ GetRiskLevel(data?.riskLevel) }} Level
        </span>
        <Image v-if="data?.media[0]?.url" :src="data?.media[0]?.url" alt="Image" preview>
          <template #previewicon>
            <div class="perview">
              <span>view</span>
              <ViewIcon />
            </div>
          </template>
</Image>
</div> -->
    </div>
  </div>
</template>
