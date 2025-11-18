<script lang="ts" setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update:data', 'update:activeTab'])
const selectedIndustry = ref(1)

watch(selectedIndustry, (val) => {
  emit('update:data', val)
})
</script>

<template>
  <div class="observation-level lg:grid grid-cols-12 gap-4 mt-6">
    <!-- Low -->
    <div
      class="col-span-4 select-container"
      :class="{
        selected: selectedIndustry === 1,
        'low-selected': selectedIndustry === 1,
      }"
    >
      <label>
        <input type="radio" v-model="selectedIndustry" :value="1" class="radio-input" />
        <span>Low</span>
      </label>

      <div class="circle" v-if="selectedIndustry === 1"></div>


    </div>

    <!-- Medium -->
    <div
      class="col-span-4 select-container"
      :class="{
        selected: selectedIndustry === 2,
        'medium-selected': selectedIndustry === 2,
      }"
    >
      <label>
        <input type="radio" v-model="selectedIndustry" :value="2" class="radio-input" />
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

    <!-- High -->
    <div
      class="col-span-4 select-container"
      :class="{
        selected: selectedIndustry === 3,
        'high-selected': selectedIndustry === 3,
      }"
    >
      <label>
        <input type="radio" v-model="selectedIndustry" :value="3" class="radio-input" />
        <span>High</span>
      </label>

      <div class="circle" v-if="selectedIndustry === 3"></div>

    
    </div>
  </div>
</template>
