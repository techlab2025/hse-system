<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import factor from '@/assets/images/factor.png'
import { ref } from 'vue'
import SidebarVector from '@/shared/icons/SidebarVector.vue'

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
      <div class="accident-answer-factors-container">
        <div class="accident-answer-factors" v-for="(factor, index) in Factors" :key="index">
          <p class="main-factor">main factor : <span>{{ factor.mainFactor }}</span></p>
          <p class="sub-factor" v-for="(subfactor, index2) in factor.subFactors" :key="index2">
            <SidebarVector class="sub-factor-icon" />
            factor : <span>{{ subfactor.factor }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
