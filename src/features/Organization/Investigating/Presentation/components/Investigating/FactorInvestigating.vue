<script lang="ts" setup>
import { ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import FactorItemIcon from '@/shared/icons/FactorItemIcon.vue'

const selectedFactors = ref<string[]>([])
const selectedSubs = ref<Record<string, string[]>>({})

// كلهم Factors
const factorsMap = {
  factor1: [
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub11' },
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub12' },
  ],
  factor2: [
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub21' },
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub22' },
  ],
  factor3: [
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub31' },
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub32' },
  ],
  factor4: [
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub41' },
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub42' },
  ],
}

const emit = defineEmits(['update:data'])

watch([selectedFactors, selectedSubs], () => {
  const result = selectedFactors.value.map(factor => ({
    factor,
    subs: selectedSubs.value[factor] || []
  }))

  emit('update:data', result)
}, { deep: true })
</script>

<template>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full factor-item factor-items-container">
    <label class="flex gap-2 factot-title">
      <FactorItemIcon />
      <span>Factors</span>
    </label>
    <div class="radio-grid">
      <div class="radio-column" v-for="(subs, factor) in factorsMap" :key="factor">
        <div class="radio-item">
          <Checkbox v-model="selectedFactors" :inputId="factor" :value="factor" name="factors" />
          <label class="radio-label" :for="factor">{{ factor }}</label>
        </div>
        <div v-if="selectedFactors.includes(factor)" class="sub-radio-group">
          <div class="sub-radio-item" v-for="s in subs" :key="s.value">
            <Checkbox v-model="selectedSubs[factor]" :value="s.value" :inputId="s.value" name="sub-factors" />
            <label :for="s.value" class="sub-radio-label">{{ s.label }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
