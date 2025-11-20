<script lang="ts" setup>
import { ref, watch } from 'vue'
import { RiskLevelEnum } from '../../Core/Enums/risk_level_enum'

const props = defineProps<{
  modelRiskLevel?: RiskLevelEnum | null
  modelIsNearMiss?: number | null
  isHazard?: boolean
}>()

const emit = defineEmits(['update:data'])

const selectedIndustry = ref<RiskLevelEnum | null>(props.modelRiskLevel || null)
const selectedStatus = ref<number | null>(props.modelIsNearMiss ?? null)

// Emit on change
watch([selectedIndustry, selectedStatus], ([newIndustry, newStatus]) => {
  emit('update:data', {
    level: newIndustry,
    is_near_miss: newStatus,
  })
})

// Keep in sync if parent changes
watch(() => props.modelRiskLevel, (val) => { selectedIndustry.value = val ?? null })
watch(() => props.modelIsNearMiss, (val) => { selectedStatus.value = val ?? null })
</script>


<template>
  <div class="observation-level lg:grid grid-cols-12 gap-4 mt-6">
    <!-- Low -->
    <div class="col-span-4 select-container" :class="{
      selected: selectedIndustry === RiskLevelEnum.Low,
      'low-selected': selectedIndustry === RiskLevelEnum.Low,
    }">
      <label>
        <input type="radio" v-model="selectedIndustry" :value="RiskLevelEnum.Low" class="radio-input" />
        <span>Low</span>
      </label>
      <div class="circle" v-if="selectedIndustry === RiskLevelEnum.Low"></div>
    </div>

    <!-- Medium -->
    <div class="col-span-4 select-container" :class="{
      selected: selectedIndustry === RiskLevelEnum.Medium,
      'medium-selected': selectedIndustry === RiskLevelEnum.Medium,
    }">
      <label>
        <input type="radio" v-model="selectedIndustry" :value="RiskLevelEnum.Medium" class="radio-input" />
        <span>Medium</span>
      </label>

      <div class="circle" v-if="selectedIndustry === RiskLevelEnum.Medium"></div>

      <div class="details-box" v-if="selectedIndustry === RiskLevelEnum.Medium && !isHazard">
        <p class="status-label">Status:</p>
        <div class="status-container">
          <label class="status-option">
            <input type="radio" v-model="selectedStatus" :value="1" class="radio-input" />
            <span class="status-value">near miss</span>
          </label>

          <label class="status-option">
            <input type="radio" v-model="selectedStatus" :value="0" class="radio-input" />
            <span class="status-values">Non</span>
          </label>
        </div>
      </div>
    </div>

    <!-- High -->
    <div class="col-span-4 select-container" :class="{
      selected: selectedIndustry === RiskLevelEnum.High,
      'high-selected': selectedIndustry === RiskLevelEnum.High,
    }">
      <label>
        <input type="radio" v-model="selectedIndustry" :value="RiskLevelEnum.High" class="radio-input" />
        <span>High</span>
      </label>

      <div class="circle" v-if="selectedIndustry === RiskLevelEnum.High"></div>
    </div>
  </div>
</template>
