<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import ViewrResults from '@/assets/images/ViewrResults.png'
import ViewerResultsTree from '../InvestigatingResultsUtils/ViewerResultsTree.vue'
import InvestegationWitnessesParams from '@/features/Organization/Investigating/Core/params/investegationResult/InvestegationWitnessesParams'
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel.ts'

const emit = defineEmits(['update:data'])
const { viwers } = defineProps<{
  viwers?: InjuryDetailsModel[]
}>()

const UpdateData = (data) => {
  const witnesses = data.map(
    (item) =>
      new InvestegationWitnessesParams(
        item.result,
        item.employee?.id || null,
        item.employee?.id ? undefined : item.employee?.title,
      ),
  )

  emit('update:data', witnesses)
}
</script>
<template>
  <div class="viwers-result">
    <HeaderPage
      :title="`viewers result`"
      :subtitle="`Add a description of each witness to the incident.`"
      :img="ViewrResults"
      class="title-header"
    />
    <ViewerResultsTree :viwers="viwers" @update:data="UpdateData" />
  </div>
</template>
