<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import ViewrResults from '@/assets/images/ViewrResults.png'
import ALERT from '@/assets/images/ALERT.png'
import ViewerResultsTree from '../InvestigatingResultsUtils/ViewerResultsTree.vue'
import InvestegationWitnessesParams from '@/features/Organization/Investigating/Core/params/investegationResult/InvestegationWitnessesParams'
import InvestigationFiveQuestionParams from '@/features/Organization/Investigating/Core/params/investegationResult/InvestegationFiveQuestoinsParams'
import FiveWhyQuestionTree from '../InvestigatingResultsUtils/FiveWhyQuestionTree.vue'


const emit = defineEmits(['update:data'])

const UpdateData = (data) => {
  const witnesses = data.map(item =>
    new InvestigationFiveQuestionParams(
      {
        answer: item.answer,
        question: item.question || null
      }
    )
  )

  emit('update:data', witnesses)
}
</script>
<template>
  <div class="viwers-result ">
    <HeaderPage :title="`5 Why Questions`" :subtitle="`Add Your Quesions`" :img="ALERT" class="title-header" />
    <FiveWhyQuestionTree @update:data="UpdateData" />
  </div>
</template>

<style scoped>
.viwers-result {
  margin-bottom: 12px;
}
</style>
