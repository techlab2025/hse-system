<script setup lang="ts">
import SidebarVector from '@/shared/icons/SidebarVector.vue'
import type InvestegationFactorModel from '@/features/Organization/Investigating/Data/models/InvestigationFactorsModel'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const { user } = useUserStore()

const props = defineProps<{
  factor: InvestegationFactorModel
}>()

const selectedLocale = computed(() => {
  return user?.languages?.find((l: any) => l.selected)?.locale ?? 'en'
})

const factoryTitle = computed(() => {
  return (
    props?.factor?.factory?.titles?.find(
      t => t.locale === selectedLocale.value
    )?.title ?? ''
  )
})
</script>


<template>
  <div class="accident-answer-factors">
    <p class="main-factor">main factor : <span>{{ factoryTitle }}</span></p>
    <p class="sub-factor" v-for="(subfactor, index2) in factor.investigation_factor_items" :key="index2">
      <SidebarVector class="sub-factor-icon" />
      factor : <span>{{ subfactor }}</span>
    </p>
  </div>
</template>
