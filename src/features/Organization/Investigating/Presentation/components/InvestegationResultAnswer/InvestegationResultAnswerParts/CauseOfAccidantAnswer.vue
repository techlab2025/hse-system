<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import factor from '@/assets/images/factor.png'
import CauseOfActionFactors from '../InvestegationResultAnswerUtils/CauseOfActionFactors.vue'
import type InvestegationFactorModel from '@/features/Organization/Investigating/Data/models/InvestigationFactorsModel'

const props = defineProps<{
  Factors: InvestegationFactorModel[]
}>()
</script>
<template>
  <div class="cause-of-accidant">
    <HeaderPage
      :title="`Root Cause Factors`"
      :subtitle="``"
      :img="factor"
      class="title-header answer-header"
    />

    <div class="accident-answer">
      <div
        class="accident-answer-factors-container"
        v-for="(factor, index) in Factors"
        :key="index"
      >
        <CauseOfActionFactors :factor="factor" />

        <div class="corrective-action" v-if="factor.corrective_action">
          <div class="corrective-action-header">
            <p class="corrective-action-title">Corrective Action</p>
            <hr />
          </div>
          <p class="corrective-action-content">{{ factor.corrective_action }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
