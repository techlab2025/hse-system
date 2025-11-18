<script lang="ts" setup>
import { ref, watch } from 'vue'
import Check from '@/assets/images/check.png'
import alert from '@/assets/images/alert-sign.png'

const emit = defineEmits(['update:data', 'update:activeTab'])
const selectedIndustry = ref(1)

watch(selectedIndustry, (val) => {
  emit('update:data', val)
})
</script>

<template>
  <div class="observation-level lg:grid grid-cols-12 gap-4 mt-6">
    <!-- Negative -->
    <div
      class="col-span-4 select-container"
      :class="{ selected: selectedIndustry === 1 }"
      @click="selectedIndustry = 1"
    >
      <label>
        <span>Low</span>
      </label>

      <!-- دائرة الاختيار -->
      <div class="circle" v-if="selectedIndustry === 1"></div>

      <div class="details-box" v-if="selectedIndustry === 1">
        <p class="status-label">Status:</p>

        <div class="status-container">
          <p class="status-value">Medium</p>
          <p class="status-values">Non</p>
        </div>
      </div>
    </div>

    <!-- Positive -->
    <div
      class="col-span-4 select-container"
      :class="{ selected: selectedIndustry === 2 }"
      @click="selectedIndustry = 2"
    >
      <label>
        <span>Medium</span>
      </label>

      <!-- دائرة الاختيار -->
      <div class="circle" v-if="selectedIndustry === 2"></div>

      <div class="details-box" v-if="selectedIndustry === 2">
        <p class="status-label">Status:</p>

        <div class="status-container">
          <p class="status-value">Medium</p>
          <p class="status-values">Non</p>
        </div>
      </div>
    </div>
    <!-- Positive -->
    <div
      class="col-span-4 select-container"
      :class="{ selected: selectedIndustry === 3 }"
      @click="selectedIndustry = 3"
    >
      <label>
        <span>Heigh</span>
      </label>

      <!-- دائرة الاختيار -->
      <div class="circle" v-if="selectedIndustry === 3"></div>

      <div class="details-box" v-if="selectedIndustry === 3">
        <p class="status-label">Status:</p>

        <div class="status-container">
          <p class="status-value">Medium</p>
          <p class="status-values">Non</p>
        </div>
      </div>
    </div>
  </div>
</template>
