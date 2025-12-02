<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import ShowInvestigatingController from '../../controllers/showInvestigatingController'
import ShowInvestigatingParams from '../../../Core/params/showInvestigatingParams'
import EditInvestigatingController from '../../controllers/editInvestigatingController'
import InvestigationMeetingForm from './InvestigationMeetingForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showInvestigatingController = ShowInvestigatingController.getInstance()
const state = ref(showInvestigatingController.state.value)
const fetchInvestigatingDetails = async () => {
  const InvestigatingParams = new ShowInvestigatingParams(Number(id))

  await showInvestigatingController.showInvestigating(InvestigatingParams)
}

onMounted(() => {
  fetchInvestigatingDetails()
})

const EditInvestigating = async (draft: boolean) => {
  if (draft) {
    await EditInvestigatingController.getInstance().editInvestigating(params.value!, router)
  } else {
    await EditInvestigatingController.getInstance().editInvestigating(params.value!, router)
  }
}

watch(
  () => showInvestigatingController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditInvestigating">
        <InvestigationMeetingForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
