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
  <div class="observation-container lg:grid grid-cols-12 gap-4 mt-6">
    <div
      class="col-span-6 select-container"
      :class="{ selected: selectedIndustry === 1 }"
    >
      <label>
        <input
          type="radio"
          v-model="selectedIndustry"
          :value="1"
          class="radio-input"
        />
        <span>Negative</span>
        <img :src="Check" alt="negative" />
      </label>
    </div>

    <div
      class="col-span-6 select-container"
      :class="{ selected: selectedIndustry === 2 }"
    >
      <label>
        <input
          type="radio"
          v-model="selectedIndustry"
          :value="2"
          class="radio-input"
        />
        <span>Positive</span>
        <img :src="alert" alt="positive" />
      </label>
    </div>
  </div>
</template>


