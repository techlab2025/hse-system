<script lang="ts" setup>
import { ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import FactorItemIcon from '@/shared/icons/FactorItemIcon.vue'
import type FactoryModel from '@/features/setting/Factory/Data/models/FactoryModel';
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel';

const props = defineProps<{
  factors: FactoryModel[]
  subfactors: FactoryItemModel[]
}>()

const selectedFactors = ref<string[]>([])
const selectedSubs = ref<Record<string, string[]>>({})


const emit = defineEmits(['update:data', 'update:sub-factors'])

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
      <div class="flex flex-col gap-1">
        <span>Factors</span>
        <span class="subtitle">Select the main factor</span>
      </div>
    </label>
    <div class="radio-grid">
      <div class="radio-column" v-for="(Factors, index) in factors" :key="index">
        <div class="radio-item" @click="$emit('update:sub-factors', Factors?.id)">
          <Checkbox v-model="selectedFactors" :inputId="`${Factors.title}-${Factors.id}`" :value="Factors.id"
            name="factors" />
          <label class="radio-label" :for="`${Factors.title}-${Factors.id}`">{{ Factors.title }}</label>
        </div>
        <di v-if="selectedFactors.some((factor) => factor === Factors?.id) && (Factors?.id)" class="sub-radio-group">
          <div class="sub-radio-item"
            v-for="(subfactor, subindex) in subfactors?.filter((sub) => sub.factory?.id === Factors?.id)"
            :key="subindex">
            <Checkbox v-model="selectedSubs[Factors.id]" :value="subfactor?.id"
              :inputId="`${subfactor.id}-${subfactor.id}`" name="sub-factors" />
            <label :for="`${subfactor.id}-${subfactor.id}`" class="sub-radio-label">{{ subfactor.title }}</label>
          </div>
        </di>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subtitle {
  color: #BDCBDA;
  font-size: 14px;
  font-weight: 500;
}
</style>
