<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import factor from '@/assets/images/factor.png'
import { ref } from 'vue'
import SidebarVector from '@/shared/icons/SidebarVector.vue'
import CauseOfActionFactors from '../InvestegationResultAnswerUtils/CauseOfActionFactors.vue'

const descripe = ref<string>('')

const emit = defineEmits(['update:data'])


const UpdateData = (data) => {
  emit('update:data', {
    description: descripe.value,
  })
}

const props = defineProps<{
  Factors: any[]
}>()
</script>
<template>
  <div class="cause-of-accidant">
    <HeaderPage :title="`Causes of the accident`"
      :subtitle="`Choose the reasons for the incident and write how to prevent it from happening again`" :img="factor"
      class="title-header" />
    <div class="accident-answer">
      <div class="accident-answer-factors-container" v-for="(factor, index) in Factors" :key="index">
        <CauseOfActionFactors :factor="factor" />

        <div class="corrective-action">
          <div class="corrective-action-header">
            <p class="corrective-action-title">Corrective Action</p>
            <hr>
          </div>
          <p class="corrective-action-content">{{ factor.correctiveAnswer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
