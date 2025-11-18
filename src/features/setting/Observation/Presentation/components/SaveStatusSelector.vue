<script lang="ts" setup>
import { ref, watch } from 'vue'
import Check from '@/assets/images/check.png'
import alert from '@/assets/images/alert-sign.png'

const emit = defineEmits(['update:saveStatus']) 

const selectedSaveStatus = ref<0 | 1 | null>(null)

watch(selectedSaveStatus, (val) => {
  emit('update:saveStatus', val) 
}, { immediate: false })
</script>

<template>
  <div class="observation-container lg:grid grid-cols-12 gap-4 mt-6">
    <!-- Negative = 1 -->
    <div
      class="col-span-6 select-container"
      :class="{ selected: selectedSaveStatus === 1 }"
    >
      <label>
        <input
          type="radio"
          v-model="selectedSaveStatus"
          :value="1"
          class="radio-input"
        />
        <span>Negative</span>
        <img :src="Check" alt="negative" />
      </label>
    </div>

    <!-- Positive = 0 -->
    <div
      class="col-span-6 select-container"
      :class="{ selected: selectedSaveStatus === 0 }"
    >
      <label>
        <input
          type="radio"
          v-model="selectedSaveStatus"
          :value="0"
          class="radio-input"
        />
        <span>Positive</span>
        <img :src="alert" alt="positive" />
      </label>
    </div>
  </div>
</template>