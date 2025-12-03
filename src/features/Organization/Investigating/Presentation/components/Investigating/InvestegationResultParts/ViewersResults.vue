<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import ViewrResults from '@/assets/images/ViewrResults.png'
import ViewerResultsTree from '../InvestigatingResultsUtils/ViewerResultsTree.vue'

const emit = defineEmits(['update:data'])

const UpdateData = (data) => {
  emit('update:data', data)
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
    <ViewerResultsTree @update:data="UpdateData" />
  </div>
</template>
