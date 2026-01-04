<script lang="ts" setup>
import booksImage from '@/assets/images/books.png'
import { ref, watch } from 'vue';
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum';

const emit = defineEmits(['update:data'])
const props = defineProps<{
  highObservationCount: number
  mediumObservationCount: number
  selectedRiskLevel: RiskLevelEnum | null
}>()
const ObservationRiskLevel = ref<RiskLevelEnum | null>(props.selectedRiskLevel)
const selectRisk = (value: RiskLevelEnum | null) => {
  ObservationRiskLevel.value = value
  emit('update:data', value)
}
</script>

<template>
  <!-- Sidebar -->
  <div class="col-span-3">
    <div class="sidebar-container">
      <div class="sidebar-card">
        <div class="sidebar-card-header">
          <div class="sidebar-header">
            <p class="sidebar-label-item-primary">Investigation</p>
            <img :src="booksImage" alt="books" class="sidebar-img" />
          </div>
          <div class="sidebar-card-details">
            <ul class="sidebar-list">
              <li @click="selectRisk(null)" :class="{ active: ObservationRiskLevel === null }">
                All observation
                <span>({{ props.highObservationCount + props.mediumObservationCount }})</span>
              </li>

              <li @click="selectRisk(RiskLevelEnum.High)"
                :class="{ active: ObservationRiskLevel === RiskLevelEnum.High }">
                High observation
                <span>({{ props.highObservationCount }})</span>
              </li>

              <li @click="selectRisk(RiskLevelEnum.Medium)"
                :class="{ active: ObservationRiskLevel === RiskLevelEnum.Medium }">
                Medium observation
                <span>({{ props.mediumObservationCount }})</span>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
